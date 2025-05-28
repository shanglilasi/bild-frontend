
import { EditableMark } from "./types";
import { formatTime } from "./helper";
import { SchnittmarkenSchema } from "../../types/SchnittmarkenSchemas";



interface Props {
  schema: SchnittmarkenSchema;
  marks: EditableMark[];
  setModalOpenIdx: (val: { idx: number; field: string } | null) => void;
  updateMark: (index: number, updates: Partial<EditableMark>) => void;
  deleteMark: (index: number) => void;
  onJumpToTime: (time: number) => void;
}


export default function SchnittmarkenTabelle({
  schema, 
  marks,
  setModalOpenIdx, 
  updateMark,
  deleteMark,
  onJumpToTime,
}: Props) {
 


  return (
    <table className="w-full text-sm table-auto border">
      <thead>
        <tr className="bg-gray-200">
          {schema.fields.map((field) => (
            <th key={field.field} className="p-1">{field.label}</th>
          ))}
          <th className="p-1">🗑</th>
        </tr>
      </thead>
      <tbody>
        {marks.map((mark, idx) => (
          <tr key={idx} className="hover:bg-gray-100">
            {schema.fields.map((field) => {
              const value = (mark as any)[field.field];

              switch (field.type) {
                case "time":
                  return (
                    <td
                      key={field.field}
                      className="p-1 cursor-pointer text-blue-700"
                      onClick={() => onJumpToTime(mark.time)}
                    >
                      {formatTime(mark.time)}
                    </td>
                  );

                case "text":
                  return (
                    <td key={field.field} className="p-1">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          updateMark(idx, { [field.field]: e.target.value })
                        }
                        className="border px-1 w-full"
                      />
                    </td>
                  );

                case "select":
                  return (
                    <td key={field.field} className="p-1">
                      <select
                        value={value}
                        onChange={(e) =>
                          updateMark(idx, { [field.field]: e.target.value })
                        }
                        className="border px-1 w-full"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  );

                case "color":
                  return (
                    <td key={field.field} className="p-1">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) =>
                          updateMark(idx, { [field.field]: e.target.value })
                        }
                      />
                    </td>
                  );

               case "file":
  return (
    <td key={field.field} className="p-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) =>
            updateMark(idx, { [field.field]: e.target.value })
          }
          className="border px-1 py-0.5 text-sm rounded w-full"
        />
        <button
          onClick={() => setModalOpenIdx({ idx, field: field.field })}
          className="text-blue-600 hover:text-blue-800 text-sm"
          title="Datei auswählen"
        >
          📁
        </button>
      </div>
    </td>
  );

case "effect":
  return (
    <td key={field.field} className="p-1">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) =>
            updateMark(idx, { [field.field]: e.target.value })
          }
          className="border px-1 py-0.5 text-sm rounded w-full"
        />
        <button
          onClick={() => setModalOpenIdx({ idx, field: field.field })}
          className="text-blue-600 hover:text-blue-800 text-sm"
          title="Effekt auswählen"
        >
          🎛
        </button>
      </div>
    </td>
  )



                default:
                  return <td key={field.field} className="p-1">{String(value)}</td>;
              }
            })}

            <td className="p-1 text-center">
              <button
                onClick={() => deleteMark(idx)}
                className="text-red-500"
              >
                ✖
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}