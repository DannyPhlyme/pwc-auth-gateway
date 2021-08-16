import { Injectable } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs';
import { SendEmailDto } from 'src/dtos/auth/send-email.dto';

@Injectable()
export class UtilitiesService {
  /**
   * Mail a user
   */
  public async sendMail(payload: SendEmailDto): Promise<void> {
    try {
      const axiosInstance = axios.create({
        baseURL: process.env.ELASTIC_EMAIL_URL,
        params: {
          apiKey: process.env.ELASTIC_EMAIL_API_KEY,
        },
      });
      const response = await axiosInstance.post(
        '/email/send',
        {},
        {
          params: payload.data,
        },
      );
      
    } catch (error: any) {}
  }

  /**
   * Add user to aweber list
   */
  public async addToAweber(email: string, name: string): Promise<void> {
    const axiosInstance = axios.create();
    const tokenUrl = 'https://auth.aweber.com/oauth2/token';
    const clientId = process.env.AWEBER_CLIENT_ID;
    const url =
      'https://api.aweber.com/1.0/accounts/1777664/lists/6064064/subscribers';
    const token = this.readToken()['token'];
    const extra = {
      client_id: process.env.AWEBER_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: token['refresh_token'],
    };
    const data = {
      email: email,
      name: name,
    };

    try {
      await axiosInstance.post(url, data, {});
    } catch (error) {
      if (error.response.status == 401) {
        // if status code is 401
        try {
          const response = await axios.post(tokenUrl, extra, {}); // get new access token
          const newToken = {
            token: response.data,
          };

          this.updateToken(newToken);
            await axios.post(token, data, {
              params: {
                client_id: clientId,
                token: token,
              },
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'User-Agent': 'AWeber-NodeJS-code-sample/1.0',
                Authorization:
                  'Bearer ' + this.readToken()['token']['access_token'],
              },
          });
        } catch (error: any) {}
      }
    }
  }

  /**
   * Reads token from the file
   */
  private readToken() {
    return JSON.parse(fs.readFileSync('credentials.json', 'utf-8').toString());
  }

  /**
   * Updates the token in the json file
   */
  private updateToken(token: any) {
    fs.writeFileSync('credentials.json', JSON.stringify(token));
  }
}
