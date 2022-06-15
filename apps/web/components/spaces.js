import useSWR from "swr";

const fetcher = (token, url) =>
  fetch(url, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export default function Spaces({ token }) {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces`,
    (url) => fetcher(token, url)
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <>
      <h2>Spaces</h2>
      <ul>
        {data.map((thisSpace) => (
          <li>{thisSpace.name}</li>
        ))}
      </ul>
    </>
  );
}
