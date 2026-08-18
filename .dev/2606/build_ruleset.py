#!/opt/homebrew/bin/python3
"""
The Multiverse TTRPG Framework — Automated PDF Build Pipeline
Version: 2606.1.0-bs | Book Version: 1.0
Author: Jeff Langdon (JLDN)

Parses .homebrewery/master_brew.txt and compiles it with Pandoc + Paged.js CLI
into a pixel-perfect, print-ready PDF matching the Homebrewery aesthetic.
"""

import os
import shutil
import subprocess
import sys
import re

WORKSPACE_DIR = "/Volumes/Kingston-256/_DevSites/Active/the-multiverse"

def get_books_dirs():
    for root_name in [".books", "books"]:
        gen_dir = os.path.join(WORKSPACE_DIR, root_name, "2606")
        if os.path.isdir(gen_dir):
            html_dir = os.path.join(gen_dir, "html")
            pdf_dir = os.path.join(gen_dir, "pdf")
            assets_dir = os.path.join(gen_dir, "assets")
            os.makedirs(pdf_dir, exist_ok=True)
            return html_dir, pdf_dir, assets_dir
    return None, None, None

def find_pagedjs():
    p = shutil.which("pagedjs-cli")
    if p:
        return p
    user_pnpm = os.path.expanduser("~/Library/pnpm/bin/pagedjs-cli")
    if os.path.exists(user_pnpm):
        return user_pnpm
    return None

def find_chrome():
    chrome_root = os.path.expanduser("~/.cache/puppeteer/chrome")
    if os.path.isdir(chrome_root):
        for build in sorted(os.listdir(chrome_root), reverse=True):
            candidate = os.path.join(
                chrome_root, build, "chrome-mac-arm64", "Google Chrome for Testing.app",
                "Contents", "MacOS", "Google Chrome for Testing",
            )
            if os.path.exists(candidate):
                return candidate
    
    sys_chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if os.path.exists(sys_chrome):
        return sys_chrome
    return None

def convert_markdown_snippet(md_text):
    """Run markdown text through Pandoc to generate clean HTML5."""
    try:
        proc = subprocess.run(
            ["/opt/homebrew/bin/pandoc", "-f", "gfm+pipe_tables+raw_html", "-t", "html5"],
            input=md_text,
            text=True,
            capture_output=True,
            check=True
        )
        return proc.stdout
    except Exception as e:
        print(f"[!] Pandoc conversion error: {e}")
        return md_text

