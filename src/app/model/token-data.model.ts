export class TokenData {
    private email: string;
    private accessToken: string;
  
    constructor(email: string, token: string) {
      this.email = email;
      this.accessToken = token;
    }
}