export class User{
    constructor( // constructor for the user model
        public email: string, 
        public id: string, 
        private _token: string, // use getter to access
        private _tokenExpirationDate: Date // use getter to access
    ){}

    get token(){ // getter
        if(!this._tokenExpirationDate || new Date > this._tokenExpirationDate){ // if no token expiration date or if token has expired
            return null;
        }

        return this._token; // otherwise return token
    } 
}