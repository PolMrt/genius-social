import React from "react";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

type Role = "admin" | "user";

function isAuthorized(requiredRole: Role, userRole: Role): boolean {
  if (requiredRole === "admin") return userRole === "admin";
  return true;
}

const withSpaceData =
  (role: Role = "user") =>
  (Component: any) => {
    function Spaceinner() {
      const router = useRouter();
      const { isLoading, isError, data, error } = useQuery(
        `/spaces/${router.query.spaceSlug}`,
        fetcher
      );

      if (isLoading) return <div>loading...</div>;
      if (isError) return <div>failed to load</div>;

      if (!isAuthorized(role, data.role)) {
        return <div>not authorized</div>;
      }

      return <Component space={data} />;
    }
    return Spaceinner;
  };

export default withSpaceData;
