import fetcher from "@/utils/fetcher";
import { useState } from "react";
import { useQuery } from "react-query";
import Card from "../ui/card";
import LoadingIndicator from "../ui/loadingIndicator";

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountInfos({ spaceSlug, accountId }: Props) {
  const [bioURL, setBioURL] = useState<null | URL>(null);
  const accountInfos = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-informations`,
    fetcher,
    {
      onSuccess: (data) => {
        if (data?.infos?.website) {
          const url = new URL(data.website);
          setBioURL(url);
        }
      },
    }
  );

  if (accountInfos.isLoading)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  if (accountInfos.isError) return <div>failed to load</div>;

  return (
    <Card className="mb-6">
      <div className="flex">
        <div className="flex-none">
          <img
            className="h-24 w-24 rounded-full"
            src={accountInfos.data.profile_picture_url}
            alt="Account profile picture"
          />
        </div>
        <div className="grid w-full grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {accountInfos.data.media_count}
            </div>
            <div>Posts</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {accountInfos.data.followers_count}
            </div>
            <div>Followers</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">
              {accountInfos.data.follows_count}
            </div>
            <div>Following</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="font-bold">{accountInfos.data.name}</div>
        {/* <div className="text-gray-600">cat pro</div> */}
        <div>{accountInfos.data.biography}</div>
        {bioURL && bioURL instanceof URL ? (
          <a
            className="text-blue-900"
            href={bioURL.href}
            target="_blank"
            rel="noreferrer"
          >
            {bioURL.host + bioURL.pathname}
          </a>
        ) : null}
      </div>
    </Card>
  );
}
