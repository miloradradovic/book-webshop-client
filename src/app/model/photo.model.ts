export class Photo {
    public file: File;
    public photoName: string;

    constructor(file: File, photoName: string) {
        this.file = file;
        this.photoName = photoName;
    }
}