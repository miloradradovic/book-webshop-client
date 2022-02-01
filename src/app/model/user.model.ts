export class UserForProfile {

    public id: string;
    public email: string;
    public name: string;
    public surname: string;
    public phoneNumber: string;
    public address: string;

    constructor(id: string, email: string, name: string, surname: string, phoneNumber: string, address: string) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }
}

export class User {
    public id: string;
    public email: string;
    public name: string;
    public surname: string;
    public phoneNumber: string;
    public address: string;
    public roles: string[];
    public rolesTable!: string;

    constructor(id: string, email: string, name: string, surname: string, phoneNumber: string, address: string, roles: string[]) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.roles = roles;
    }
}