import os

BASE_DIR = "/Volumes/Kingston-256/_DevSites/Active/the-multiverse"
HB_DIR = os.path.join(BASE_DIR, "homebrewery")
SEC_DIR = os.path.join(HB_DIR, "sections")

os.makedirs(SEC_DIR, exist_ok=True)

# Clean up
for root, dirs, files in os.walk(SEC_DIR):
    for f in files:
        if f.endswith(".md"):
            os.remove(os.path.join(root, f))
master_brew = os.path.join(HB_DIR, "master_brew.txt")
if os.path.exists(master_brew):
    os.remove(master_brew)

def append_file(filepath, destpath):
    if os.path.exists(filepath):
        print(f"Appending {os.path.basename(filepath)}...")
        with open(filepath, "r", encoding="utf-8") as infile:
            content = infile.read()
        with open(destpath, "a", encoding="utf-8") as outfile:
            outfile.write(content + "\n\n\\page\n\n")
    else:
        print(f"Warning: {filepath} not found!")

# 00_Front_Matter
front_matter_path = os.path.join(SEC_DIR, "00_Front_Matter.md")
with open(front_matter_path, "w", encoding="utf-8") as f:
    f.write("# The Multiverse TTRPG\n### Core Manual\n*(Insert Front Cover Image Here)*\n\n\\page\n\n")
    f.write("# Table of Contents\n## Book I: The Shattered Cosmos\n## Book II: The Laws of Reality\n## Book III: The Wayfarer's Path\n## Book IV: Chronicles of the Shattered\n## Appendices\n\n\\page\n")

# 01_Book_I
book_1_path = os.path.join(SEC_DIR, "01_Book_I.md")
with open(book_1_path, "w", encoding="utf-8") as f:
    f.write("# Book I\n## The Shattered Cosmos\n*(Insert Book I Splash Art Here)*\n\n\\page\n")
append_file(os.path.join(BASE_DIR, "01-Book-I-The-Shattered-Cosmos/01-The-Shattering.md"), book_1_path)
append_file(os.path.join(BASE_DIR, "01-Book-I-The-Shattered-Cosmos/02-Zero-Point-Station.md"), book_1_path)
append_file(os.path.join(BASE_DIR, "01-Book-I-The-Shattered-Cosmos/03-Factions-and-The-Rift-Guard.md"), book_1_path)
append_file(os.path.join(BASE_DIR, "01-Book-I-The-Shattered-Cosmos/04-The-Grand-Purpose.md"), book_1_path)

# 02_Book_II
book_2_path = os.path.join(SEC_DIR, "02_Book_II.md")
with open(book_2_path, "w", encoding="utf-8") as f:
    f.write("# Book II\n## The Laws of Reality\n*(Insert Book II Splash Art Here)*\n\n\\page\n")
append_file(os.path.join(BASE_DIR, "02-Book-II-The-Laws-of-Reality/01-Core-Resolution.md"), book_2_path)
append_file(os.path.join(BASE_DIR, "02-Book-II-The-Laws-of-Reality/02-The-Action-Economy.md"), book_2_path)
append_file(os.path.join(BASE_DIR, "02-Book-II-The-Laws-of-Reality/03-The-Status-Manifest.md"), book_2_path)
append_file(os.path.join(BASE_DIR, "02-Book-II-The-Laws-of-Reality/04-The-Threat-System.md"), book_2_path)
append_file(os.path.join(BASE_DIR, "02-Book-II-The-Laws-of-Reality/05-The-Scale-of-Reality.md"), book_2_path)

# 03_Book_III
book_3_path = os.path.join(SEC_DIR, "03_Book_III.md")
with open(book_3_path, "w", encoding="utf-8") as f:
    f.write("# Book III\n## The Wayfarer's Path\n*(Insert Book III Splash Art Here)*\n\n\\page\n")
append_file(os.path.join(BASE_DIR, "03-Book-III-The-Wayfarers-Path/01-Identity-and-Origins.md"), book_3_path)
append_file(os.path.join(BASE_DIR, "03-Book-III-The-Wayfarers-Path/02-The-Tag-Permission-Registry.md"), book_3_path)
append_file(os.path.join(BASE_DIR, "03-Book-III-The-Wayfarers-Path/03-Approaches-and-Arrays.md"), book_3_path)
append_file(os.path.join(BASE_DIR, "03-Book-III-The-Wayfarers-Path/04-Advancement-EXP.md"), book_3_path)
append_file(os.path.join(BASE_DIR, "03-Book-III-The-Wayfarers-Path/05-Equipment-and-Slots.md"), book_3_path)

# 04_Book_IV
book_4_path = os.path.join(SEC_DIR, "04_Book_IV.md")
with open(book_4_path, "w", encoding="utf-8") as f:
    f.write("# Book IV\n## Chronicles of the Shattered\n*(Insert Book IV Splash Art Here)*\n\n\\page\n")
append_file(os.path.join(BASE_DIR, "04-Book-IV-Chronicles-of-the-Shattered/01-The-Infinite-Archive.md"), book_4_path)
append_file(os.path.join(BASE_DIR, "04-Book-IV-Chronicles-of-the-Shattered/01-Adversaries.md"), book_4_path)
append_file(os.path.join(BASE_DIR, "04-Book-IV-Chronicles-of-the-Shattered/02-Archive-DnD-5e.md"), book_4_path)
append_file(os.path.join(BASE_DIR, "04-Book-IV-Chronicles-of-the-Shattered/05-Archive-Warhammer-40k.md"), book_4_path)

# 05_Appendices
book_5_path = os.path.join(SEC_DIR, "05_Appendices.md")
with open(book_5_path, "w", encoding="utf-8") as f:
    f.write("# Appendices\n*(Insert Appendices Splash Art Here)*\n\n\\page\n")
append_file(os.path.join(BASE_DIR, "05-Appendices/02-Governance.md"), book_5_path)
append_file(os.path.join(BASE_DIR, "05-Appendices/03-Interaction-and-Damage.md"), book_5_path)
append_file(os.path.join(BASE_DIR, "05-Appendices/04-Cross-Universe-Physics.md"), book_5_path)
append_file(os.path.join(BASE_DIR, "05-Appendices/05-The-Economy.md"), book_5_path)

# 06_Back_Cover
book_6_path = os.path.join(SEC_DIR, "06_Back_Cover.md")
with open(book_6_path, "w", encoding="utf-8") as f:
    f.write("# The Multiverse Awaits\n*(Insert Back Cover Art Here)*\n")

print("Concatenating into master_brew.txt...")
sections = [front_matter_path, book_1_path, book_2_path, book_3_path, book_4_path, book_5_path, book_6_path]
with open(master_brew, "w", encoding="utf-8") as outfile:
    for sec in sections:
        with open(sec, "r", encoding="utf-8") as infile:
            outfile.write(infile.read() + "\n\n")

print(f"Done! The file {master_brew} is ready.")
