import { useRouter } from "next/router";
import Spaces from "../components/spaces/spaces";
import Layout from "../components/ui/layout";
import isAuth from "../hoc/auth";

function Web() {
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Layout>
      <h1 className="font-sans2 text-4xl font-black">Genius Social</h1>
      <button onClick={onLogout}>Logout</button>
      <div className="mt-6">
        <Spaces />
      </div>
    </Layout>
  );
}

export default isAuth()(Web);
