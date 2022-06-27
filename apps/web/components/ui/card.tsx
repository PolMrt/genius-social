import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string | null;
  descritption?: string | null;
  className?: string;
};

export default function Card({
  children,
  title = null,
  descritption = null,
  className = "",
}: Props) {
  return (
    <div className={classNames(className, "rounded-lg bg-white shadow")}>
      {title || descritption ? (
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{descritption}</p>
        </div>
      ) : null}
      <div
        className={classNames("border-gray-200 px-4 py-5 sm:px-6", {
          "border-t": title || descritption,
        })}
      >
        {children}
      </div>
    </div>
  );
}
