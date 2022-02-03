export class TokenData {
  private email: string;
  private accessToken: string;
  private refreshToken: string;

  constructor(email: string, access: string, refresh: string) {
    this.email = email;
    this.accessToken = access;
    this.refreshToken = refresh;
  }
}