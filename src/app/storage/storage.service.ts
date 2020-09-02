import {Injectable} from '@angular/core';
import {CognitoUserSession} from 'amazon-cognito-identity-js';


@Injectable()
export class StorageService {

    private tokens: CognitoUserSession;

    constructor() {
    }

    public setTokens = (tokens: CognitoUserSession) => {
        this.tokens = tokens;
    }

    public getTokens = (): {
        isValid: Function;
        [property: string]: any;
    } => {
        if (this.tokens) {
            return this.tokens;
        }
        return {
            isValid: () => {
                return false;
            }
        }
    }

    public clearTokens = () => {
        this.tokens = null;
    }
}
