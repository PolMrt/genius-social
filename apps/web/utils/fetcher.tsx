const fetcher = ({ url, body = "" }: any) =>
  fetch(url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      // "Content-Type": "application/json",
    },
    body: body ? body : undefined,
  }).then((res) => res.json());

export default fetcher;
