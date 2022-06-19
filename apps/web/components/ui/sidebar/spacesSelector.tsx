/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";

import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import Createspace from "@/components/spaces/createSpace";
import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";

type Props = {
  currentSpace: string;
};

export default function SpacesSelector({ currentSpace }: Props) {
  const [newSpaceSliderOpen, setNewSpaceSliderOpen] = useState(false);
  return (
    <>
      <Createspace open={newSpaceSliderOpen} setOpen={setNewSpaceSliderOpen} />

      <Menu as="div" className="relative text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-300 shadow-sm  focus:outline-none focus:ring-2 focus:ring-dark-blue-300 focus:ring-offset-2 focus:ring-offset-dark-blue-700">
            {currentSpace ? currentSpace : "Select space"}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 bottom-12 mt-2 w-56 origin-bottom-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <AllUserSpaces />
            </div>
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setNewSpaceSliderOpen(true)}
                    className={classNames(
                      active ? " bg-gray-100 text-gray-900" : "text-gray-700",
                      "inline-flex w-full items-center px-4 py-2 text-left text-sm"
                    )}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    New space
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}

export function AllUserSpaces() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  return data.map((thisSpace: any) => (
    <div key={thisSpace.id}>
      <Menu.Item>
        {({ active }) => (
          <Link href={`/${thisSpace.slug}`}>
            <a
              className={classNames(
                active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                "block px-4 py-2 text-sm"
              )}
            >
              {thisSpace.name}
            </a>
          </Link>
        )}
      </Menu.Item>
    </div>
  ));
}
