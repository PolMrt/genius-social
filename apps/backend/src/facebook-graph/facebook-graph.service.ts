import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { first, firstValueFrom } from "rxjs";

@Injectable()
export class FacebookGraphService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

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
