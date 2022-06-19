import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";
import useSWR from "swr";

const withSpaceData = () => (Component: React.ElementType) => {
  function Spaceinner() {
    const router = useRouter();

    const { data: space, error } = useSWR(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces/${router.query.spaceSlug}`,
      fetcher
    );

    if (error) return <div>failed to load</div>;
    if (!space) return <div>loading...</div>;

    return <Component space={space} />;
  }
  return Spaceinner;
};

export default withSpaceData;
