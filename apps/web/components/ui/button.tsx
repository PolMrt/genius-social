import { MouseEventHandler, ReactNode } from "react";
import LoadingIndicator from "./loadingIndicator";

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
      {loading ? <LoadingIndicator /> : children}
    </button>
  );
}
