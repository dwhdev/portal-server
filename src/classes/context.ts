export class Context {
    private _authUser: string = '';
    private _expiresIn: number = 0;

    constructor() {}

    public get authUser() {
        return this._authUser;
    }

    public set authUser(userName: string) {
        this._authUser = userName;
    }

    public get expiresIn() {
        return this._expiresIn;
    }

    public set expiresIn(expiresIn: number) {
        this._expiresIn = expiresIn;
    }
}
