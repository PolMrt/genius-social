import { ApiFormatedError } from "@/utils/fetcher";
import classNames from "classnames";

type Props = {
  className?: string;
  error: ApiFormatedError;
};

export default function ApiError({ className = "", error }: Props) {
  return (
    <div
      className={classNames(
        className,
        "rounded-lg border border-red-600 bg-red-50 px-6 py-4 text-red-800"
      )}
    >
      <div className="font-bold">An error occured</div>
      <ul className="mt-2 list-inside list-disc text-sm">
        {error.messages.map((thisMessage) => (
          <li key={thisMessage}>{thisMessage}</li>
        ))}
      </ul>
    </div>
  );
}
