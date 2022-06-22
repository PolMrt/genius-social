import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { first, firstValueFrom } from "rxjs";
import cryptoJs from "crypto-js";

type DecrypToken = {
  accessToken: string;
  spaceSlug: string;
};
@Injectable()
export class FacebookGraphService {
  tokenSeparator: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.tokenSeparator = "||d-b||";
  }

  encryptToken(accessToken: string, spaceSlug: string): string {
    const spaceKey = this.configService.get<string>("ENCRYPT_KEY_SPACE");
    const tokenKey = this.configService.get<string>("ENCRYPT_KEY_TOKEN");

    if (!spaceKey || !tokenKey) {
      throw new Error("Missing encryptions key(s)");
    }

    const tokenEncrypted = cryptoJs.AES.encrypt(
      accessToken,
      tokenKey
    ).toString();
    const tokenFullyEncrypted = cryptoJs.AES.encrypt(
      spaceSlug + this.tokenSeparator + tokenEncrypted,
      spaceKey
    ).toString();

    return tokenFullyEncrypted;
  }

  decryptToken(token: string): DecrypToken {
    const spaceKey = this.configService.get<string>("ENCRYPT_KEY_SPACE");
    const tokenKey = this.configService.get<string>("ENCRYPT_KEY_TOKEN");

    if (!spaceKey || !tokenKey) {
      throw new Error("Missing encryptions key(s)");
    }

    const decoded_1 = cryptoJs.AES.decrypt(token, spaceKey).toString(
      cryptoJs.enc.Utf8
    );
    const splited = decoded_1.split(this.tokenSeparator);

    if (splited.length < 2) {
      throw new Error("Error while decrypting token");
    }

    const spaceSlug = splited[0];
    const tokenEcrypted = splited[1];
    const accessToken = cryptoJs.AES.decrypt(tokenEcrypted, tokenKey).toString(
      cryptoJs.enc.Utf8
    );

    return { spaceSlug, accessToken };
  }

  async getUserPages(accessToken: string) {
    const data = await this.fetcher("/me/accounts", accessToken);
    return data.data;
  }

  async getPageInstagramAccount(accessToken: string, pageId: string) {
    const data = await this.fetcher(
      `/${pageId}?fields=instagram_business_account`,
      accessToken
    );

    return data.data;
  }

  async getInstagramBusinessAccountInfos(
    accessToken: string,
    instagramAccountId: string
  ) {
    const data = await this.fetcher(
      `/${instagramAccountId}?fields=name,profile_picture_url,username`,
      accessToken
    );

    return data.data;
  }

  async getLongToken(accessToken: string) {
    const data = await this.fetcher(
      `/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.configService.get<string>(
        "FB_APP_ID"
      )}&client_secret=${this.configService.get<string>(
        "FB_APP_SECRET"
      )}&fb_exchange_token=${accessToken}`,
      accessToken
    );

    return data.data;
  }

  private fetcher(url: string, accessToken: string) {
    const fetchUrl = new URL(
      `https://graph.facebook.com/v${this.configService.get<string>(
        "FB_V"
      )}${url}`
    );
    fetchUrl.searchParams.append("access_token", accessToken);

    return firstValueFrom(this.httpService.get(fetchUrl.href));
  }
}
