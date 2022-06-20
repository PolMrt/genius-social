const fetcher = ({ queryKey }: any) =>
  fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${queryKey[0]}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      // "Content-Type": "application/json",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error");
    }
    return res.json();
  });

export default fetcher;
