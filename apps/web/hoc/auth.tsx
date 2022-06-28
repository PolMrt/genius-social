import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";

const withAuth = () => (Component: any) => {
  function AuthInner() {
    const router = useRouter();

    const userQuery = useQuery("/users/me", fetcher, {
      onError: (err) => {
        return router.push("/login");
      },
      retry: false,
    });

    return userQuery.isLoading ? <>loading</> : <Component />;
  }
  return AuthInner;
};

export default withAuth;
