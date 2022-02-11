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

export class CartItemForOrderPlacing {
  private bookId: number;
  private amount: number;

  constructor(bookId: number, amount: number) {
    this.bookId = bookId;
    this.amount = amount;
  }
}

export class CartForOrderPlacing {
  private cartItems: CartItemForOrderPlacing[];
  private defaultInfo: boolean;
  private address: string;
  private phoneNumber: string;
  private finalPrice: number;

  constructor(cartItems: CartItemForOrderPlacing[], defaultInfo: boolean, address: string, phoneNumber: string, finalPrice: number) {
    this.cartItems = cartItems;
    this.defaultInfo = defaultInfo;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.finalPrice = finalPrice;
  }
}