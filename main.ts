import { Plugin, Editor } from "obsidian";

// ================================
// Greek Mapping Table
// ================================
const englishToGreek: Record<string, string> = {
  a: "α",
  b: "β",
  c: "ψ",
  d: "δ",
  e: "ε",
  f: "φ",
  g: "γ",
  h: "η",
  i: "ι",
  j: "ξ",
  k: "κ",
  l: "λ",
  m: "μ",
  n: "ν",
  o: "ο",
  p: "π",
  q: "Π",
  r: "ρ",
  s: "σ",
  t: "τ",
  u: "θ",
  v: "ω",
  w: "ς",
  x: "χ",
  y: "υ",
  z: "ζ",
};

// ================================
// Reverse Mapping
// ================================
const greekToEnglish: Record<string, string> = {};
for (const key in englishToGreek) {
  const value = englishToGreek[key];
  greekToEnglish[value] = key;
}

// ================================
// Uppercase Support
// ================================
function addUppercase(map: Record<string, string>) {
  const entries = Object.entries(map);

  for (const [key, value] of entries) {
    map[key.toUpperCase()] = value;
  }
}

addUppercase(englishToGreek);
addUppercase(greekToEnglish);

// ================================
// Detection
// ================================
function containsGreek(text: string): boolean {
  return /[\u0370-\u03FF]/.test(text);
}

// ================================
// Mapping Engine
// ================================
function mapText(text: string): string {
  const mapping = containsGreek(text) ? greekToEnglish : englishToGreek;

  return [...text].map((character) => mapping[character] ?? character).join("");
}

// ================================
// Obsidian Plugin
// ================================

export default class GreekMapPlugin extends Plugin {
  onload() {
    // Left sidebar ribbon button
    this.addRibbonIcon("omega", "Map Greek ↔ English", () => {
      this.mapSelection();
    });

    // Command palette command
    this.addCommand({
      id: "map-selection",
      name: "Map Greek ↔ English",
      editorCallback: () => {
        this.mapSelection();
      },
    });
  }

  mapSelection() {
    const editor = this.app.workspace.activeEditor?.editor;
    if (!editor) {
      return;
    }

    const selection = editor.getSelection();

    if (!selection) {
      return;
    }

    editor.replaceSelection(mapText(selection));
  }
}
