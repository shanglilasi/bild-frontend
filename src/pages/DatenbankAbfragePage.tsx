import { useState, ReactElement } from "react";
import FolderTable from "../components/FolderTable";

type Tab = "ordner" | "bilder" | "reports";

export default function DatenbankAbfragePage(): ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>("ordner");

  return (
    <div className="p-4">
      {/* Tab-Schalterleiste */}
      <div className="mb-6 flex space-x-4 border-b pb-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-t ${
            activeTab === "ordner" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("ordner")}
        >
          🗂️ Ordner
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t ${
            activeTab === "bilder" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("bilder")}
        >
          🖼️ Bilder
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-t ${
            activeTab === "reports" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          📊 Reports
        </button>
      </div>

      {/* Inhalt je nach aktivem Tab */}
      <div>
        {activeTab === "ordner" && <FolderTable />}
        {activeTab === "bilder" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Bilder-Komponente</h2>
            <p>Hier könnte deine Bilderübersicht stehen.</p>
          </div>
        )}
        {activeTab === "reports" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Reports</h2>
            <p>Hier könnten Auswertungen oder Diagramme folgen.</p>
          </div>
        )}
      </div>
    </div>
  );
}