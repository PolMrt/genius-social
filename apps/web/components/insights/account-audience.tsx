import fetcher from "@/utils/fetcher";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import BarChart from "../graphs/bar-chart";
import LoadingIndicator from "../ui/loadingIndicator";
import Tabs from "./tabs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Button from "../ui/button";
import { ArrowDownIcon } from "@heroicons/react/outline";
import Card from "../ui/card";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountAudience({ spaceSlug, accountId }: Props) {
  const audience = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-audience`,
    fetcher
  );

  if (audience.isLoading)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  if (audience.isError) return <div>failed to load</div>;

  return (
    <div>
      {audience.data.data.map((thisInsight: any) => (
        <Card
          key={thisInsight.name}
          className="mb-6"
          title={thisInsight.title}
          descritption={thisInsight.description}
        >
          <Insight type={thisInsight.name} values={thisInsight.values} />
        </Card>
      ))}
    </div>
  );
}

function Insight({ type, values }: any) {
  switch (type) {
    case "audience_gender_age":
      return <GenderAge values={values[0].value} />;

    case "audience_country":
      return <AudienceCountries values={values[0].value} />;

    case "audience_locale":
      return <AudienceLocale values={values[0].value} />;

    case "audience_city":
      return <AudienceCity values={values[0].value} />;

    default:
      return (
        <ul className="list-inside list-disc">
          {Object.entries(values[0].value).map(([key, value]) => (
            <li>
              {key} : {value}
            </li>
          ))}
        </ul>
      );
  }
}

function AudienceCity({ values }: any) {
  const allCities = useMemo(() => computeCities(values), [values]);

  return (
    <BarChart
      bars={allCities}
      withShowMore={Object.keys(allCities).length > 5}
    />
  );
}

function computeCities(data: any) {
  const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

  return Object.keys(data).map((key: string) => ({
    name: key,
    value: data[key],
    percentage: (data[key] / tot) * 100,
  }));
}

function AudienceLocale({ values }: any) {
  const allLocales = useMemo(() => computeLocals(values), [values]);

  return <BarChart bars={allLocales} withShowMore={allLocales.length > 5} />;
}

function computeLocals(data: any) {
  const languageName = new Intl.DisplayNames(["en"], { type: "language" });

  const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

  return Object.keys(data).map((key: string) => ({
    name: languageName.of(key.replace("_", "-")) || key,
    value: data[key],
    percentage: (data[key] / tot) * 100,
  }));
}

function AudienceCountries({ values }: any) {
  const allCountries = useMemo(() => computeCountries(values), [values]);

  return (
    <BarChart bars={allCountries} withShowMore={allCountries.length > 5} />
  );
}

function computeCountries(data: any) {
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

  return Object.keys(data).map((key: string) => ({
    name: getFlagEmoji(key) + " " + regionNames.of(key),
    value: data[key],
    percentage: (data[key] / tot) * 100,
  }));
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function GenderAge({ values }: any) {
  const genderRepartitions = useMemo(
    () => computeAgeRepartition(values),
    [values]
  );

  const menAgeRange = useMemo(() => computeAgeRange("M", values), [values]);
  const femaleAgeRange = useMemo(() => computeAgeRange("F", values), [values]);

  return (
    <Tabs
      tabs={[
        {
          name: "Gender",
          child: (
            <div className="flex items-center justify-center">
              <div className="flex-col items-center">
                <div className="text-lg font-bold">
                  {Math.round(genderRepartitions.M.percentage * 10) / 10}%
                </div>
                <div className="inline-flex items-center text-sm text-gray-600">
                  Men
                  <span className="ml-1 inline-block h-1 w-1 rounded-full bg-dark-blue-500" />
                </div>
              </div>
              <div className="w-96 px-8">
                <Doughnut
                  data={{
                    labels: ["Women", "Men"],
                    datasets: [
                      {
                        label: "Gender repartitions",
                        data: [
                          genderRepartitions.F.nb,
                          genderRepartitions.M.nb,
                        ],
                        backgroundColor: ["#134B6B", "#3BA2DC"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    animation: {
                      duration: 0,
                    },
                  }}
                />
              </div>
              <div className="flex-col items-center">
                <div className="text-lg font-bold">
                  {Math.round(genderRepartitions.F.percentage * 10) / 10}%
                </div>
                <div className="inline-flex items-center text-sm text-gray-600">
                  <span className="mr-1 inline-block h-1 w-1 rounded-full bg-dark-blue-800" />
                  Women
                </div>
              </div>
            </div>
          ),
        },
        {
          name: "Men age range",
          child: <BarChart bars={menAgeRange} />,
        },
        {
          name: "Female age range",
          child: <BarChart bars={femaleAgeRange} />,
        },
      ]}
    />
  );
}

function computeAgeRange(sexe: "M" | "F" | "U", data: any) {
  const filtered = Object.keys(data).filter((key) => key.startsWith(sexe));
  const tot = filtered.reduce((prev, key) => prev + data[key], 0);

  return filtered.map((key: string) => ({
    name: key.replace(sexe + ".", ""),
    value: data[key],
    percentage: (data[key] / tot) * 100,
  }));
}

function computeAgeRepartition(data: any) {
  let result = {
    M: { nb: 0, percentage: 0 },
    F: { nb: 0, percentage: 0 },
  };
  let tot = 0;
  Object.entries(data).forEach(([key, value]: any) => {
    if (key[0] === "M") {
      result.M.nb += value;
      tot += value;
    } else if (key[0] === "F") {
      result.F.nb += value;
      tot += value;
    }
  });

  Object.keys(result).forEach((key: string) => {
    if (key === "M" || key === "F") {
      result[key].percentage = (result[key].nb / tot) * 100;
    }
  });

  return result;
}
