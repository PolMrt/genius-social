import Link from "next/link";
import useSWR from "swr";
import Createspace from "./createSpace";

const fetcher = (url: string) =>
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
    <>
      {data.length > 0 ? (
        <ul className="flex">
          {data.map((thisSpace: any) => (
            <li className="mr-4 mb-4 rounded-md border px-4 py-2">
              <Link href={"/" + thisSpace.slug}>{thisSpace.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>You have no space</h2>
          <Createspace />
        </div>
      )}
    </>
  );
}
