import { useRouter } from "next/router";
import useSWR from "swr";
import Layout from "../../components/ui/layout";
import isAuth from "../../hoc/auth";
import fetcher from "../../utils/fetcher";

function Sapcehomepage() {
  const router = useRouter();

  const { data: space, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/spaces/${router.query.spaceSlug}`,
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (!space) return <div>loading...</div>;

  return (
    <Layout>
      <h1>{space.name}</h1>
    </Layout>
  );
}

export default isAuth()(Sapcehomepage);
