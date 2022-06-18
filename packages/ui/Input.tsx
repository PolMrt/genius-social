import * as React from "react";

type Props = {
  name: string;
  id: string;
  type: string;
};

export const Input = ({ name, id, type = "text" }: Props) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-dark-blue-500 focus:ring-dark-blue-500 sm:text-sm"
    />
  );
};
