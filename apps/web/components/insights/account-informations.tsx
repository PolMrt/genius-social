import fetcher from "@/utils/fetcher";
import { useState } from "react";
import { useQuery } from "react-query";
import LoadingIndicator from "../ui/loadingIndicator";

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountInfos({ spaceSlug, accountId }: Props) {
  const [bioURL, setBioURL] = useState(null);
  const accountInfos = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-informations`,
    fetcher,
    {
      onSuccess: (data) => {
        if (data?.infos?.website) {
          const url = new URL(data.infos.website);
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
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-8 sm:px-12">
        <div className="flex">
          <div className="flex-none">
            <img
              className="h-24 w-24 rounded-full"
              src={accountInfos.data.infos.profile_picture_url}
              alt="Account profile picture"
            />
          </div>
          <div className="grid w-full grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold">
                {accountInfos.data.infos.media_count}
              </div>
              <div>Posts</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold">
                {accountInfos.data.infos.followers_count}
              </div>
              <div>Followers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold">
                {accountInfos.data.infos.follows_count}
              </div>
              <div>Following</div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-bold">{accountInfos.data.infos.name}</div>
          {/* <div className="text-gray-600">cat pro</div> */}
          <div>{accountInfos.data.infos.biography}</div>
          {bioURL && bioURL instanceof URL ? (
            <a
              className="text-blue-900"
              href={accountInfos.data.infos.website}
              target="_blank"
            >
              {bioURL.host + bioURL.pathname}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
