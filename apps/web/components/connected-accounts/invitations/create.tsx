import { FormEvent, Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import slugify from "slugify";
import { useMutation, useQueryClient } from "react-query";

import Button, { ButtonStyles } from "@/components/ui/button";
import { postFetcher } from "@/utils/fetcher";
import { ApiFormatedError } from "utils/fetcher";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  spaceSlug: string;
};

export default function CreateInvitation({ open, setOpen, spaceSlug }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newInvitation: any) => {
      return postFetcher(`/space/${spaceSlug}/invitations`, newInvitation);
    },
    {
      onSuccess: (data) => {
        setOpen(false);
        queryClient.setQueryData(
          `/space/${spaceSlug}/invitations`,
          (draft: any) => [...draft, data?.data]
        );
      },
    }
  );

  const onCreateInvitation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      identifier: HTMLInputElement;
    };

    mutation.mutate({ identifier: formElements.identifier.value });
  };

  const closePanel = () => {
    mutation.reset();
    setOpen(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closePanel}>
        <div className="fixed inset-0 bg-gray-500/25" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    onSubmit={onCreateInvitation}
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-dark-blue-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            New Invitation
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-dark-blue-700 text-dark-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-dark-blue-300">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Ad, quasi quos placeat beatae unde vel impedit
                            debitis quidem at. Itaque adipisci modi placeat
                            libero pariatur voluptatum reiciendis unde facere
                            accusamus?
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pt-6 pb-5">
                            {mutation.isError ? (
                              <div>
                                An error occured :
                                {mutation.error instanceof ApiFormatedError ? (
                                  <ul className="list-inside list-disc">
                                    {mutation.error.messages.map(
                                      (thisMessage) => (
                                        <li key={thisMessage}>{thisMessage}</li>
                                      )
                                    )}
                                  </ul>
                                ) : (
                                  mutation.error
                                )}
                              </div>
                            ) : null}

                            <div>
                              <label
                                htmlFor="identifier"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Username
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="identifier"
                                  id="identifier"
                                  placeholder="instagram"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <Button
                        type="reset"
                        style={ButtonStyles.secondary}
                        onClick={closePanel}
                        loading={mutation.isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        style={ButtonStyles.primary}
                        className="ml-4"
                        loading={mutation.isLoading}
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
