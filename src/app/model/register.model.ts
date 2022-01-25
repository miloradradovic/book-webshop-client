export class RegisterData {
    private email: string;
    private password: string;
    private name: string;
    private surname: string;
    private address: string;
    private phoneNumber: string;
    private roleType: string;
  
    constructor(email: string, password: string, name: string, surname: string, address: string, phoneNumber: string, roleType: string) {
      this.email = email;
      this.password = password;
      this.name = name;
      this.surname = surname;
      this.address = address;
      this.phoneNumber = phoneNumber;
      this.roleType = roleType;
    }
}