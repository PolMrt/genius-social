import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";

function connectedAccounts({ space }: any) {
  return (
    <Sidebar
      title="Connected account"
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
    >
      yo
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(connectedAccounts));
