import { FormEvent, Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import slugify from "slugify";
import { useMutation } from "react-query";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function Createspace({ open, setOpen }: Props) {
  const [spaceName, setSpaceName] = useState("");
  const [spaceSlug, setSpaceSlug] = useState("");

  useEffect(() => {
    setSpaceSlug(slugify(spaceName).toLowerCase());
  }, [spaceName]);

  const mutation = useMutation((newSpace: any) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces`, {
      body: JSON.stringify(newSpace),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOpen(false);
      });
  });

  const onCreateSpace = (e: FormEvent) => {
    e.preventDefault();

    mutation.mutate({ name: spaceName, slug: spaceSlug });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                    onSubmit={onCreateSpace}
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-dark-blue-700 py-6 px-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-medium text-white">
                            New Space
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
                            <div>
                              <label
                                htmlFor="space-name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Space name
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="space-name"
                                  id="project-name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
                                  value={spaceName}
                                  onChange={(e) => setSpaceName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="space-name"
                                className="block text-sm font-medium text-gray-900"
                              >
                                Space slug
                              </label>
                              <div className="mt-1">
                                <input
                                  type="text"
                                  name="space-name"
                                  id="project-name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
                                  value={spaceSlug}
                                  onChange={(e) => setSpaceSlug(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-dark-blue-500 focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={mutation.isLoading}
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-dark-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-dark-blue-700 focus:outline-none focus:ring-2 focus:ring-dark-blue-500 focus:ring-offset-2"
                      >
                        Save
                      </button>
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
