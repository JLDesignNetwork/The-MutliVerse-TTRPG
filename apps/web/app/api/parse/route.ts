import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Critical System Warning: GEMINI_API_KEY environment variable is missing.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

function validateAndBalanceArray(approaches: Record<string, number>): Record<string, number> {
  const keys = ['force', 'precision', 'fortitude', 'insight', 'presence'];
  let total = 0;

  keys.forEach(key => {
    approaches[key] = Math.max(0, Math.min(5, Math.round(approaches[key] || 0)));
    total += approaches[key];
  });

  if (total !== 12 && total > 0) {
    keys.forEach(key => {
      approaches[key] = Math.round((approaches[key] / total) * 12);
    });

    let adjustedTotal = keys.reduce((sum, k) => sum + approaches[k], 0);
    let iterations = 0;
    while (adjustedTotal !== 12 && iterations < 12) {
      for (const key of keys) {
        if (adjustedTotal < 12 && approaches[key] < 5) {
          approaches[key]++;
          adjustedTotal++;
        } else if (adjustedTotal > 12 && approaches[key] > 0) {
          approaches[key]--;
          adjustedTotal--;
        }
        if (adjustedTotal === 12) break;
      }
      iterations++;
    }
  } else if (total === 0) {
    approaches = { force: 3, precision: 3, fortitude: 2, insight: 2, presence: 2 };
  }

  return approaches;
}

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing." }, { status: 500 });
    }

    const formData = await req.formData();
    const method = formData.get("method") as string || "upload";
    const type = formData.get("type") as string || "pdf";
    const explicitSystem = formData.get("explicitSystem") as string | null;
    
    // Bypass parsing for Generic System
    if (explicitSystem === "Other / Generic System") {
      return NextResponse.json({
        name: "Unknown Character",
        pronouns: "They/Them",
        nativeRace: "Unknown",
        nativeClass: "Unknown",
        nativeSubclass: "Unknown",
        nativeSystem: "Other / Generic System",
        faction: "Unaligned",
        description: "",
        approaches: { force: 0, precision: 0, fortitude: 0, insight: 0, presence: 0 },
        tags: {
          origin: { freeAllotment: 1, extracted: [], selected: [] },
          race: { freeAllotment: 1, extracted: [], selected: [] },
          class: { freeAllotment: 1, extracted: [], selected: [] },
          path: { freeAllotment: 2, extracted: [], selected: [] },
          background: { freeAllotment: 1, extracted: [], selected: [] }
        },
        resources: { currentPowerScale: 1, maxSlots: 5, investedSlots: 0, availableSlots: 5 },
        inventory: [],
        translationBudget: { totalImportedExp: 0, expSpentOnSlots: 0, remainingExp: 0 },
        upgradeOptions: []
      });
    }

    let buffer: Buffer;
    let mimeType = "application/pdf";
    let rawTextForDetection = "";

    if (method === "json") {
      const content = formData.get("content") as string;
      if (!content) return NextResponse.json({ error: "No JSON content provided." }, { status: 400 });
      buffer = Buffer.from(content, "utf-8");
      mimeType = "text/plain";
      rawTextForDetection = content;
    } else if (method === "url") {
      const url = formData.get("content") as string;
      if (!url) return NextResponse.json({ error: "No URL provided." }, { status: 400 });
      
      try {
        const fetchRes = await fetch(url);
        if (!fetchRes.ok) throw new Error("Failed to reach the provided URL");
        
        const contentType = fetchRes.headers.get("content-type") || "";
        if (!contentType.includes("application/pdf")) {
          return NextResponse.json({ error: "The provided URL does not point to a valid PDF document." }, { status: 400 });
        }
        
        const arrayBuffer = await fetchRes.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        // Quick pass text extraction from raw buffer (naive but catches uncompressed strings)
        rawTextForDetection = buffer.toString('utf-8');
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else {
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
      
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = file.type || (file.name.endsWith(".md") ? "text/markdown" : "application/pdf");
      rawTextForDetection = buffer.toString('utf-8');
    }

    // System Detection Pre-flight
    if (!explicitSystem) {
      const markers = /dungeons|d&d|pathfinder|starfinder|warhammer|cyberpunk|vampire|cthulhu/i;
      if (!markers.test(rawTextForDetection)) {
        return NextResponse.json({ requiresSystemSelection: true });
      }
    }

    // Deterministic D&D Beyond Bypass
    if (method === "json" && (explicitSystem === "Dungeons & Dragons 5e" || (rawTextForDetection.includes('"stats":') && rawTextForDetection.includes('"classes":')))) {
      try {
        const jsonData = JSON.parse(rawTextForDetection);
        const { DnDBeyondParser } = await import("../../../services/parsers/DnDBeyondParser");
        const parser = new DnDBeyondParser();
        const parsedData = parser.parse(jsonData);
        return NextResponse.json(parsedData);
      } catch (e: any) {
        console.warn("Failed to deterministically parse D&D Beyond JSON. Falling back to Gemini.", e.message);
      }
    }

    const systemInstruction = `
      You are an expert TTRPG Translation Engine. Your job is to parse external character sheets and translate them into the mathless, narrative-first "Multiverse TTRPG" ruleset.
      ${explicitSystem ? `\n      The user has explicitly stated this character is from: ${explicitSystem}. Tailor your extraction accordingly.` : ''}
      
      CONVERSION LAWS:
      1. THE 12-DIE ARRAY: Distribute exactly 12 total points across force, precision, fortitude, insight, presence. Max 5, Min 0. High native skills DO NOT boost these numbers on import.
      2. EXP BUDGET: Calculate the character's total imported EXP based on their native level: Lvl 1 = 0 EXP, Lvl 5 = 25 EXP, Lvl 10 = 67 EXP, Lvl 15 = 132 EXP, Lvl 20 = 220 EXP. Interpolate for other levels.
      3. POWER SCALE: Power Scale MUST map explicitly from native level: Levels 1-4 = Power Scale 1, Levels 5-10 = Power Scale 2, Levels 11-16 = Power Scale 3, Levels 17-20+ = Power Scale 4.
      4. SLOTS & INVENTORY: Base slots = 5 + (PowerScale * 2). Evaluate if inventory items are mundane (0 slots) or major (1 slot). Natural weapons (claws, beaks, etc.) or physiological features are NOT physical inventory items and must be excluded from the inventory array entirely. If major items exceed base slots, calculate extra slots needed and auto-deduct 4 EXP per extra slot from the remaining EXP budget.
      5. BESPOKE UPGRADES: Generate an array of 5 to 8 unique 'upgradeOptions' (Path Tags, Mastery Tags, and Approach Bumps) tailored to the character's lore, class capstones, and epic boons. Set realistic EXP costs (Path=4, Mastery=8, ApproachBump cost scales: 1->2 costs 4, 2->3 costs 6, 3->4 costs 8, 4->5 costs 10).
      6. THE ABSOLUTE BASELINE: The 1+1+1+2+1 structure (1 Origin, 1 Race, 1 Class, 2 Path, 1 Background) is the Absolute Baseline allotment. It is NOT a maximum limit for Race, Class, and Path tags. High-level imported characters WILL possess more tags than this baseline. Assign the core tags to the baseline 'selected' arrays, and push all overflow Race, Class, and Path tags into the 'extracted' arrays so the user can purchase them with their EXP budget. Do NOT extract or allow additional Origin or Background tags.
      7. CURATED OPTIONS: For Origin, Race, Class, Path, and Background tags, provide your best default 'selected' guess, BUT ALSO generate an 'options' array containing 3 to 6 highly compatible alternative tags.
      8. SUBCLASS: Extract the character's specific subclass or specialty to 'nativeSubclass'. Do NOT put the system name here.
      9. SPELLS & CANTRIPS: If the character has prepared spells or cantrips, extract them. Map 2 APs to "2 AP" and 1 APs/reactions to "1 AP". Translate ranges to tags (e.g. [System: Range 30ft]). For Spells, 'slotsOccupied' should include mastery tier info if applicable (e.g. "Tier 2 (2 Slots)"). For Cantrips, it should simply be "1 Slot".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { inlineData: { data: buffer.toString("base64"), mimeType: mimeType } },
        "Analyze the document and execute a complete character translation.",
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            pronouns: { type: Type.STRING },
            nativeRace: { type: Type.STRING },
            nativeClass: { type: Type.STRING },
            nativeSubclass: { type: Type.STRING },
            nativeSystem: { type: Type.STRING },
            faction: { type: Type.STRING },
            description: { type: Type.STRING },
            approaches: {
              type: Type.OBJECT,
              properties: {
                force: { type: Type.INTEGER },
                precision: { type: Type.INTEGER },
                fortitude: { type: Type.INTEGER },
                insight: { type: Type.INTEGER },
                presence: { type: Type.INTEGER },
              },
              required: ["force", "precision", "fortitude", "insight", "presence"],
            },
            tags: {
              type: Type.OBJECT,
              properties: {
                origin: {
                  type: Type.OBJECT,
                  properties: { freeAllotment: { type: Type.INTEGER }, extracted: { type: Type.ARRAY, items: { type: Type.OBJECT } }, selected: { type: Type.ARRAY, items: { type: Type.OBJECT } } },
                },
                race: {
                  type: Type.OBJECT,
                  properties: { freeAllotment: { type: Type.INTEGER }, extracted: { type: Type.ARRAY, items: { type: Type.OBJECT } }, selected: { type: Type.ARRAY, items: { type: Type.OBJECT } } },
                },
                class: {
                  type: Type.OBJECT,
                  properties: { freeAllotment: { type: Type.INTEGER }, extracted: { type: Type.ARRAY, items: { type: Type.OBJECT } }, selected: { type: Type.ARRAY, items: { type: Type.OBJECT } } },
                },
                path: {
                  type: Type.OBJECT,
                  properties: { freeAllotment: { type: Type.INTEGER }, extracted: { type: Type.ARRAY, items: { type: Type.OBJECT } }, selected: { type: Type.ARRAY, items: { type: Type.OBJECT } } },
                },
                background: {
                  type: Type.OBJECT,
                  properties: { freeAllotment: { type: Type.INTEGER }, extracted: { type: Type.ARRAY, items: { type: Type.OBJECT } }, selected: { type: Type.ARRAY, items: { type: Type.OBJECT } } },
                }
              },
              required: ["origin", "race", "class", "path", "background"],
            },
            resources: {
              type: Type.OBJECT,
              properties: {
                currentPowerScale: { type: Type.INTEGER },
                maxSlots: { type: Type.INTEGER },
                investedSlots: { type: Type.INTEGER },
                availableSlots: { type: Type.INTEGER },
              },
              required: ["currentPowerScale", "maxSlots", "investedSlots", "availableSlots"],
            },
            inventory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  domainTags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  slotsUsed: { type: Type.INTEGER },
                  notes: { type: Type.STRING },
                },
                required: ["name", "domainTags", "slotsUsed"],
              },
            },
            translationBudget: {
              type: Type.OBJECT,
              properties: {
                totalImportedExp: { type: Type.INTEGER },
                expSpentOnSlots: { type: Type.INTEGER },
                remainingExp: { type: Type.INTEGER },
              },
              required: ["totalImportedExp", "expSpentOnSlots", "remainingExp"],
            },
            spells: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  slotsOccupied: { type: Type.STRING },
                  apCostRange: { type: Type.STRING },
                  effectNotes: { type: Type.STRING }
                }
              }
            },
            cantrips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  slotsOccupied: { type: Type.STRING },
                  apCostRange: { type: Type.STRING },
                  effectNotes: { type: Type.STRING }
                }
              }
            },
            upgradeOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  targetApproach: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  expCost: { type: Type.INTEGER },
                },
                required: ["id", "type", "name", "description", "expCost"],
              },
            },
          },
          required: ["name", "nativeSystem", "approaches", "tags", "resources", "inventory", "translationBudget", "upgradeOptions"],
        },
      },
    });

    const rawResponseText = response.text;
    if (!rawResponseText) throw new Error("Empty response received.");

    const parsedData = JSON.parse(rawResponseText);
    parsedData.approaches = validateAndBalanceArray(parsedData.approaches);
    parsedData.unassignedCorePoints = 0;

    // Initialize masteryTags if not present
    if (!parsedData.tags.masteryTags) {
      parsedData.tags.masteryTags = [];
    }

    const scale = parsedData.resources.currentPowerScale || 1;
    parsedData.resources.maxSlots = 5 + scale * 2;

    // Auto-calculate extra slots if investedSlots exceed base max slots
    let extraSlotsPurchased = 0;
    if (parsedData.resources.investedSlots > parsedData.resources.maxSlots) {
      extraSlotsPurchased = parsedData.resources.investedSlots - parsedData.resources.maxSlots;
      parsedData.resources.maxSlots = parsedData.resources.investedSlots;
    }

    parsedData.resources.availableSlots = parsedData.resources.maxSlots - (parsedData.resources.investedSlots || 0);

    // Enforce translation budget
    if (parsedData.translationBudget) {
      const slotsCost = extraSlotsPurchased * 4;
      parsedData.translationBudget.expSpentOnSlots = slotsCost;
      parsedData.translationBudget.remainingExp = parsedData.translationBudget.totalImportedExp - slotsCost;
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Parser Route Operational Failure:", error);
    return NextResponse.json({ error: "Internal Error", details: error.message }, { status: 500 });
  }
}
