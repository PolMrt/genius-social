import dayjs from "dayjs";
import { FormEvent } from "react";
import Button, { ButtonStyles } from "../ui/button";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(minMax);

type Props = {
  from: string;
  until: string;
  setFrom: Function;
  setUntil: Function;
};

export default function DateSelector({
  from,
  until,
  setFrom,
  setUntil,
}: Props) {
  const onSelectDates = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      from: HTMLInputElement;
      until: HTMLInputElement;
    };
    const fromValue = getFromWithTime(dayjs(formElements.from.value));
    const untilValue = getUntilWithTime(dayjs(formElements.until.value));

    setFrom(fromValue.toISOString());
    setUntil(untilValue.toISOString());
  };

  return (
    <div>
      <form onSubmit={onSelectDates}>
        <div className="flex space-x-2">
          <div className="w-full">
            <label
              htmlFor="from"
              className="block text-sm font-medium text-gray-700"
            >
              From
            </label>
            <div className="mt-1">
              <input
                required
                type="date"
                name="from"
                id="from"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
                defaultValue={from.substring(0, 10)}
              />
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="until"
              className="block text-sm font-medium text-gray-700"
            >
              Until
            </label>
            <div className="mt-1">
              <input
                required
                type="date"
                name="until"
                id="until"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
                defaultValue={until.substring(0, 10)}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button type="submit">Set</Button>
        </div>
      </form>
      <div className="mt-4">
        <div className="block text-sm font-medium text-gray-700">Shortcut</div>
        <div className="mt-1 flex">
          {[7, 14, 28].map((thisDiff) => (
            <Button
              key={thisDiff}
              style={ButtonStyles.secondary}
              onClick={() => {
                setFrom(
                  getFromWithTime(
                    dayjs().subtract(thisDiff - 2, "days")
                  ).toISOString()
                );
                setUntil(getUntilWithTime(dayjs()).toISOString());
              }}
              className="mr-2 mb-2"
            >
              Last {thisDiff} days
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getFromWithTime(from: dayjs.Dayjs): dayjs.Dayjs {
  return from.set("hour", 1).set("minute", 1);
}

function getUntilWithTime(from: dayjs.Dayjs): dayjs.Dayjs {
  return dayjs.min(from.set("hour", 23).set("minute", 59), dayjs());
}
