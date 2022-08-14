import fetcher from "@/utils/fetcher";
import { Dialog, Transition } from "@headlessui/react";
import {
  BookmarkIcon,
  ChatIcon,
  CheckIcon,
  ExternalLinkIcon,
  HeartIcon,
  PaperAirplaneIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Fragment, useMemo } from "react";
import { useQuery } from "react-query";
import Button, { ButtonStyles } from "../ui/button";
import LoadingIndicator from "../ui/loadingIndicator";

enum IconEnum {
  heart,
  comment,
  send,
  save,
}

type IconProps = {
  iconType: IconEnum;
  value: number;
};

const PostStat = ({ iconType, value }: IconProps) => {
  return (
    <div className="flex justify-center rounded-lg border-2 border-gray-300 p-2 text-gray-800">
      <div className="flex flex-col items-center">
        {iconType === IconEnum.heart ? <HeartIcon className="w-6" /> : null}
        {iconType === IconEnum.comment ? <ChatIcon className="w-6" /> : null}
        {iconType === IconEnum.send ? (
          <PaperAirplaneIcon className="w-6" />
        ) : null}
        {iconType === IconEnum.save ? <BookmarkIcon className="w-6" /> : null}
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
  );
};

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  media: any;
  spaceSlug: string;
  accountId: string;
};

export default function SinglePostModal({
  open,
  setOpen,
  media,
  spaceSlug,
  accountId,
}: Props) {
  const accountInfos = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-informations`,
    fetcher
  );
  const captionSplitted = useMemo(() => media?.caption?.split("\n"), [media]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              {accountInfos.isLoading || media === null ? (
                <Dialog.Panel className="relative flex transform justify-center overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  <LoadingIndicator />
                </Dialog.Panel>
              ) : accountInfos.error ? (
                <Dialog.Panel className="relative flex transform justify-center overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  An error occured
                </Dialog.Panel>
              ) : (
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  <div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col justify-center">
                        {media.media_type === "VIDEO" ? (
                          <video className="w-full" controls>
                            <source src={media.media_url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={media.media_url}
                            className="rounded"
                            alt="Instagram post"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex space-x-4">
                            <div className="flex-none">
                              <img
                                src={accountInfos.data.profile_picture_url}
                                alt="Account profile picture"
                                className="h-auto w-10 rounded-full"
                              />
                            </div>
                            <div>
                              <div className="space-y-4">
                                <p>
                                  <span className="mr-2 font-bold">
                                    {accountInfos.data.username}
                                  </span>
                                  {captionSplitted[0]}
                                </p>
                                {captionSplitted
                                  .slice(1)
                                  .map((thisCaption: string) => (
                                    <p key={thisCaption}>{thisCaption}</p>
                                  ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 grid grid-cols-4 gap-4">
                            <PostStat
                              iconType={IconEnum.heart}
                              value={media.like_count}
                            />
                            <PostStat
                              iconType={IconEnum.comment}
                              value={media.comments_count}
                            />
                            <PostStat iconType={IconEnum.send} value={-1} />
                            <PostStat iconType={IconEnum.save} value={-1} />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            onClick={() =>
                              window.open(media.permalink, "_blank")
                            }
                          >
                            Instagram
                            <ExternalLinkIcon className="ml-2 h-5 w-5" />
                          </Button>
                          <Button
                            style={ButtonStyles.secondary}
                            onClick={() => setOpen(false)}
                          >
                            Close <XIcon className="ml-2 h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-dark-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-dark-blue-700 focus:outline-none focus:ring-2 focus:ring-dark-blue-500 focus:ring-offset-2 sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Go back to dashboard
                    </button>
                  </div> */}
                </Dialog.Panel>
              )}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
