// KategorieInfo.tsx
interface Kategorie {
    id: number;
    bezeichnung: string;
    beschreibung:string;
  }


  export default function KategorieInfo({
     kategorie,
  }: {
  
    kategorie: Kategorie;
  }) {


    // Hier kannst du weitere Logik oder Interaktionen basierend auf `nummer` oder `kategorie` hinzufügen
    return (
      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2 mb-1"  title={String(kategorie.id) + ':' + kategorie.beschreibung}>
       {kategorie.bezeichnung}
      </span>
    );
  }