// scr/types/SchnittmarkenSchemas.ts
export interface SchnittmarkenFeldDefinition {
  label: string;
  field: string;
  type: "text" | "select" | "color" | "time" | "effect"|"file";
  options?: { value: string; label: string }[];
  editable?: boolean;
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
    postfix: "_combi",
    fields: [
      { field: "time", label: "Position", type: "time" },
      { field: "file", label: "Video", type: "file" },
      { field: "methode", label: "🖌Methode", type: "text" },
      { field: "dauer", label: "⏱Dauer", type: "time" }
    ]
  },


  // weitere Skripttypen hier ergänzen…
]