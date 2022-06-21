/* This example requires Tailwind CSS v2.0+ */
import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { HomeIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import SpacesSelector from "./spacesSelector";
import { UserIcon } from "@heroicons/react/solid";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";

type Tab = {
  name: string;
  href: string;
};

type Props = {
  children: ReactNode;
  title: string;
  currentSpace?: string | null;
  currentSpaceSlug?: string | null;
  actions?: ReactNode[];
  tabs?: Tab[];
};

export default function Sidebar({
  children,
  title,
  currentSpace = null,
  currentSpaceSlug = null,
  actions = [],
  tabs = [],
}: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useMemo(() => {
    if (!currentSpaceSlug) return [];
    const routes = [
      {
        name: "Dashboard",
        href: "/" + currentSpaceSlug,
        icon: HomeIcon,
        current: false,
      },
      {
        name: "Connected Accounts",
        href: "/" + currentSpaceSlug + "/connected-accounts",
        icon: UserIcon,
        current: false,
      },
    ];

    return routes.map((thisRoute) => ({
      ...thisRoute,
      current: router.asPath.split("/")[2] === thisRoute.href.split("/")[2],
    }));
  }, [currentSpaceSlug, router]);

  const tabsWithCurrent = useMemo(() => {
    if (!currentSpaceSlug) return [];
    const tabsToRet = tabs.map((thisTab) => ({
      ...thisTab,
      href: thisTab.href.replace("[spaceSlug]", currentSpaceSlug),
    }));
    return tabsToRet.map((thisTab) => ({
      ...thisTab,
      current: router.asPath === thisTab.href,
    }));
  }, [currentSpaceSlug, router, tabs]);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-dark-blue-700">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                    <div className="flex flex-shrink-0 items-center px-4">
                      <img
                        className="h-8 w-auto"
                        src="/logo.svg"
                        alt="Genius Social"
                      />
                    </div>
                    <nav className="mt-5 space-y-1 px-2">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-dark-blue-800 text-white"
                              : "text-white hover:bg-dark-blue-600 hover:bg-opacity-75",
                            "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                          )}
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 flex-shrink-0 text-dark-blue-300"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 border-t border-dark-blue-800 p-4">
                    <a href="#" className="group block flex-shrink-0">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block h-10 w-10 rounded-full"
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-white">
                            Tom Cook
                          </p>
                          <p className="text-sm font-medium text-dark-blue-200 group-hover:text-white">
                            View profile
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col bg-dark-blue-700">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="Genius Social"
                />
              </div>
              <nav className="mt-5 flex-1 space-y-1 px-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={classNames(
                        item.current
                          ? "bg-dark-blue-800 text-white"
                          : "text-white hover:bg-dark-blue-600 hover:bg-opacity-75",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      <item.icon
                        className="mr-3 h-6 w-6 flex-shrink-0 text-dark-blue-300"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mb-4 px-4">
              <SpacesSelector currentSpace={currentSpace} />
            </div>
            <div className="flex flex-shrink-0 border-t border-dark-blue-800 p-4">
              <a href="#" className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Tom Cook</p>
                    <p className="text-xs font-medium text-dark-blue-200 group-hover:text-white">
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dark-blue-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 md:px-8">
                <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
                  <div className="md:flex md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                      {title}
                    </h1>
                    <div
                      className={classNames(
                        "flex md:absolute md:right-0 md:mt-0",
                        { "mt-3 md:top-3": tabsWithCurrent.length > 0 }
                      )}
                    >
                      {actions}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="sm:hidden">
                      <label htmlFor="current-tab" className="sr-only">
                        Select a tab
                      </label>
                      <select
                        id="current-tab"
                        name="current-tab"
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                        defaultValue={
                          tabsWithCurrent.find((tab) => tab.current)?.name
                        }
                      >
                        {tabsWithCurrent.map((tab) => (
                          <option key={tab.name}>{tab.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="hidden sm:block">
                      <nav className="-mb-px flex space-x-8">
                        {tabsWithCurrent.map((tab) => (
                          <Link key={tab.name} href={tab.href}>
                            <a
                              className={classNames(
                                tab.current
                                  ? "border-dark-blue-500 text-dark-blue-600"
                                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                              )}
                              aria-current={tab.current ? "page" : undefined}
                            >
                              {tab.name}
                            </a>
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
