import Sidebar from "@/components/ui/sidebar/sidebar";
import withSpaceData from "hoc/space";
import { useRouter } from "next/router";
import { useEffect } from "react";
import withAuth from "../../hoc/auth";

function Sapcehomepage({ space }: any) {
  const router = useRouter();
  useEffect(() => {
    router.push(`/${space.slug}/connected-accounts`);
  }, []);

  return (
    <Sidebar
      title={space.name}
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
    >
      <div></div>
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(Sapcehomepage));
