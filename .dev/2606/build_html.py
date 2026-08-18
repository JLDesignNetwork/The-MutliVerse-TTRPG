#!/opt/homebrew/bin/python3
"""
The Multiverse TTRPG Framework — HTML Book Compiler
Version: 2606.1.0-bs | Book Version: 1.0
Author: Jeff Langdon (JLDN)

Compiles .homebrewery/master_brew.txt into standalone, inspectable HTML5 books
under .books/2606/html/ with zero PDF rendering.
"""

import os
import subprocess
import re
import sys

WORKSPACE_DIR = "/Volumes/Kingston-256/_DevSites/Active/the-multiverse"

def get_html_dir():
    for root_name in [".books", "books"]:
        gen_dir = os.path.join(WORKSPACE_DIR, root_name, "2606")
        if os.path.isdir(gen_dir):
            html_dir = os.path.join(gen_dir, "html")
            os.makedirs(html_dir, exist_ok=True)
            return html_dir
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
        def replace_img(match):
            alt = match.group(1)
            url = match.group(2)
            styles = match.group(3) if match.group(3) else ""
            clean_style = styles.strip("{}").replace(",", ";")
            if clean_style:
                return f'<img src="{url}" alt="{alt}" style="{clean_style}" />'
            return f'<img src="{url}" alt="{alt}" />'

        page_str = re.sub(r"!\[(.*?)\]\((.*?)\)\s*(\{.*?\})?", replace_img, page_str)

        # Convert Markdown to HTML via Pandoc
        body_html = convert_markdown_snippet(page_str)

        # Process Attached Classes to Blockquotes (e.g. {blocknote})
        def clean_blocknotes(html_str):
            # 1. Handle {classname} rendered immediately outside <blockquote>
            html_str = re.sub(r"<blockquote>(.*?)</blockquote>\s*<p>\{([a-zA-Z0-9_\-]+)\}</p>", r'<blockquote class="\2">\1</blockquote>', html_str, flags=re.DOTALL)
            # 2. Handle {classname} absorbed inside <blockquote>
            def replace_bn(match):
                content = match.group(1)
                cls_match = re.search(r"\{([a-zA-Z0-9_\-]+)\}", content)
                if cls_match:
                    cls_name = cls_match.group(1)
                    clean_content = re.sub(r"\s*<p>\s*\{" + cls_name + r"\}\s*</p>\s*", "", content)
                    clean_content = re.sub(r"\s*\{" + cls_name + r"\}\s*", "", clean_content)
                    return f'<blockquote class="{cls_name}">{clean_content}</blockquote>'
                return match.group(0)
            return re.sub(r"<blockquote>(.*?)</blockquote>", replace_bn, html_str, flags=re.DOTALL)

        body_html = clean_blocknotes(body_html)

        # Apply class="wide" to all tables
        body_html = re.sub(r"<table>", '<table class="wide">', body_html)

        # Increment page count
        if "frontCover" not in page_classes and "chapterCover" not in page_classes and "backCover" not in page_classes:
            page_counter += 1
            num_html = f'<div class="pageNumber">{page_counter}</div>' if has_page_num else ""
        else:
            num_html = ""

        page_html = f"""<section class="{' '.join(page_classes)}">
{body_html}
{footnote_html}
{num_html}
</section>
"""
        parsed_pages.append(page_html)

    return parsed_pages

def main():
    os.chdir(WORKSPACE_DIR)

    html_dir = get_html_dir()
    if not html_dir:
        print("[-] Error: Books directory not found (.books/2606 or books/2606).")
        sys.exit(1)

    brew_path = os.path.join(WORKSPACE_DIR, ".homebrewery", "master_brew.txt")
    output_html = os.path.join(html_dir, "multiverse_core_manual.html")

    pages = parse_master_brew(brew_path)
    if not pages:
        print("[-] Failed to parse master_brew.txt")
        sys.exit(1)

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

    print(f"🎉 HTML COMPILED SUCCESSFULLY!")
    print(f"    Total Pages: {len(pages)}")
    print(f"    Output: {output_html}")

if __name__ == "__main__":
    main()
