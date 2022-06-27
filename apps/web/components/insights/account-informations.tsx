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
      <div className="p-2">
        <div className="flex items-center">
          <div className="flex-none">
            <img
              className="h-24 w-24 rounded-full"
              src={accountInfos.data.profile_picture_url}
              alt="Account profile picture"
            />
          </div>
          <div className="grid w-full grid-cols-3">
            <Counter title="Posts" value={accountInfos.data.media_count} />
            <Counter
              title="Followers"
              value={accountInfos.data.followers_count}
            />
            <Counter
              title="Following"
              value={accountInfos.data.follows_count}
            />
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
      </div>
    </Card>
  );
}

type CounterProps = {
  title: string;
  value: number;
};

function Counter({ title, value }: CounterProps) {
  return (
    <dl className="flex flex-col items-center">
      <dd className="text-xl font-bold">{value}</dd>
      <dt>{title}</dt>
    </dl>
  );
}
