import { ArrowDownIcon } from "@heroicons/react/outline";
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
};

export default function BarChart({ bars, withShowMore = false }: Props) {
  const [showMore, setShowMore] = useState(false);
  const data = useMemo(() => {
    if (withShowMore && !showMore) {
      return bars.filter((el, index) => index < 5);
    } else {
      return bars;
    }
  }, [bars, withShowMore, showMore]);

  return (
    <div>
      <ul className="space-y-1">
        {bars.map((thisBar: Bar) => (
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
