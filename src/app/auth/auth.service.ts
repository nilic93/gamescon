import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool, CognitoUserSession
} from 'amazon-cognito-identity-js';

import config from 'environments/config';
import {StorageService} from '../storage/storage.service';

@Injectable()
export class AuthService {
    userPool: CognitoUserPool;
    cognitoUser: CognitoUser;
    authDetails: AuthenticationDetails;
    isNewPasswordRequired: boolean;
    newPassword: string;
    loading: boolean;
    authError: any;

    constructor(private router: Router, private storageService: StorageService) {
        this.userPool = new CognitoUserPool({
            UserPoolId: config.getCognitoPoolID(),
            ClientId: config.getCognitoClientID()
        });
        this.isNewPasswordRequired = false;
        this.loading = false;
        this.authError = null;
    }

    /**
     * @desc Makes API call to Cognito service and authenticates user with given credentials
     * @memberof AuthService
     */
    login = (): void => {
        this.loading = true;
        this.cognitoUser = new CognitoUser({
            Username: this.authDetails.getUsername(),
            Pool: this.userPool
        });

        this.cognitoUser.authenticateUser(this.authDetails, {
            onSuccess: this.onLoginSuccess,
            onFailure: this.onLoginFailure,
            newPasswordRequired: this.onNewPasswordRequired
        });
    }

    /**
     * @desc Stores auth details when user inputed credentials in login form and is about to login
     * @memberof AuthService
     */
    setAuthDetails = (email: string, password: string): void => {
        this.authDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });
    }

    /**
     * @desc Login success callback for CognitoUser.authenticateUser method
     * @memberof AuthService
     */
    onLoginSuccess = (tokens: CognitoUserSession): void => {
        this.loading = false;
        this.authDetails = null;
        this.newPassword = null;
        this.authError = null;
        this.isNewPasswordRequired = false;
        this.updateStorage(tokens);
        this.router.navigate(['/dashboard'], {replaceUrl: true});
    }

    /**
     * @desc Login failure callback for CognitoUser.authenticateUser method
     * @memberof AuthService
     */
    onLoginFailure = (error: any): void => {
        this.loading = false;
        if (error.message === 'New password is required.') {
            this.isNewPasswordRequired = true;
            this.authError = false;
        } else {
            this.authError = error;
        }
    }

    /**
     * @desc New password required callback for CognitoUser.authenticateUser method
     * @memberof AuthService
     */
    onNewPasswordRequired = (userAttributes, requiredAttributes): void => {
        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        this.cognitoUser.completeNewPasswordChallenge(this.newPassword, userAttributes, {
            onSuccess: this.onLoginSuccess,
            onFailure: this.onLoginFailure
        });
    }

    /**
     * @desc Handles case when user logs in for the first time
     * and it has just submitted new password
     * @memberof AuthService
     */
    setNewPassword = (password: string): void => {
        this.loading = true;
        this.newPassword = password;
    }

    /**
     * @desc Checks if user is logged in
     * @memberof AuthService
     */
    isLoggedIn = (): boolean => {
        return this.userPool.getCurrentUser() !== null;
    }

    /**
     * @desc Logs out currently logged in user
     * @memberof AuthService
     */
    logout = (): void => {
        if (this.isLoggedIn()) {
            this.getAuthenticatedUser().signOut();
            this.cognitoUser = null;
            this.storageService.clearTokens();
            this.router.navigate(['/login']);
        }
    }

    /**
     * @desc gets the current user from the local storage
     * @returns {CognitoUser} Cognito user
     * @memberof AuthService
     */
    getAuthenticatedUser = (): CognitoUser => {
        return this.userPool.getCurrentUser();
    }

    updateStorage = (tokens: CognitoUserSession) => {
        this.storageService.setTokens(tokens);
    }
}
