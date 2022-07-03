/* This example requires Tailwind CSS v2.0+ */
import { forwardRef, Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";

import fetcher from "@/utils/fetcher";
import Createspace from "@/components/spaces/createSpace";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useQuery } from "react-query";

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
          <Menu.Button className="flex w-full items-center justify-between text-gray-300">
            <div className="flex w-full items-center text-white">
              {currentSpace ? (
                <div className="mr-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500">
                  <div className="font-bold">
                    {currentSpace[0].toUpperCase()}
                  </div>
                </div>
              ) : null}
              <div className="text-sm font-medium">
                {currentSpace ? currentSpace : "Select space"}
              </div>
            </div>
            <div>
              <ChevronDownIcon className="h-5 w-5" />
            </div>
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
          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
  const { isLoading, isError, data, error } = useQuery("/spaces", fetcher);

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>failed to load</div>;

  return data.map((thisSpace: any) => (
    <div key={thisSpace.id}>
      <Menu.Item>
        {({ active }) => (
          <MyLink
            href={`/${thisSpace.slug}`}
            className={classNames(
              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
              "block px-4 py-2 text-sm"
            )}
          >
            {thisSpace.name}
          </MyLink>
        )}
      </Menu.Item>
    </div>
  ));
}
const MyLink = forwardRef((props: any, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});
MyLink.displayName = "MyLink";
