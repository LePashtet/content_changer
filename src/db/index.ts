import Dexie, { Table } from 'dexie';

export interface FilesList {
    id?: number;
    name: string;
    file: FileSystemFileHandle;
}

export class MyDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    files!: Table<FilesList>;

    constructor() {
        super('myDatabase');
        this.version(1).stores({
            files: '++id, name, file' // Primary key and indexed props
        });
    }
}

export const db = new MyDexie();
