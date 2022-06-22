import { fbFetcher } from "@/utils/fetcher";
import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";
import { useQuery } from "react-query";
import Button from "../ui/button";
import LoadingIndicator from "../ui/loadingIndicator";

type Props = {
  accessToken: string;
  selectedPageId: string;
  requestedAccountUsername: string;
  setSelectedInstaId: Function;
};

export default function InstagramAccount({
  accessToken,
  selectedPageId,
  requestedAccountUsername,
  setSelectedInstaId,
}: Props) {
  const [preSelectedInsta, setPreSelectedInsta] = useState(null);
  const [correctInstaAccount, setCorrectInstaAccount] = useState(false);

  const getInstagramAccounts = useQuery(
    [`/${selectedPageId}?fields=instagram_business_account`, accessToken],
    fbFetcher,
    {
      onSuccess: (data) => {
        if (data?.data?.instagram_business_account?.id) {
          setPreSelectedInsta(data.data.instagram_business_account.id);
        }
      },
    }
  );
  const getInstagramAccountInfos = useQuery(
    [
      `/${preSelectedInsta}?fields=name,profile_picture_url,username`,
      accessToken,
    ],
    fbFetcher,
    {
      enabled: !!preSelectedInsta,
      onSuccess: (data) => {
        console.log(data);
        if (data?.data?.username === requestedAccountUsername) {
          setCorrectInstaAccount(true);
        }
      },
    }
  );

  if (
    getInstagramAccounts.isLoading ||
    getInstagramAccountInfos.isLoading ||
    getInstagramAccountInfos.isIdle
  ) {
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (getInstagramAccounts.isError || getInstagramAccountInfos.isError) {
    return <span>Error</span>;
  }

  return (
    <div>
      {correctInstaAccount ? (
        <div>
          <div className="flex">
            <div className="mr-4">
              <img
                className="h-12 w-12 rounded-full"
                src={getInstagramAccountInfos.data.data.profile_picture_url}
                alt={`Instagram profile picture of @${getInstagramAccountInfos.data.data.username}`}
              />
            </div>
            <div>
              <div className="font-bold">
                {getInstagramAccountInfos.data.data.name}
              </div>
              <div className="text-sm text-gray-500">
                @{getInstagramAccountInfos.data.data.username}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() =>
                preSelectedInsta
                  ? setSelectedInstaId(preSelectedInsta)
                  : alert("An error occured")
              }
            >
              Allow access to this account
            </Button>
          </div>
        </div>
      ) : (
        <div>
          We could find an Instagram account corresponding to{" "}
          <span className="font-bold">@{requestedAccountUsername}</span> within
          this page.
        </div>
      )}
    </div>
  );
}
