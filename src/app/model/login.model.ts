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
    public role: string;
    public token: string;
    public refresh: string;

    constructor(email: string, role: string, token: string, refresh: string) {
        this.email = email;
        this.role = role;
        this.token = token;
        this.refresh = refresh;
    }
}