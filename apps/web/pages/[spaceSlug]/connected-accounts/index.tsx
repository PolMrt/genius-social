import ConnectedAccountsList from "@/components/connected-accounts/list";
import Sidebar from "@/components/ui/sidebar/sidebar";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";

export const tabs = [
  { name: "Connected accounts", href: `/[spaceSlug]/connected-accounts` },
  { name: "Invitations", href: "/[spaceSlug]/connected-accounts/invitations" },
];

function connectedAccounts({ space }: any) {
  return (
    <Sidebar
      title="Connected account"
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
      tabs={tabs}
    >
      <ConnectedAccountsList spaceSlug={space.slug} />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(connectedAccounts));
