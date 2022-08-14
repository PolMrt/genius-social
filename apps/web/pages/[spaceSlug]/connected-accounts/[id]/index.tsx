import AccountInfos from "@/components/insights/account-informations";
import AccountAudience from "@/components/insights/account-audience";
import Button from "@/components/ui/button";
import Sidebar from "@/components/ui/sidebar/sidebar";
import fetcher from "@/utils/fetcher";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const tabs = [
  {
    name: "Audience",
    href: `/[spaceSlug]/connected-accounts/[id]`,
  },
  {
    name: "Insights",
    href: `/[spaceSlug]/connected-accounts/[id]/insights`,
  },
  {
    name: "Posts",
    href: `/[spaceSlug]/connected-accounts/[id]/posts`,
  },
];

function AudienceAccountPage({ space }: any) {
  const router = useRouter();
  const accountDetails = useQuery(
    `/space/${space.slug}/connected-accounts/${router.query.id}`,
    fetcher
  );

  if (accountDetails.isLoading)
    return (
      <Sidebar
        currentSpace={space.name}
        currentSpaceSlug={space.slug}
        tabs={tabs}
        title="Loading"
      >
        {" "}
      </Sidebar>
    );
  if (accountDetails.isError) return <div>failed to load</div>;

  return (
    <Sidebar
      currentSpace={space.name}
      currentSpaceSlug={space.slug}
      tabs={tabs}
      title={accountDetails.data.name}
      tabsLinkEnricher={[{ name: "id", value: "" + router.query.id }]}
      actions={[
        <Button
          key={1}
          onClick={() =>
            window.open(
              "https://instagram.com/" + accountDetails.data.identifier,
              "_blank"
            )
          }
        >
          Instagram <ExternalLinkIcon className="ml-2 h-5 w-5" />
        </Button>,
      ]}
    >
      <AccountInfos spaceSlug={space.slug} accountId={accountDetails.data.id} />
      <AccountAudience
        spaceSlug={space.slug}
        accountId={accountDetails.data.id}
      />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(AudienceAccountPage));
