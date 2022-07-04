import AddUserToSpace from "@/components/spaces-users/add";
import SpaceUsersList from "@/components/spaces-users/list";
import Button from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";
import { useState } from "react";

function Users({ space }: any) {
  const [showAddUser, setShowAddUser] = useState<boolean>(false);

  return (
    <Sidebar
      title="Space's users"
      currentSpaceSlug={space.slug}
      tabs={[]}
      actions={[<Button onClick={() => setShowAddUser(true)}>Add user</Button>]}
    >
      <AddUserToSpace
        open={showAddUser}
        setOpen={setShowAddUser}
        spaceSlug={space.slug}
      />
      <SpaceUsersList spaceSlug={space.slug} />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData("admin")(Users));