def parse_master_brew(brew_path):
    """Parse master_brew.txt into individual structured page objects."""
    if not os.path.exists(brew_path):
        print(f"[-] Error: master_brew.txt not found at: {brew_path}")
        return []

    with open(brew_path, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # Split by \page
    raw_pages = raw_text.split("\\page")
    parsed_pages = []

    page_counter = 0

    for idx, page_content in enumerate(raw_pages):
        page_str = page_content.strip()
        if not page_str:
            continue

        page_classes = ["page"]
        
        # Detect Special Page Directives
        if "{{frontCover}}" in page_str:
            page_classes.append("frontCover")
            page_str = page_str.replace("{{frontCover}}", "")
        if "{{chapterCover}}" in page_str:
            page_classes.append("chapterCover")
            page_str = page_str.replace("{{chapterCover}}", "")
        if "{{backCover}}" in page_str:
            page_classes.append("backCover")
            page_str = page_str.replace("{{backCover}}", "")
        if "{{toc}}" in page_str or "Table of Contents" in page_str or "TABLE OF CONTENTS" in page_str:
            page_classes.append("toc")
            page_str = page_str.replace("{{toc}}", "")

        # Handle Column Breaks
        page_str = page_str.replace("\\column", '<div style="break-before: column; page-break-before: column;"></div>')

        # Extract Footnote
        footnote_match = re.search(r"\{\{footnote\s*(.*?)\}\}", page_str, flags=re.DOTALL)
        footnote_html = ""
        if footnote_match:
            footnote_text = footnote_match.group(1).strip()
            footnote_html = f'<div class="footnote"><p>{footnote_text}</p></div>'
            page_str = re.sub(r"\{\{footnote\s*.*?\}\}", "", page_str, flags=re.DOTALL)

        # Handle Page Numbering
        has_page_num = False
        if "{{pageNumber,auto}}" in page_str or "{{pageNumber}}" in page_str:
            has_page_num = True
            page_str = page_str.replace("{{pageNumber,auto}}", "").replace("{{pageNumber}}", "")
        if "{{skipCounting}}" in page_str:
            page_str = page_str.replace("{{skipCounting}}", "")

        # Handle Image Positioning Attributes
        # Format: ![Alt](url) {style:attributes...}
        def replace_img(match):
            alt = match.group(1)
            url = match.group(2)
            styles = match.group(3) if match.group(3) else ""
            # clean style attributes: {position:absolute,top:0,left:0,width:100%} -> style="position:absolute;top:0;left:0;width:100%"
            clean_style = styles.strip("{}").replace(",", ";")
            if clean_style:
                return f'<img src="{url}" alt="{alt}" style="{clean_style}" />'
            return f'<img src="{url}" alt="{alt}" />'

        page_str = re.sub(r"!\[(.*?)\]\((.*?)\)\s*(\{.*?\})?", replace_img, page_str)

        # Convert Markdown to HTML via Pandoc
        body_html = convert_markdown_snippet(page_str)

        # Increment page count
        if "frontCover" not in page_classes and "chapterCover" not in page_classes and "backCover" not in page_classes:
            page_counter += 1
            num_html = f'<div class="pageNumber">{page_counter}</div>' if has_page_num else ""
        else:
            num_html = ""

        page_html = f"""
<section class="{' '.join(page_classes)}">
{body_html}
{footnote_html}
{num_html}
</section>
"""
        parsed_pages.append(page_html)

    return parsed_pages

def build_book_html(html_dir):
    """Generate complete standalone HTML document."""
    brew_path = os.path.join(WORKSPACE_DIR, ".homebrewery", "master_brew.txt")
    output_html = os.path.join(html_dir, "multiverse_core_manual.html")

    pages = parse_master_brew(brew_path)
    if not pages:
        print("[-] Failed to parse master_brew.txt")
        return False

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Multiverse TTRPG Core Manual (Framework v2606.1.0-bs / Print v1.0)</title>
    <link rel="stylesheet" href="../assets/multiverse_theme.css">
</head>
<body>
{"".join(pages)}
</body>
</html>
"""

    with open(output_html, "w", encoding="utf-8") as f:
        f.write(full_html)

    print(f"[+] Compiled {len(pages)} pages into HTML: {output_html}")
    return True

def render_pdf(pagedjs_bin, input_html, output_pdf):
    """Invoke pagedjs-cli to render PDF."""
    if not os.path.exists(input_html):
        print(f"[-] Error: HTML input file not found: {input_html}")
        return False

    cmd = [
        pagedjs_bin,
        input_html,
        "-o", output_pdf,
    ]
    print(f"[*] Rendering PDF via Paged.js...")
    print(f"    Input:  {input_html}")
    print(f"    Output: {output_pdf}")

    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"[+] Success: Created print-ready PDF at: {output_pdf}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[-] Error during PDF rendering:")
        print(e.stderr)
        return False

def main():
    os.chdir(WORKSPACE_DIR)

    html_dir, pdf_dir, assets_dir = get_books_dirs()
    if not html_dir:
        print("[-] Error: Books directory not found (.books/2606 or books/2606).")
        sys.exit(1)

    pagedjs_bin = find_pagedjs()
    if not pagedjs_bin:
        print("[-] Error: pagedjs-cli not found in PATH or ~/Library/pnpm/bin/.")
        sys.exit(1)
    print(f"[+] Found pagedjs-cli at: {pagedjs_bin}")

    chrome_bin = find_chrome()
    if not chrome_bin:
        print("[-] Error: No Chrome for Testing build found.")
        sys.exit(1)
    print(f"[+] Found Chrome at: {chrome_bin}")
    os.environ["PUPPETEER_EXECUTABLE_PATH"] = chrome_bin

    # 1. Compile master_brew.txt pages into complete HTML
    if not build_book_html(html_dir):
        sys.exit(1)

    # 2. Render to print-ready PDF
    input_html = os.path.join(html_dir, "multiverse_core_manual.html")
    output_pdf = os.path.join(pdf_dir, "multiverse_core_manual.pdf")

    if render_pdf(pagedjs_bin, input_html, output_pdf):
        print("\n🎉 BUILD COMPLETED SUCCESSFULLY!")
        print(f"    PDF Location: {output_pdf}")
    else:
        print("\n[!] Build failed. Review output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
