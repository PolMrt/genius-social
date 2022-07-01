import fetcher from "@/utils/fetcher";
import { useQuery } from "react-query";
import Card from "../ui/card";
import LoadingIndicator from "../ui/loadingIndicator";
import { defaults } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import Button from "../ui/button";
import { useEffect, useState } from "react";
import DateSelector from "./date-selector";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

defaults.font.family =
  'Inter var, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
defaults.color = "#6B7280";
defaults.borderColor = "#E5E7EB";

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountInsights({ spaceSlug, accountId }: Props) {
  const [from, setFrom] = useState<string>("");
  const [until, setUntil] = useState<string>("");

  useEffect(() => {
    const now = dayjs();
    setFrom(now.subtract(28, "day").toISOString());
    setUntil(now.toISOString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <DateSelector
          from={from}
          until={until}
          setFrom={setFrom}
          setUntil={setUntil}
        />
      </Card>
      <Insights
        spaceSlug={spaceSlug}
        accountId={accountId}
        from={from}
        until={until}
      />
    </div>
  );
}

function Insights({ spaceSlug, accountId, from, until }: any) {
  const insights = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-insights?from=${from}&until=${until}`,
    fetcher,
    { enabled: !!from && !!until }
  );

  if (insights.isLoading || insights.isIdle)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  if (insights.isError) return <div>failed to load</div>;

  return insights.data.data.map((thisInsight: any) => (
    <Card
      key={thisInsight.name}
      title={thisInsight.title}
      descritption={thisInsight.description}
    >
      <Bar
        height={100}
        options={{
          elements: {
            line: {
              cubicInterpolationMode: "monotone",
            },
            point: {
              radius: 0,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: { intersect: false },
          },
          scales: {
            yAxis:
              thisInsight.name !== "follower_count"
                ? {
                    min: 0,
                  }
                : {},
          },
        }}
        data={{
          labels: thisInsight.values
            // .filter((el: any) =>
            //   dayjs(el.end_time).add(lastXDays, "days").isAfter(dayjs())
            // )
            .map((thisInsight: any) =>
              dayjs(thisInsight.end_time).format("MMM D")
            ),
          datasets: [
            {
              label: thisInsight.title,
              data: thisInsight.values
                // .filter((el: any) =>
                //   dayjs(el.end_time).add(lastXDays, "days").isAfter(dayjs())
                // )
                .map((thisInsight: any) => thisInsight.value),
              borderColor: "#3BA2DC",
              backgroundColor: "#3BA2DC",
            },
          ],
        }}
      />
    </Card>
  ));
}
