import { ArrowDownIcon } from "@heroicons/react/outline";
import { useMemo, useState } from "react";
import Button from "../ui/button";

export default function BarChart({ value, withShowMore = false }: any) {
  const [showMore, setShowMore] = useState(false);
  const data = useMemo(() => {
    if (withShowMore && !showMore) {
      return Object.fromEntries(
        Object.entries(value).filter((el, index) => index < 5)
      );
    } else {
      return value;
    }
  }, [value, withShowMore, showMore]);

  return (
    <div>
      <ul className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <li>
            <div className="font-medium">{key}</div>
            <div className="relative mt-1 h-2 w-full overflow-hidden bg-gray-300">
              <div
                className="absolute left-0 h-2 rounded-r-full bg-dark-blue"
                style={{ width: value.percentage + "%" }}
              ></div>
            </div>
            <div className="mt-1 text-right text-sm text-gray-500">
              {value.nb} | {(Math.round(value.percentage * 10) / 10).toFixed(1)}
              %
            </div>
          </li>
        ))}
      </ul>

      {withShowMore ? (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowMore((prev) => !prev)}
            className="inline-flex items-center"
          >
            {showMore ? (
              <>
                Show less <ArrowDownIcon className="ml-2 h-4 w-4 rotate-180" />
              </>
            ) : (
              <>
                Show more <ArrowDownIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
