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

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  spaceSlug: string;
  accountId: string;
};

export default function AccountInsights({ spaceSlug, accountId }: Props) {
  const accountInfos = useQuery(
    `/space/${spaceSlug}/connected-accounts/${accountId}/account-informations`,
    fetcher
  );

  if (accountInfos.isLoading)
    return (
      <div className="flex items-center justify-center text-gray-700">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    );
  if (accountInfos.isError) return <div>failed to load</div>;

  return (
    <div>
      {accountInfos.data.insights.data.map((thisInsight: any) => (
        <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {thisInsight.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {thisInsight.description}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <Insight type={thisInsight.name} values={thisInsight.values} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Insight({ type, values }: any) {
  switch (type) {
    // case "audience_gender_age":
    //   return <GenderAge values={values[0].value} />;

    // case "audience_country":
    //   return <AudienceCountries values={values[0].value} />;

    // case "audience_locale":
    //   return <AudienceLocale values={values[0].value} />;

    // case "audience_city":
    //   return <AudienceCity values={values[0].value} />;

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

// function AudienceCity({ values }: any) {
//   const allCities = useMemo(() => computeCities(values), [values]);

//   return (
//     <BarChart bars={[]} withShowMore={Object.keys(allCities).length > 5} />
//   );
// }

// function computeCities(data: any) {
//   const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

//   const ordered = Object.fromEntries(
//     Object.entries(data).sort((a: any[], b: any[]) => b[1] - a[1])
//   );

//   return Object.keys(ordered).reduce((cur, key) => {
//     return Object.assign(cur, {
//       [key]: {
//         nb: data[key],
//         percentage: (data[key] / tot) * 100,
//       },
//     });
//   }, {});
// }

// function AudienceLocale({ values }: any) {
//   const allLocales = useMemo(() => computeLocals(values), [values]);

//   return (
//     <div>
//       <BarChart bars={[]} withShowMore={Object.keys(allLocales).length > 5} />
//     </div>
//   );
// }

// function computeLocals(data: any) {
//   const languageName = new Intl.DisplayNames(["en"], { type: "language" });

//   const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

//   const ordered = Object.fromEntries(
//     Object.entries(data).sort((a: any[], b: any[]) => b[1] - a[1])
//   );

//   return Object.keys(ordered).reduce((cur: any, key: string) => {
//     return Object.assign(cur, {
//       [languageName.of(key.replace("_", "-"))]: {
//         nb: data[key],
//         percentage: (data[key] / tot) * 100,
//       },
//     });
//   }, {});
// }

// function AudienceCountries({ values }: any) {
//   const allCountries = useMemo(() => computeCountries(values), [values]);

//   return (
//     <BarChart bars={[]} withShowMore={Object.keys(allCountries).length > 5} />
//   );
// }

// function computeCountries(data: any) {
//   const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

//   const tot = Object.keys(data).reduce((prev, key) => prev + data[key], 0);

//   const ordered = Object.fromEntries(
//     Object.entries(data).sort((a: any[], b: any[]) => b[1] - a[1])
//   );

//   return Object.keys(ordered).reduce((cur, key) => {
//     return Object.assign(cur, {
//       [getFlagEmoji(key) + " " + regionNames.of(key)]: {
//         nb: data[key],
//         percentage: (data[key] / tot) * 100,
//       },
//     });
//   }, {});
// }

// function getFlagEmoji(countryCode: string) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt(0));
//   return String.fromCodePoint(...codePoints);
// }

// function GenderAge({ values }: any) {
//   const genderRepartitions = useMemo(
//     () => computeAgeRepartition(values),
//     [values]
//   );

//   const menAgeRange = useMemo(() => computeAgeRange("M", values), [values]);
//   const femaleAgeRange = useMemo(() => computeAgeRange("F", values), [values]);

//   return (
//     <Tabs
//       tabs={[
//         {
//           name: "Gender",
//           child: (
//             <div className="flex items-center justify-center">
//               <div className="flex-col items-center">
//                 <div className="text-lg font-bold">
//                   {Math.round(genderRepartitions.M.percentage * 10) / 10}%
//                 </div>
//                 <div className="inline-flex items-center text-sm text-gray-600">
//                   Men
//                   <span className="ml-1 inline-block h-1 w-1 rounded-full bg-dark-blue-500" />
//                 </div>
//               </div>
//               <div className="w-96 px-8">
//                 <Doughnut
//                   data={{
//                     labels: ["Women", "Men"],
//                     datasets: [
//                       {
//                         label: "Gender repartitions",
//                         data: [
//                           genderRepartitions.F.nb,
//                           genderRepartitions.M.nb,
//                         ],
//                         backgroundColor: ["#134B6B", "#3BA2DC"],
//                         borderWidth: 0,
//                       },
//                     ],
//                   }}
//                   options={{
//                     plugins: {
//                       legend: {
//                         display: false,
//                       },
//                     },
//                     animation: {
//                       duration: 0,
//                     },
//                   }}
//                 />
//               </div>
//               <div className="flex-col items-center">
//                 <div className="text-lg font-bold">
//                   {Math.round(genderRepartitions.F.percentage * 10) / 10}%
//                 </div>
//                 <div className="inline-flex items-center text-sm text-gray-600">
//                   <span className="mr-1 inline-block h-1 w-1 rounded-full bg-dark-blue-800" />
//                   Women
//                 </div>
//               </div>
//             </div>
//           ),
//         },
//         {
//           name: "Men age range",
//           child: <BarChart bars={[]} />,
//         },
//         {
//           name: "Female age range",
//           child: <BarChart bars={[]} />,
//         },
//       ]}
//     />
//   );
// }

// function computeAgeRange(sexe: "M" | "F" | "U", data: any) {
//   const filtered = Object.keys(data).filter((key) => key.startsWith(sexe));
//   const tot = filtered.reduce((prev, key) => prev + data[key], 0);

//   return filtered.reduce((cur, key) => {
//     return Object.assign(cur, {
//       [key.replace(sexe + ".", "")]: {
//         nb: data[key],
//         percentage: (data[key] / tot) * 100,
//       },
//     });
//   }, {});
// }

// function computeAgeRepartition(data: any) {
//   let result = {
//     M: { nb: 0, percentage: 0 },
//     F: { nb: 0, percentage: 0 },
//   };
//   let tot = 0;
//   Object.entries(data).forEach(([key, value]: any) => {
//     if (key[0] === "M") {
//       result.M.nb += value;
//       tot += value;
//     } else if (key[0] === "F") {
//       result.F.nb += value;
//       tot += value;
//     }
//   });

//   Object.keys(result).forEach((key) => {
//     result[key].percentage = (result[key].nb / tot) * 100;
//   });

//   return result;
// }
