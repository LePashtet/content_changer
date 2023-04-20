import Dexie, { Table } from 'dexie';

export interface FilesList {
    id?: number;
    name: string;
    file: FileSystemFileHandle;
}

export class MyDexie extends Dexie {
    files!: Table<FilesList>;

    constructor() {
        super('myDatabase');
        this.version(1).stores({
            files: '++id, name, file'
        });
    }
}

export const db = new MyDexie();
