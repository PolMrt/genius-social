import axios from "axios";

const fetcher = ({ queryKey }: any) =>
  fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${queryKey[0]}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error");
    }
    return res.json();
  });

export default fetcher;

type FbFetcher = {
  queryKey: string[];
};

export const fbFetcher = ({ queryKey }: FbFetcher) => {
  const url = new URL(
    `https://graph.facebook.com/v${process.env.NEXT_PUBLIC_FB_V}${queryKey[0]}`
  );
  url.searchParams.append("access_token", queryKey[1]);
  return axios.get(url.href);
};

export const postFetcher = (url: string, body: any) =>
  axios
    .post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${url}`, body, {
      headers: localStorage.getItem("token")
        ? { Authorization: "Bearer " + localStorage.getItem("token") }
        : {},
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
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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
