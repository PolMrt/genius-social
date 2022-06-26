import classNames from "classnames";
import { ReactNode, useState } from "react";

type Tab = {
  name: string;
  child: ReactNode;
};

type Props = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: Props) {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-dark-blue-500 focus:ring-dark-blue-500"
          onChange={(e) => setCurrentTab(+e.target.value)}
          value={currentTab}
        >
          {tabs.map((tab, index) => (
            <option key={index} value={index}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              className={classNames(
                index === currentTab
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
              aria-current={index === currentTab ? "page" : undefined}
              onClick={() => setCurrentTab(index)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4">{tabs[currentTab].child}</div>
    </div>
  );
}
