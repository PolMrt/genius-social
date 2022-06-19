import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";

const withAuth = () => (Component: React.ElementType) => {
  function Authinner() {
    const router = useRouter();

    useEffect(() => {
      if (!localStorage.getItem("token")) {
        return router.push("/login");
      }
    }, [router]);

    return <Component />;
  }
  return Authinner;
};

export default withAuth;
