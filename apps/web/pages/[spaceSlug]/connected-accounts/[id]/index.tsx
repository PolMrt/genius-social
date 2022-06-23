import AccountInfos from "@/components/insights/account-informations";
import Sidebar from "@/components/ui/sidebar/sidebar";
import fetcher from "@/utils/fetcher";
import withAuth from "hoc/auth";
import withSpaceData from "hoc/space";
import { useRouter } from "next/router";
import SpaceSlug from "pages/[spaceSlug]";
import { useQuery } from "react-query";

export const tabs = [
  {
    name: "Account informations",
    href: `/[spaceSlug]/connected-accounts/[id]`,
  },
  {
    name: "Account insights",
    href: `/[spaceSlug]/connected-accounts/[id]/account-insight`,
  },
  {
    name: "Posts insights",
    href: `/[spaceSlug]/connected-accounts/[id]/posts-insight`,
  },
];

function InsightAccountPage({ space }: any) {
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
      tabsLinkEnricher={[{ name: "id", value: router.query.id }]}
    >
      <AccountInfos
        spaceSlug={space.slug}
        accountId={accountDetails.data.id}
        plateformId={accountDetails.data.plateformId}
      />
    </Sidebar>
  );
}

export default withAuth()(withSpaceData()(InsightAccountPage));
