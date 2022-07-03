import SpaceUsersList from "@/components/spaces-users/list";
import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";

function Users({ space }: any) {
  return (
    <Sidebar title="Space's users" currentSpaceSlug={space.slug} tabs={[]}>
      <SpaceUsersList spaceSlug={space.slug} />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData("admin")(Users));
