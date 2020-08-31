import { environment } from './environment';

/**
 * Wrapper class around environment
 * which is used to retrieve environment
 * variables and configurations
 */
class Config {
  /**
   * @desc Gets AWS endpoint for lambda service
   * @returns {string}
   */
  getAwsURL(): string {
    return environment.AWS_URL;
  }

  getGameFormats(): string[] {
    return environment.GAME_FORMATS.split(',');
  }

  /**
   * @desc Gets AWS Cognito user pool ID
   * @returns {string}
   */
  getCognitoPoolID(): string {
    return environment.COGNITO_POOL_ID;
  }
  /**
   * @desc Gets AWS Cognito client app ID
   * @returns {string}
   */
  getCognitoClientID(): string {
    return environment.COGNITO_CLIENT_ID;
  }
}

export default new Config();
