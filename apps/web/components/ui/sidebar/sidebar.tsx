/* This example requires Tailwind CSS v2.0+ */
import { Fragment, ReactNode, useEffect, useMemo, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CogIcon,
  HomeIcon,
  MenuIcon,
  UsersIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import SpacesSelector from "./spacesSelector";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import fetcher, { postFetcher } from "@/utils/fetcher";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LoadingIndicator from "../loadingIndicator";

type Tab = {
  name: string;
  href: string;
};

type TabsLinkEnricher = {
  name: string;
  value: string;
};

type Props = {
  children: ReactNode;
  title: string;
  currentSpace?: string | null;
  currentSpaceSlug?: string | null;
  actions?: ReactNode[];
  tabs?: Tab[];
  tabsLinkEnricher?: TabsLinkEnricher[];
};

export default function Sidebar({
  children,
  title,
  currentSpaceSlug = null,
  actions = [],
  tabs = [],
  tabsLinkEnricher = [],
}: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userData = useQuery(`/users/me`, fetcher);

  const spaceData = useQuery(`/spaces/${currentSpaceSlug}`, fetcher, {
    enabled: !!currentSpaceSlug,
  });
  const spaceDataReady = useMemo(
    () => !(spaceData.isIdle || spaceData.isLoading || spaceData.isError),
    [spaceData]
  );

  const navigation = useMemo(() => {
    if (!currentSpaceSlug) return [];
    const routes = [
      {
        name: "Dashboard",
        href: "/" + currentSpaceSlug,
        icon: HomeIcon,
        current: false,
        admin: false,
      },
      {
        name: "Connected Accounts",
        href: "/" + currentSpaceSlug + "/connected-accounts",
        icon: UserIcon,
        current: false,
        admin: false,
      },
      {
        name: "Users",
        href: "/" + currentSpaceSlug + "/users",
        icon: UsersIcon,
        current: false,
        admin: true,
      },
      {
        name: "Settings",
        href: "/" + currentSpaceSlug + "/settings",
        icon: CogIcon,
        current: false,
        admin: true,
      },
    ];

    if (!spaceDataReady) return [];

    return routes
      .filter(
        (thisRoute) =>
          !thisRoute.admin ||
          (thisRoute.admin && spaceData.data.role === "admin")
      )
      .map((thisRoute) => ({
        ...thisRoute,
        current: router.asPath.split("/")[2] === thisRoute.href.split("/")[2],
      }));
  }, [currentSpaceSlug, router, spaceData, spaceDataReady]);

  const tabsWithCurrent = useMemo(() => {
    if (!currentSpaceSlug) return [];
    const tabsToRet = tabs.map((thisTab) => {
      let href = thisTab.href;

      href = href.replace("[spaceSlug]", currentSpaceSlug);
      tabsLinkEnricher.forEach((linkEnricher) => {
        href = href.replace(`[${linkEnricher.name}]`, linkEnricher.value);
      });

      return {
        ...thisTab,
        href,
      };
    });
    return tabsToRet.map((thisTab) => ({
      ...thisTab,
      current: router.asPath === thisTab.href,
    }));
  }, [currentSpaceSlug, router, tabs, tabsLinkEnricher]);

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
                    <div className="flex flex-shrink-0 items-center justify-center px-4">
                      <img
                        className="h-10 w-auto"
                        src="/logo-full-white.svg"
                        alt="Genius Social"
                      />
                    </div>
                    <div className="mt-6 px-4">
                      <SpacesSelector
                        currentSpace={spaceData?.data?.name || ""}
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

                  <div className="mt-2 flex w-full flex-shrink-0 border-t border-dark-blue-800 p-4">
                    {!userData.isLoading && !userData.isError ? (
                      <UserTab userData={userData.data} />
                    ) : null}
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
              <div className="flex flex-shrink-0 items-center justify-center px-4">
                <img
                  className="h-10 w-auto"
                  src="/logo-full-white.svg"
                  alt="Genius Social"
                />
              </div>
              <div className="mt-6 px-4">
                <SpacesSelector currentSpace={spaceData?.data?.name || ""} />
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

            <div className="flex w-full flex-shrink-0 border-t border-dark-blue-800 p-4">
              <div className="group block w-full flex-shrink-0">
                {!userData.isLoading && !userData.isError ? (
                  <UserTab userData={userData.data} />
                ) : null}
              </div>
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
                    {tabs.length > 0 ? (
                      <div className="sm:hidden">
                        <label htmlFor="current-tab" className="sr-only">
                          Select a tab
                        </label>
                        <select
                          id="current-tab"
                          name="current-tab"
                          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                          defaultValue={
                            tabsWithCurrent.find((tab) => tab.current)?.href
                          }
                          onChange={(e) => router.push(e.target.value)}
                        >
                          {tabsWithCurrent.map((tab) => (
                            <option key={tab.name} value={tab.href}>
                              {tab.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}
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

function UserTab({ userData }: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const initials = useMemo(() => userData.name[0], [userData]);
  const logoutMutation = useMutation(() => postFetcher("/users/logout", {}), {
    onSuccess: () => {
      queryClient.invalidateQueries("/spaces");
      queryClient.invalidateQueries("/users/me");
      router.push("/login");
    },
  });

  return (
    <Menu as="div" className="relative w-full">
      <div>
        <Menu.Button className="flex w-full items-center justify-between text-gray-200">
          <div className="flex items-center">
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                <span className="font-medium leading-none ">{initials}</span>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{userData.name}</p>
            </div>
          </div>
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 bottom-12 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {userData.mail}
            </p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link href={"/me/settings"}>
                  <a
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Account settings
                  </a>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Support
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => logoutMutation.mutate()}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  {logoutMutation.isLoading ? (
                    <div className="pl-1">
                      <LoadingIndicator />
                    </div>
                  ) : (
                    "Sign out"
                  )}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
