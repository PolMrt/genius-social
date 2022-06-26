import Button, { ButtonStyles } from "@/components/ui/button";
import fetcher, { deleteFetcher } from "@/utils/fetcher";
import { ExternalLinkIcon, TrashIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";

type Props = {
  spaceSlug: string;
};

export default function AllConnectedAccounts({ spaceSlug }: Props) {
  const { isLoading, isError, data, error } = useQuery(
    `/space/${spaceSlug}/invitations`,
    fetcher
  );

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>failed to load</div>;

  if (data.length > 0)
    return (
      <div className="flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Username
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      State
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((thisInvitation: any) => (
                    <Row
                      key={thisInvitation.id}
                      spaceSlug={spaceSlug}
                      invitation={thisInvitation}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
        You&apos;ve sent no invitations
      </span>
    </div>
  );
}

type RowProps = {
  spaceSlug: string;
  invitation: any;
};

function Row({ spaceSlug, invitation }: RowProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (invitationId: number) =>
      deleteFetcher(`/space/${spaceSlug}/invitations/${invitationId}`),
    {
      onSuccess: (_, invitationId) => {
        queryClient.setQueryData(
          `/space/${spaceSlug}/invitations`,
          (draft: any) => {
            if (typeof draft === typeof ["a"]) {
              return draft.filter(
                (thisDraft: any) => thisDraft?.id !== invitationId
              );
            } else {
              return draft;
            }
          }
        );
      },
      onError: (error) => {
        alert("An error occured");
        console.error(error);
      },
    }
  );

  const onDelete = () => {
    if (confirm(`Delete invitation to ${invitation.identifier} ?`)) {
      mutation.mutate(invitation.id);
    }
  };

  return (
    <tr className="relative overflow-hidden">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        @{invitation.identifier}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {invitation.state}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button
          className="mr-4 inline-flex text-red-700"
          onClick={onDelete}
          disabled={mutation.isLoading}
        >
          <TrashIcon className="mr-1 h-4 w-4" />
          Delete
        </button>
        <Link href={`/invitation/${spaceSlug}/${invitation.uniqueId}`}>
          <a
            target={"_blank"}
            className="inline-flex items-center text-dark-blue-600 hover:text-dark-blue-900"
          >
            <ExternalLinkIcon className="mr-1 h-4 w-4" />
            See
          </a>
        </Link>
      </td>

      {mutation.isLoading ? (
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-gray-300/50 object-cover backdrop-blur" />
      ) : null}
    </tr>
  );
}
