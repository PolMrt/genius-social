import fetcher from "@/utils/fetcher";
import Link from "next/link";
import { useQuery } from "react-query";

type Props = {
  spaceSlug: string;
};

export default function AllConnectedAccounts({ spaceSlug }: Props) {
  const { isLoading, isError, data, error } = useQuery(
    `/space/${spaceSlug}/connected-accounts/invitations`,
    fetcher
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>failed to load</div>;

  return (
    <div>
      <ul>
        {data.map((thisInvitation: any) => (
          <li key={thisInvitation.id}>
            {thisInvitation.identifier} -{" "}
            <Link href={`/invitation/${spaceSlug}/${thisInvitation.uniqueId}`}>
              <a target={"_blank"}>page</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
