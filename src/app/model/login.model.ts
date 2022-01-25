export class LogInData {
    private email: string;
    private password: string;
  
    constructor(email: string, password: string) {
      this.email = email;
      this.password = password;
    }
}

export class AuthenticatedModel {
    private email: string;
    private role: string;

    constructor(email: string, role: string) {
        this.email = email;
        this.role = role;
    }
}