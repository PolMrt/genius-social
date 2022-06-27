import { ArrowDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useMemo, useState } from "react";
import Button from "../ui/button";

type Bar = {
  name: string;
  value: number;
  percentage: number;
};

type Props = {
  bars: Bar[];
  withShowMore?: boolean;
  ordered?: boolean;
};

export default function BarChart({
  bars,
  withShowMore = false,
  ordered = true,
}: Props) {
  const [showMore, setShowMore] = useState(false);

  const data = useMemo(() => {
    let sorted = ordered ? bars.sort((a, b) => b.value - a.value) : bars;
    if (withShowMore && !showMore) {
      return sorted.filter((el, index) => index < 5);
    } else {
      return sorted;
    }
  }, [bars, withShowMore, showMore, ordered]);

  return (
    <div className="relative">
      <ul className="space-y-1">
        {data.map((thisBar: Bar) => (
          <li key={thisBar.name}>
            <div className="font-medium">{thisBar.name}</div>
            <div className="relative mt-1 h-2 w-full overflow-hidden bg-gray-300">
              <div
                className="absolute left-0 h-2 rounded-r-full bg-dark-blue"
                style={{ width: thisBar.percentage + "%" }}
              ></div>
            </div>
            <div className="mt-1 text-right text-sm text-gray-500">
              {thisBar.value} |{" "}
              {(Math.round(thisBar.percentage * 10) / 10).toFixed(1)}%
            </div>
          </li>
        ))}
      </ul>

      {withShowMore ? (
        <div
          className={classNames("bottom-0 flex h-auto justify-center", {
            "sticky bg-gradient-to-t from-white to-white/25 py-2": showMore,
          })}
        >
          <Button
            onClick={() => setShowMore((prev) => !prev)}
            className={classNames("inline-flex items-center", {
              // "shadow-xxl": showMore,
            })}
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
