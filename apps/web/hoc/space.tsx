import React from "react";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const withSpaceData = () => (Component: any) => {
  function Spaceinner() {
    const router = useRouter();
    const { isLoading, isError, data, error } = useQuery(
      `/spaces/${router.query.spaceSlug}`,
      fetcher
    );

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>failed to load</div>;

    return <Component space={data} />;
  }
  return Spaceinner;
};

export default withSpaceData;
