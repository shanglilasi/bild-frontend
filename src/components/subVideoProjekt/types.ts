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
    fullPath: string;
    isFolder: boolean;
    sizeMB: string;
    specs?: {
      width?: number | string;
      height?: number | string;
      fps?: number;
      frames?: string;
      duration?: string;
      vfr?:boolean;
    };
    children?: FileEntry[];
    isExpanded?: boolean;
  }

   export interface SchnittmarkenVariante {
      id: number;
      name: string;
      video_path: string;
      is_active: boolean;
      data: EditableMark[];
    }
  
  export interface VideoProjektProps {
    bildNr: number;
  }
  