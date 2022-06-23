import { useState } from "react";
import CreateInvitation from "@/components/invitations/create";
import AllConnectedAccounts from "@/components/invitations/list";
import Button from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";

import { tabs } from "./index";

function connectedAccountsInvitations({ space }: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [newInvitationOpen, setNewInvitationOpen] = useState(false);

  return (
    <Sidebar
      title="Connected account"
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
      tabs={tabs}
      actions={[
        <Button onClick={() => setNewInvitationOpen(true)}>
          New invitation
        </Button>,
      ]}
    >
      <CreateInvitation
        open={newInvitationOpen}
        setOpen={setNewInvitationOpen}
        spaceSlug={space.slug}
      />
      <AllConnectedAccounts spaceSlug={space.slug} />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(connectedAccountsInvitations));
