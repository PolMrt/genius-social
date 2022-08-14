import fetcher from "@/utils/fetcher";
import { ChatIcon, HeartIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { useInfiniteQuery } from "react-query";
import Button from "../ui/button";
import Card from "../ui/card";
import LoadingIndicator from "../ui/loadingIndicator";

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountPosts({ spaceSlug, accountId }: Props) {
  const posts = useInfiniteQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-posts`,
    async ({ queryKey, pageParam = "" }) => {
      const data = await fetcher({
        queryKey: [queryKey + "?next=" + pageParam],
      });
      return data;
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next && lastPage.next !== "") {
          return lastPage.next;
        }
        return undefined;
      },
    }
  );

  return (
    <Card className="mb-6">
      {posts.status === "loading" ? (
        <div className="flex items-center justify-center text-gray-700">
          <div>
            <LoadingIndicator />
          </div>
        </div>
      ) : posts.status === "error" ? (
        <span>Error</span>
      ) : (
        <>
          <ul className="grid gap-6 md:grid-cols-3">
            {posts?.data?.pages.map((page) => (
              <Fragment key={page.nextId}>
                {page.data?.map((thisPost: any) => (
                  <li
                    key={thisPost.id}
                    className="flex flex-col justify-center"
                  >
                    <div className="group relative w-full overflow-hidden rounded pb-[100%]">
                      <img
                        src={
                          thisPost.media_type === "VIDEO"
                            ? thisPost.thumbnail_url
                            : thisPost.media_url
                        }
                        className="absolute left-1/2 top-1/2 h-full w-full -translate-y-1/2 -translate-x-1/2 rounded object-cover"
                        alt="IG post"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-black/0 py-4 text-white">
                        <div className="flex space-x-4 pl-4">
                          <div className="flex items-center">
                            <HeartIcon className="h-6 w-6" />
                            <div className="ml-2">{thisPost.like_count}</div>
                          </div>
                          <div className="flex items-center">
                            <ChatIcon className="h-6 w-6" />
                            <div className="ml-2">
                              {thisPost.comments_count}
                            </div>
                          </div>
                        </div>
                      </div>

                      {thisPost.media_type === "VIDEO" ? (
                        <div className="absolute top-4 right-4 text-white">
                          <svg className="h-6 w-6" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M12.823 1l2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 011.596 2.82l.07.295h-4.629L15.15 1zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 013.942-4.53zm9.735 12.834l-4.545-2.624a.909.909 0 00-1.356.668l-.008.12v5.248a.91.91 0 001.255.84l.109-.053 4.545-2.624a.909.909 0 00.1-1.507l-.1-.068-4.545-2.624zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189z"
                            ></path>
                          </svg>
                        </div>
                      ) : null}

                      {thisPost.media_type === "CAROUSEL_ALBUM" ? (
                        <div className="absolute top-4 right-4 text-white">
                          <svg className="h-6 w-6" viewBox="0 0 48 48">
                            <path
                              fill="currentColor"
                              d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"
                            ></path>
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
          <div className="mt-4 flex justify-center">
            {posts.hasNextPage ? (
              <Button
                loading={posts.isFetchingNextPage}
                onClick={() => posts.fetchNextPage()}
              >
                Load more
              </Button>
            ) : (
              <div>That&apos;s it !</div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
