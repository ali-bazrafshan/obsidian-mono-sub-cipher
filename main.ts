import { Plugin } from "obsidian";

// ================================
// Mapping Table
// ================================
const mapping: Record<string, string> = {
	// Lowercase
	a: "ф",
	b: "и",
	c: "с",
	d: "в",
	e: "у",
	f: "а",
	g: "п",
	h: "р",
	i: "ш",
	j: "о",
	k: "л",
	l: "д",
	m: "ь",
	n: "т",
	o: "щ",
	p: "з",
	q: "й",
	r: "к",
	s: "ы",
	t: "е",
	u: "г",
	v: "м",
	w: "ц",
	x: "ч",
	y: "н",
	z: "я",

	// Uppercase
	A: "Ф",
	B: "И",
	C: "С",
	D: "В",
	E: "У",
	F: "А",
	G: "П",
	H: "Р",
	I: "Ш",
	J: "О",
	K: "Л",
	L: "Д",
	M: "Ь",
	N: "Т",
	O: "Щ",
	P: "З",
	Q: "Й",
	R: "К",
	S: "Ы",
	T: "Е",
	U: "Г",
	V: "М",
	W: "Ц",
	X: "Ч",
	Y: "Н",
	Z: "Я"
};

// ================================
// Reverse Mapping
// ================================
const reverseMapping: Record<string, string> = {};
for (const key in mapping) {
  const value = mapping[key];
  reverseMapping[value] = key;
}

// ================================
// Detection
// ================================
function isEncoded(text: string): boolean {
	return Object.values(mapping).some(char => text.includes(char));
}

// ================================
// Mapping Engine
// ================================
function mapText(text: string): string {
  const currentMapping = isEncoded(text) ? reverseMapping : mapping;

  return [...text].map((character) => currentMapping[character] ?? character).join("");
}

// ================================
// Obsidian Plugin
// ================================

export default class MonoSubCipherPlugin extends Plugin {
  onload() {
    // Left sidebar ribbon button
    this.addRibbonIcon("case-upper", "Cipher / Decipher", () => {
      this.mapSelection();
    });

    // Command palette command
    this.addCommand({
      id: "cipher-decipher",
      name: "Cipher / Decipher",
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
