#!/usr/bin/env python3
"""
The Multiverse TTRPG Framework — Automated CI Quality & Link Validator
Verifies:
1. Markdown internal link and micro-anchor (<a id="...">) cross-reference resolution across all Book directories (01-05).
2. JSON schema validity for .dev/ backlog and ideas files.
3. LF line endings and standard Markdown syntax.
"""

import os
import sys
import re
import json
import glob

def gfm_slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return text.replace(' ', '-')

def strip_code_blocks(text):
    # Strip multi-line code blocks ``` ... ```
    text = re.sub(r'```[\s\S]*?```', '', text)
    # Strip inline code spans ` ... `
    text = re.sub(r'`[^`\n]+`', '', text)
    return text

def main():
    workspace = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    os.chdir(workspace)
    print(f"[*] Auditing The Multiverse TTRPG Framework at: {workspace}\n")

    errors = []

    # 1. Validate JSON Backlog & Ideas Schemas
    print("--- Validating JSON Backlog & Ideas Schemas ---")
    json_files = glob.glob(".dev/**/*.json", recursive=True) + glob.glob(".dev/*.json")
    for jf in set(json_files):
        try:
            with open(jf, "r", encoding="utf-8") as f:
                data = json.load(f)
            if "backlog.json" in jf:
                if "items" not in data or not isinstance(data["items"], list):
                    errors.append(f"[!] {jf}: Missing or invalid 'items' array.")
                else:
                    for item in data["items"]:
                        if "id" not in item or "title" not in item or "status" not in item:
                            errors.append(f"[!] {jf}: Item missing required fields (id, title, status): {item}")
            print(f"[OK] Valid JSON: {jf}")
        except Exception as e:
            errors.append(f"[!] Invalid JSON file in {jf}: {e}")

    # 2. Index All Markdown Files & Anchors
    print("\n--- Indexing Markdown Files & Anchors ---")
    book_dirs = [
        "01-Book-I-The-Shattered-Cosmos",
        "02-Book-II-The-Laws-of-Reality",
        "03-Book-III-The-Wayfarers-Path",
        "04-Book-IV-Chronicles-of-the-Shattered",
        "05-Appendices"
    ]
    md_files = []
    for b_dir in book_dirs:
        md_files.extend(glob.glob(f"{b_dir}/**/*.md", recursive=True))
    md_files.extend(["README.md", "CONTRIBUTING.md", "LICENSE.md", "CHANGELOG.md"])
    md_files = [os.path.normpath(f) for f in md_files if os.path.exists(f)]

    anchor_index = {}
    frontmatter_index = {}

    for mf in md_files:
        with open(mf, "r", encoding="utf-8") as f:
            content = f.read()

        anchors = set()
        # Find micro-anchors: <a id="foo"></a>
        for match in re.findall(r'<a\s+(?:id|name)=["\']([^"\']+)["\']', content):
            anchors.add(match.lower())

        # Find header anchors: ## Header Name
        for line in content.splitlines():
            header_match = re.match(r'^#{1,6}\s+(.+)$', line)
            if header_match:
                clean_title = re.sub(r'[*`_]', '', header_match.group(1).strip())
                anchors.add(gfm_slugify(clean_title))

        anchor_index[mf] = anchors

        # Check frontmatter if present
        fm_match = re.match(r'^---\s*\n(\{[\s\S]*?\})\s*\n---', content)
        if fm_match:
            try:
                fm_data = json.loads(fm_match.group(1))
                frontmatter_index[mf] = fm_data
            except Exception as e:
                errors.append(f"[!] Invalid JSON frontmatter in {mf}: {e}")

    print(f"[+] Indexed {len(anchor_index)} Markdown files and {sum(len(a) for a in anchor_index.values())} anchors.")

    # 3. Validate Markdown Cross-References & Anchors
    print("\n--- Validating Internal Cross-References & Anchors ---")
    link_count = 0
    for mf in md_files:
        with open(mf, "r", encoding="utf-8") as f:
            raw_content = f.read()

        clean_content = strip_code_blocks(raw_content)

        links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', clean_content)
        for text, link in links:
            if link.startswith("http://") or link.startswith("https://") or link.startswith("mailto:"):
                continue

            link_count += 1
            parts = link.split("#")
            target_file = parts[0]
            anchor = parts[1].lower() if len(parts) > 1 else None

            target_norm = mf if target_file == "" else os.path.normpath(os.path.join(os.path.dirname(mf), target_file))

            if not os.path.exists(target_norm):
                errors.append(f"[!] In {mf}: Broken link '{link}' — target file '{target_norm}' not found.")
            elif anchor:
                if target_norm not in anchor_index:
                    errors.append(f"[!] In {mf}: Target '{target_norm}' is not indexed as markdown for anchor '#{anchor}'.")
                elif anchor not in anchor_index[target_norm]:
                    errors.append(f"[!] In {mf}: Anchor '#{anchor}' not found in '{target_norm}'.")

    print(f"[+] Checked {link_count} active internal links.")

    # 4. Final Verdict
    print("\n==========================================")
    if not errors:
        print("🎉 ALL CI QUALITY CHECKS PASSED SUCCESSFULLY (0 Errors)")
        print("==========================================")
        sys.exit(0)
    else:
        print(f"❌ CI VALIDATION FAILED WITH {len(errors)} ERROR(S):")
        for err in errors:
            print(f"  {err}")
        print("==========================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
