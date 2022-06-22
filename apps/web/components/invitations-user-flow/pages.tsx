import { fbFetcher } from "@/utils/fetcher";
import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { useState } from "react";
import { useQuery } from "react-query";
import Button from "../ui/button";

type Props = {
  accessToken: string;
  selectedPageId: string;
  setSelectedPageId: (value: string) => void;
};

export default function Pages({
  accessToken,
  selectedPageId,
  setSelectedPageId,
}: Props) {
  const [preSelectedPage, setPreSelectedPage] = useState(null);
  const getPages = useQuery(["/me/accounts", accessToken], fbFetcher, {
    onSuccess: (data) => {
      if (!preSelectedPage) {
        setPreSelectedPage(data.data.data[0].id);
      }
    },
  });

  if (getPages.isLoading) {
    return <span>Loading...</span>;
  }

  if (getPages.isError) {
    return <span>Error</span>;
  }
  return (
    <div>
      {/* <ul>
        {getPages.data.data.data.map((thisPage) => (
          <li key={thisPage.id}>{thisPage.name}</li>
        ))}
      </ul> */}
      <RadioGroup value={preSelectedPage} onChange={setPreSelectedPage}>
        <RadioGroup.Label className="sr-only">
          Select your Facebook page
        </RadioGroup.Label>
        <div className="space-y-4">
          {getPages.data.data.data.map((thisPage) => (
            <RadioGroup.Option
              key={thisPage.id}
              value={thisPage.id}
              className={({ checked, active }) =>
                classNames(
                  checked ? "border-transparent" : "border-gray-300",
                  active
                    ? "border-dark-blue-500 ring-2 ring-dark-blue-500"
                    : "",
                  "relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between"
                )
              }
            >
              {({ active, checked }) => (
                <>
                  <span className="flex items-center">
                    <span className="flex flex-col text-sm">
                      <RadioGroup.Label
                        as="span"
                        className="font-medium text-gray-900"
                      >
                        {thisPage.name}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className="text-gray-500"
                      >
                        <span className="block sm:inline">
                          {thisPage.category}
                        </span>{" "}
                        {/* <span className="hidden sm:inline sm:mx-1" aria-hidden="true">
                        &middot;
                      </span>{' '}
                      <span className="block sm:inline">{plan.disk}</span> */}
                      </RadioGroup.Description>
                    </span>
                  </span>
                  <span
                    className={classNames(
                      active ? "border" : "border-2",
                      checked ? "border-dark-blue-500" : "border-transparent",
                      "pointer-events-none absolute -inset-px rounded-lg"
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() =>
            preSelectedPage
              ? setSelectedPageId(preSelectedPage)
              : alert("Please select a page")
          }
        >
          Select
        </Button>
      </div>
    </div>
  );
}
