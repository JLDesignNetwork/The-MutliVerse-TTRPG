#!/bin/bash

BASE_DIR="/Volumes/Kingston-256/_DevSites/Active/the-multiverse"
HB_DIR="$BASE_DIR/homebrewery"
SEC_DIR="$HB_DIR/sections"

echo "Initializing Homebrewery builder..."
mkdir -p "$SEC_DIR"

# Clean up old build
rm -f "$SEC_DIR"/*.md
rm -f "$HB_DIR/master_brew.txt"

# Helper function to append file with a page break
append_file() {
    local file="$1"
    local dest="$2"
    if [ -f "$file" ]; then
        echo "Appending $(basename "$file")..."
        cat "$file" >> "$dest"
        echo -e "\n\n\\page\n\n" >> "$dest"
    else
        echo "Warning: $file not found!"
    fi
}

echo "Building 00_Front_Matter.md..."
# We generate a quick cover and TOC
cat <<EOF > "$SEC_DIR/00_Front_Matter.md"
# The Multiverse TTRPG
### Core Manual
![Front Cover](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page

# Table of Contents
## Book I: The Shattered Cosmos
## Book II: The Laws of Reality
## Book III: The Wayfarer's Path
## Book IV: Chronicles of the Shattered
## Appendices

\page
EOF

echo "Building 01_Book_I.md..."
cat <<EOF > "$SEC_DIR/01_Book_I.md"
# Book I
## The Shattered Cosmos
![Book I Splash Art](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page
EOF
append_file "$BASE_DIR/01-Book-I-The-Shattered-Cosmos/01-The-Shattering.md" "$SEC_DIR/01_Book_I.md"
append_file "$BASE_DIR/01-Book-I-The-Shattered-Cosmos/02-Zero-Point-Station.md" "$SEC_DIR/01_Book_I.md"
append_file "$BASE_DIR/01-Book-I-The-Shattered-Cosmos/03-Factions-and-The-Rift-Guard.md" "$SEC_DIR/01_Book_I.md"
append_file "$BASE_DIR/01-Book-I-The-Shattered-Cosmos/04-The-Grand-Purpose.md" "$SEC_DIR/01_Book_I.md"

echo "Building 02_Book_II.md..."
cat <<EOF > "$SEC_DIR/02_Book_II.md"
# Book II
## The Laws of Reality
![Book II Splash Art](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page
EOF
append_file "$BASE_DIR/02-Book-II-The-Laws-of-Reality/01-Core-Resolution.md" "$SEC_DIR/02_Book_II.md"
append_file "$BASE_DIR/02-Book-II-The-Laws-of-Reality/02-The-Action-Economy.md" "$SEC_DIR/02_Book_II.md"
append_file "$BASE_DIR/02-Book-II-The-Laws-of-Reality/03-The-Status-Manifest.md" "$SEC_DIR/02_Book_II.md"
append_file "$BASE_DIR/02-Book-II-The-Laws-of-Reality/04-The-Threat-System.md" "$SEC_DIR/02_Book_II.md"
append_file "$BASE_DIR/02-Book-II-The-Laws-of-Reality/05-The-Scale-of-Reality.md" "$SEC_DIR/02_Book_II.md"

echo "Building 03_Book_III.md..."
cat <<EOF > "$SEC_DIR/03_Book_III.md"
# Book III
## The Wayfarer's Path
![Book III Splash Art](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page
EOF
append_file "$BASE_DIR/03-Book-III-The-Wayfarers-Path/01-Identity-and-Origins.md" "$SEC_DIR/03_Book_III.md"
append_file "$BASE_DIR/03-Book-III-The-Wayfarers-Path/02-The-Tag-Permission-Registry.md" "$SEC_DIR/03_Book_III.md"
append_file "$BASE_DIR/03-Book-III-The-Wayfarers-Path/03-Approaches-and-Arrays.md" "$SEC_DIR/03_Book_III.md"
append_file "$BASE_DIR/03-Book-III-The-Wayfarers-Path/04-Advancement-EXP.md" "$SEC_DIR/03_Book_III.md"
append_file "$BASE_DIR/03-Book-III-The-Wayfarers-Path/05-Equipment-and-Slots.md" "$SEC_DIR/03_Book_III.md"

echo "Building 04_Book_IV.md..."
cat <<EOF > "$SEC_DIR/04_Book_IV.md"
# Book IV
## Chronicles of the Shattered
![Book IV Splash Art](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page
EOF
append_file "$BASE_DIR/04-Book-IV-Chronicles-of-the-Shattered/01-The-Infinite-Archive.md" "$SEC_DIR/04_Book_IV.md"
append_file "$BASE_DIR/04-Book-IV-Chronicles-of-the-Shattered/01-Adversaries.md" "$SEC_DIR/04_Book_IV.md"
append_file "$BASE_DIR/04-Book-IV-Chronicles-of-the-Shattered/02-Archive-DnD-5e.md" "$SEC_DIR/04_Book_IV.md"
append_file "$BASE_DIR/04-Book-IV-Chronicles-of-the-Shattered/05-Archive-Warhammer-40k.md" "$SEC_DIR/04_Book_IV.md"

echo "Building 05_Appendices.md..."
cat <<EOF > "$SEC_DIR/05_Appendices.md"
# Appendices
![Appendices Splash Art](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}

\page
EOF
append_file "$BASE_DIR/05-Appendices/02-Governance.md" "$SEC_DIR/05_Appendices.md"
append_file "$BASE_DIR/05-Appendices/03-Interaction-and-Damage.md" "$SEC_DIR/05_Appendices.md"
append_file "$BASE_DIR/05-Appendices/04-Cross-Universe-Physics.md" "$SEC_DIR/05_Appendices.md"
append_file "$BASE_DIR/05-Appendices/05-The-Economy.md" "$SEC_DIR/05_Appendices.md"

echo "Building 06_Back_Cover.md..."
cat <<EOF > "$SEC_DIR/06_Back_Cover.md"
# The Multiverse Awaits
![Back Cover](YOUR_IMAGE_LINK) {position:absolute, top:0px, left:0px, width:100%}
EOF

echo "Concatenating into master_brew.txt..."
cat "$SEC_DIR/00_Front_Matter.md" \
    "$SEC_DIR/01_Book_I.md" \
    "$SEC_DIR/02_Book_II.md" \
    "$SEC_DIR/03_Book_III.md" \
    "$SEC_DIR/04_Book_IV.md" \
    "$SEC_DIR/05_Appendices.md" \
    "$SEC_DIR/06_Back_Cover.md" > "$HB_DIR/master_brew.txt"

echo "Done! The file $HB_DIR/master_brew.txt is ready to be copied into Homebrewery."
