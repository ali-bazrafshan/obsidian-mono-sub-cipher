import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

type CipherLanguage = "english" | "persian";

interface MonoSubCipherSettings {
  language: CipherLanguage;
}

const DEFAULT_SETTINGS: MonoSubCipherSettings = {
  language: "english",
};

// ================================
// Mapping Tables
// ================================
const englishMapping: Record<string, string> = {
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
  Z: "Я",
};

const persianMapping: Record<string, string> = {
  ا: "а",
  ب: "б",
  پ: "в",
  ت: "г",
  ث: "д",
  ج: "е",
  چ: "ж",
  ح: "з",
  خ: "и",
  د: "й",
  ذ: "к",
  ر: "л",
  ز: "м",
  ژ: "н",
  س: "о",
  ش: "п",
  ص: "р",
  ض: "с",
  ط: "т",
  ظ: "у",
  ع: "ф",
  غ: "х",
  ف: "ц",
  ق: "ч",
  ک: "ш",
  گ: "щ",
  ل: "ъ",
  م: "ы",
  ن: "ь",
  و: "э",
  ه: "ю",
  ی: "я",
};

// ================================
// Detection
// ================================
function isEncoded(text: string, mapping: Record<string, string>): boolean {
  return Object.values(mapping).some((char) => text.includes(char));
}

// ================================
// Mapping Engine
// ================================
function mapText(text: string, language: CipherLanguage): string {
  const mapping = language === "persian" ? persianMapping : englishMapping;
  const reverseMapping: Record<string, string> = {};
  for (const key in mapping) {
    reverseMapping[mapping[key]] = key;
  }
  const currentMapping = isEncoded(text, mapping) ? reverseMapping : mapping;

  return [...text]
    .map((character) => currentMapping[character] ?? character)
    .join("");
}

// ================================
// Obsidian Plugin
// ================================

export default class MonoSubCipherPlugin extends Plugin {
  pluginSettings!: MonoSubCipherSettings;

  async onload() {
    this.pluginSettings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData(),
    );
    this.addSettingTab(new MonoSubCipherSettingTab(this.app, this));

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

    editor.replaceSelection(mapText(selection, this.pluginSettings.language));
  }
}

class MonoSubCipherSettingTab extends PluginSettingTab {
  plugin: MonoSubCipherPlugin;

  constructor(app: App, plugin: MonoSubCipherPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Language")
      .setDesc("Choose the alphabet used for ciphering and deciphering.")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("english", "English")
          .addOption("persian", "Persian")
          .setValue(this.plugin.pluginSettings.language)
          .onChange(async (value) => {
            if (value !== "english" && value !== "persian") {
              return;
            }
            this.plugin.pluginSettings.language = value;
            await this.plugin.saveData(this.plugin.pluginSettings);
          }),
      );
  }
}
