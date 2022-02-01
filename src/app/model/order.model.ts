export class OrderedItem {
    
    public id: number;
    public name: string;
    public amount: number;
    public price: number;
    public finalPrice!: number;

    constructor(id: number, name: string, amount: number, price: number) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.price = price;
    }
}

export class Order {

    public id: number;
    public orderedItems: OrderedItem[];
    public orderStatus: string;
    public address: string;
    public phoneNumber: string;
    public finalPrice: number;

    constructor(id: number, orderedItems: OrderedItem[], orderStatus: string, address: string, 
        phoneNumber: string, finalPrice: number) {
            this.id = id;
            this.orderedItems = orderedItems;
            this.orderStatus = orderStatus;
            this.address = address;
            this.phoneNumber = phoneNumber;
            this.finalPrice = finalPrice;
        }
}