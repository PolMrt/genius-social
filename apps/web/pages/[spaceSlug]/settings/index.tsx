import Button from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";
import { useState } from "react";

function Users({ space }: any) {
  return (
    <Sidebar
      title="Space settings"
      currentSpaceSlug={space.slug}
      tabs={[]}
      actions={[]}
    >
      Space settings
    </Sidebar>
  );
}

export default withAuth()(withSpaceData("admin")(Users));
