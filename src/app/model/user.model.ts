export class User {
    public id: number;
    public email: string;
    public password: string;
    public name: string;
    public surname: string;
    public phoneNumber: string;
    public address: string;
    public roles: string[];
    public rolesTable!: string;

    constructor(id: number, email: string, password: string, name: string, surname: string, phoneNumber: string, address: string, roles: string[]) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.roles = roles;
    }
}