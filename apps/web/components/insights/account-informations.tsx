import fetcher from "@/utils/fetcher";
import { useQuery } from "react-query";

type Props = {
  spaceSlug: string;
  accountId: string;
  plateformId: string;
};

export default function AccountInfos({
  spaceSlug,
  accountId,
  plateformId,
}: Props) {
  const accountInfos = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-informations`,
    fetcher
  );

  if (accountInfos.isLoading) return <div>Loading...</div>;
  if (accountInfos.isError) return <div>failed to load</div>;

  return (
    <div>
      <div>Follower : {accountInfos.data.followers_count}</div>
      <div>Following : {accountInfos.data.follows_count}</div>
      <div>Biography : {accountInfos.data.biography}</div>
      <div>Website : {accountInfos.data.website}</div>
    </div>
  );
}
