import { BookCatalogData } from "./book.model";

export class CartItem {
    
    public book: BookCatalogData;
    public amount: number
  
    constructor(book: BookCatalogData, amount: number) {
        this.book = book;
        this.amount = amount;
    }
  }

  export class Cart {
    
    public cartItems: CartItem[];
  
    constructor(cartItems: CartItem[]) {
        this.cartItems = cartItems;
    }
  }