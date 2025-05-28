//src/components/subVideoProjekt/ModalRouter.tsx
import EffektSelectorModal from "./EffectSelectorModal";
import FileSelectorModal from "./FileSelectorModal";
import { EditableMark } from "./types";


import { SchnittmarkenSchema } from "../../types/SchnittmarkenSchemas";


interface Props {
  openModal: { idx: number; field: string } | null;
  setOpenModal: (m: { idx: number; field: string } | null) => void;
  updateMark: (idx: number, updates: Partial<EditableMark>) => void;
  schema: SchnittmarkenSchema;
}

export default function ModalRouter({
  openModal,
  setOpenModal,
  updateMark,
  schema,
}: Props) {
  if (!openModal) return null;

  const { idx, field } = openModal;

  const feldDef = schema.fields.find(f => f.field === field);


  const handleSelect = (value: string) => {
    updateMark(idx, { [field]: value });
    setOpenModal(null);
  };

  // DEBUG-Hilfe: zeigt modalType in der Konsole
  console.log("🧩 modalType für", field, "ist", feldDef?.modalType);

  switch (feldDef?.modalType) {
    case "file":
      return <FileSelectorModal onSelect={handleSelect} onClose={() => setOpenModal(null)} />;
    
    case "effect":
  return (
    <EffektSelectorModal
      field={field}
      onSelect={handleSelect}
      onClose={() => setOpenModal(null)}
    />
  );

    default:
      return null;
  }
}