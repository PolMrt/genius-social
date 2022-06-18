import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

export default function Spaces() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces`,
    (url) => fetcher(url)
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return (
    <ul className="flex">
      {data.map((thisSpace) => (
        <li className="border rounded-md px-4 py-2 mr-4 mb-4">
          {thisSpace.name}
        </li>
      ))}
    </ul>
  );
}
