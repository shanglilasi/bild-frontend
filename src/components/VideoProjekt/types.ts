//components/VideoProjekt/types.ts

export interface Mark {
    time: number;
    comment: string;
  }
  
  export interface EditableMark extends Mark {
    size?: string;
    color?: string;
    background?: string;
  }
  
  export interface FileEntry {
    name: string;
    isFolder: boolean;
    fullPath: string;
    children?: FileEntry[];
    marks?: Mark[];
    isExpanded?: boolean;
  }
  
  export interface VideoProjektProps {
    bildNr: number;
  }
  