export const COLOR_EFFECTS = [
  { value: "null", label: "Kein Effekt" },
  { value: "hue=s=0", label: "Sättigung = 0 (Schwarzweiß)" },
  { value: "eq=contrast=1.5", label: "Erhöhter Kontrast" },
  { value: "eq=brightness=0.1", label: "Helligkeit leicht erhöht" },
  { value: "eq=brightness=-0.1", label: "Helligkeit leicht gesenkt" },
  { value: "format=yuv420p,colorbalance=bs=0.3", label: "Blau verstärkt" },
  { value: "format=yuv420p,colorbalance=rs=0.3", label: "Rot verstärkt" },
  { value: "format=yuv420p,colorbalance=gs=0.3", label: "Grün verstärkt" },
  { value: "curves=preset=strong_contrast", label: "Starker Kontrast (Kurven)" },
  { value: "curves=preset=color_negative", label: "Farbnegativ" },
  { value: "hue=h=90", label: "Farbton verschoben (90°)" },
  { value: "hue=s=2", label: "Sättigung verdoppelt" },
  { value: "hue=s=0.5", label: "Sättigung halbiert" },
  { value: "format=yuv420p,colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3", label: "Mischung RGB-Kanäle" },
  { value: "format=yuv420p,lutyuv='u=128:v=128'", label: "UV-Kanäle neutralisiert" },
  { value: "eq=saturation=2.0", label: "Sättigung x2" },
];

export const BLEND_MODES = [
  { value: "Hart", label: "Hart: Direkter Anschluss" },
  { value: "Blend", label: "Blend: Übergang in Sekunden" },
  { value: "Störung", label: "Störung: Flackern als Übergang" },
  { value: "Tonspurversatz", label: "Tonspurversatz: Vorauseilend oder nachfolgende Tonspur in Sekunden" },
];