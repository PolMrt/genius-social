const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export default fetcher;
