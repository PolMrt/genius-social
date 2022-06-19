import Sidebar from "@/components/ui/sidebar/sidebar";
import withSpaceData from "hoc/space";
import withAuth from "../../hoc/auth";

function Sapcehomepage({ space }: any) {
  return (
    <Sidebar
      title={space.name}
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
    >
      <h1>g</h1>
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(Sapcehomepage));
