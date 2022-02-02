export class LogInData {
    private email: string;
    private password: string;
  
    constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
}

export class AuthenticatedModel {
    public email: string;
    private role: string;
    private token: string;

    constructor(email: string, role: string, token: string) {
        this.email = email;
        this.role = role;
        this.token = token;
    }
}