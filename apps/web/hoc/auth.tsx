import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";

const withAuth = () => (Component: React.ElementType) => {
  function Authinner() {
    const router = useRouter();
    const [checkedToken, setCheckedToken] = useState(false);
    const userQuery = useQuery(`/users/me`, fetcher, {
      enabled: checkedToken,
      onError: (err) => {
        localStorage.removeItem("token");
        return router.push("/login");
      },
    });

    useEffect(() => {
      if (!localStorage.getItem("token")) {
        return router.push("/login");
      } else {
        setCheckedToken(true);
      }
    }, [router]);

    return userQuery.isLoading ? "loading" : <Component />;
  }
  return Authinner;
};

export default withAuth;
