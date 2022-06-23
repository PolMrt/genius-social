import Button, { ButtonStyles } from "@/components/ui/button";
import fetcher, { deleteFetcher } from "@/utils/fetcher";
import {
  ChartBarIcon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as dayjs from "dayjs";
import { useMemo } from "react";
import classNames from "classnames";

type Props = {
  spaceSlug: string;
};

export default function ConnectedAccountsList({ spaceSlug }: Props) {
  const { isLoading, isError, data, error } = useQuery(
    `/space/${spaceSlug}/connected-accounts`,
    fetcher
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>failed to load</div>;

  if (data.length > 0)
    return (
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {data.map((thisAccount) => (
          <Card
            key={thisAccount.id}
            account={thisAccount}
            spaceSlug={spaceSlug}
          />
        ))}
      </ul>
    );

  return (
    <div className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <svg
        className="mx-auto h-20 w-20 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="8"
          r="3.25"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        ></circle>
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M12.25 19.25h-5.3c-1.18 0-2.06-1.04-1.46-2.055C6.363 15.723 8.24 14 12.25 14M17 14.75v4.5M19.25 17h-4.5"
        ></path>
      </svg>
      <span className="mt-2 block text-sm font-medium text-gray-900">
        You&apos;ve sent no connected accounts
      </span>
    </div>
  );
}

type CardProps = {
  account: any;
  spaceSlug: string;
};

function Card({ account, spaceSlug }: CardProps) {
  const daysExpires = useMemo(
    () => dayjs(account.expires).diff(dayjs(), "days"),
    [account.expires]
  );

  const color = useMemo(() => {
    if (daysExpires < 10) {
      return "bg-red-100 text-red-800";
    } else if (daysExpires < 30) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  }, [daysExpires]);

  return (
    <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div className="flex w-full items-center justify-between space-x-6 p-6">
        <img
          className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-300"
          src={account.profilePictureUrl}
          alt=""
        />
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate text-sm font-bold text-gray-900">
              {account.name}
            </h3>
            <span
              className={classNames(
                color,
                "inline-block flex-shrink-0 rounded-full  px-2 py-0.5 text-xs font-medium"
              )}
            >
              {daysExpires > 0 ? (
                <>
                  Expires in {daysExpires} day{daysExpires > 1 ? "s" : ""}
                </>
              ) : (
                <>Expired</>
              )}
            </span>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">
            @{account.identifier}
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="flex w-0 flex-1">
            <Link href={`/${spaceSlug}/connected-accounts/` + account.id}>
              <a className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
                <ChartBarIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-3">Insights</span>
              </a>
            </Link>
          </div>
          {/* <div className="-ml-px flex w-0 flex-1">
            <a className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
              <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">Call</span>
            </a>
          </div> */}
        </div>
      </div>
    </li>
  );
}
