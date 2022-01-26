export class Writer {
    public id: number;
    public name: string;
    public surname: string;
    public biography: string;

    constructor(id: number, name: string, surname: string, biography: string) {
      this.id = id;
      this.name = name;
      this.surname = surname;
      this.biography = biography;
    }
}