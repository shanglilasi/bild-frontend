// scr/types/SchnittmarkenSchemas.ts
export interface SchnittmarkenFeldDefinition {
  label: string;
  field: string;
  type: "text" | "select" | "color" | "time" | "effect"|"file";
  options?: { value: string; label: string }[];
  editable?: boolean;

    modalType?: "effect" | "file" | "custom";
}

export interface SchnittmarkenSchema {
  postfix: string; // z. B. "_sub", "_cl", "_col"
  fields: SchnittmarkenFeldDefinition[];
}

export const SCHNITTMARKEN_SCHEMAS: SchnittmarkenSchema[] = [
  {
    postfix: "_sub",
    fields: [
      { field: "time", label: "⏱ Zeit", type: "time" },
      { field: "comment", label: "💬 Untertitel", type: "text", editable: true },
      { field: "size", label: "🔠 Größe", type: "select", options: [
        { value: "small", label: "Klein" },
        { value: "medium", label: "Mittel" },
        { value: "large", label: "Groß" },
      ]},
      { field: "color", label: "🎨 Farbe", type: "color" },
      { field: "background", label: "🖌 Hintergrund", type: "color" },
    ]
  },
  {
    postfix: "_cl",
    fields: [
      { field: "time", label: "⏱ Zeit", type: "time" },
      { field: "comment", label: "✂️ Cut-Bereich (Kommentar)", type: "text" }
    ]
  },
  {
    postfix: "_col",
    fields: [
      { field: "time", label: "⏱ Zeit", type: "time" },
      { field: "comment", label: "🎛 Farbeffekt", type: "effect" }
    ]
  },
  {
    postfix: "_*",
    fields: [
      { field: "time", label: "⏱ Zeit", type: "time" },
      { field: "comment", label: "🎛 Farbeffekt", type: "effect" },
      { field: "file", label: "Video", type: "file", modalType: "file" }, // 👈 HIER
      { field: "methode", label: "🖌Methode", type: "effect", modalType: "effect" }, // 👈 optional
      { field: "dauer", label: "⏱Dauer", type: "text" }

    ]
  },

{
  postfix: "_combi",
  fields: [
    { field: "time", label: "Position", type: "time" },
    { field: "file", label: "Video", type: "file", modalType: "file" }, // 👈 HIER
    { field: "methode", label: "🖌Methode", type: "effect", modalType: "effect" }, // 👈 optional
    { field: "dauer", label: "⏱Dauer", type: "text" }
  ]
},

{
  postfix: "gaga",
  fields: [
    { field: "time", label: "Position", type: "time" },
    { field: "file", label: "Video", type: "file", modalType: "file" }, // 👈 HIER
    { field: "methode", label: "🖌Methode", type: "effect", modalType: "effect" }, // 👈 optional
    { field: "dauer", label: "⏱Dauer", type: "text" }
  ]
},




  // weitere Skripttypen hier ergänzen… _sub _col _combi _cl
]


