import { Writer } from "./writer.model";

export class BookCatalogData {
    public id: number;
    public name: string;
    public yearReleased: number;
    public recap: string;
    public inStock: number;
    public price: number;
    public genres: string;
    public writers: string;

    constructor(id: number, name: string, yearReleased: number, recap: string, inStock: number, price: number, genres: string, 
        writers: string) {
      this.id = id;
      this.name = name;
      this.yearReleased = yearReleased;
      this.recap = recap;
      this.inStock = inStock;
      this.price = price;
      this.genres = genres;
      this.writers = writers;
    }
}

export class Book {
  public id: number;
  public name: string;
  public yearReleased: number;
  public recap: string;
  public inStock: number;
  public price: number;
  public genres: string[];
  public writers: Writer[];

  constructor(id: number, name: string, yearReleased: number, recap: string, inStock: number, price: number, 
      genres: string[], writers: Writer[]) {
        this.id = id;
        this.name = name;
        this.yearReleased = yearReleased;
        this.recap = recap;
        this.inStock = inStock;
        this.price = price;
        this.genres = genres;
        this.writers = writers;
  }
}