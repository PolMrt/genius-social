import axios from "axios";

const fetcher = async ({ queryKey }: any) => {
  const data = await axios.get(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}${queryKey[0]}`,
    {
      withCredentials: true,
      ...getHeaders(),
    }
  );
  return data.data;
};

export default fetcher;

export const postFetcher = (url: string, body: any) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, body, {
      withCredentials: true,
      ...getHeaders(),
    })
    .catch((error) => {
      console.log(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.length > 0
      ) {
        if (typeof error.response.data.message === "object") {
          throw new ApiFormatedError(error.response.data.message);
        } else {
          throw new ApiFormatedError([error.response.data.message]);
        }
      } else if (error.request) {
        throw new Error("An error occured");
      }
    });

export const deleteFetcher = (url: string) =>
  axios
    .delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, {
      withCredentials: true,
      ...getHeaders(),
    })
    .catch((error) => {
      console.log(error.response.data);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.length > 0
      ) {
        throw new ApiFormatedError(error.response.data.message);
      } else if (error.request) {
        throw new Error("An error occured");
      }
    });

export class ApiFormatedError extends Error {
  messages: string[];

  constructor(messages: string[]) {
    super("API Error");
    this.messages = messages;
  }
}

function getHeaders(): object {
  return {
    headers: getCookie("XSRF-TOKEN")
      ? {
          "xsrf-token": getCookie("XSRF-TOKEN") || "",
        }
      : {},
  };
}

function getCookie(name: string): string | null | undefined {
  const match: string[] = document?.cookie?.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  ) || [""];

  if (match && match.length > 2) {
    return match[2] || null;
  }
}

// FACEBOOK

type FbFetcher = {
  queryKey: string[];
};

export const fbFetcher = ({ queryKey }: FbFetcher) => {
  const url = new URL(
    `https://graph.facebook.com/v${process.env.NEXT_PUBLIC_FB_V}${queryKey[0]}`
  );
  url.searchParams.append("access_token", queryKey[1]);
  url.searchParams.append("locale", "en");
  return axios.get(url.href);
};
