import { MouseEventHandler, ReactNode } from "react";

export enum ButtonStyles {
  primary,
  secondary,
}

type ButtonStylesType = {
  [key in ButtonStyles]: string;
};

type Props = {
  children: ReactNode;
  className?: string;
  style?: ButtonStyles;
  loading?: boolean;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const styles: ButtonStylesType = {
  [ButtonStyles.primary]:
    "border-transparent bg-dark-blue-600 text-white hover:bg-dark-blue-700 focus:ring-dark-blue-500",
  [ButtonStyles.secondary]:
    "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-dark-blue-500",
};

export default function Button({
  children,
  className = "",
  style = ButtonStyles.primary,
  loading = false,
  disabled = false,
  ...otherProps
}: Props) {
  const selectedStyle: string = styles[style];

  return (
    <button
      className={`${className} ${selectedStyle} inline-flex justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
      disabled={loading || disabled}
      {...otherProps}
    >
      {loading ? (
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx={12}
            cy={12}
            r={10}
            stroke="currentColor"
            strokeWidth={4}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
}
