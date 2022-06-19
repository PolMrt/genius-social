import fetcher from "@/utils/fetcher";
import useSWR from "swr";

type Props = {
  spaceSlug: string;
};

export default function AllConnectedAccounts({ spaceSlug }: Props) {
  const { data, error } = useSWR(
    {
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/connected-accounts/invitations/${spaceSlug}`,
    },
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
