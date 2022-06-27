import fetcher from "@/utils/fetcher";
import { useQuery } from "react-query";
import Card from "../ui/card";
import LoadingIndicator from "../ui/loadingIndicator";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountInsights({ spaceSlug, accountId }: Props) {
  const insights = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-insights`,
    fetcher
  );

  if (insights.isLoading)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  if (insights.isError) return <div>failed to load</div>;

  return (
    <div>
      {insights.data.data.map((thisInsight: any) => (
        <Card
          key={thisInsight.name}
          className="mb-6"
          title={thisInsight.title}
          descritption={thisInsight.description}
        >
          <Line
            options={{
              plugins: { legend: { display: false } },
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
              labels: thisInsight.values.map((thisInsight: any) =>
                dayjs(thisInsight.end_time).format("DD/MM/YYYY")
              ),
              datasets: [
                {
                  label: thisInsight.name,
                  data: thisInsight.values.map(
                    (thisInsight: any) => thisInsight.value
                  ),
                  borderColor: "#3BA2DC",
                  backgroundColor: "#3BA2DC",
                },
              ],
            }}
          />
        </Card>
      ))}
    </div>
  );
}
