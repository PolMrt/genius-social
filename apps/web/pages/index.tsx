import { useRouter } from "next/router";
import Sidebar from "../components/ui/sidebar/sidebar";
import withAuth from "../hoc/auth";

function Web() {
  const router = useRouter();

  const onLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar title="Dashboard">
      <button onClick={onLogout}>Logout</button>
    </Sidebar>
  );
}

export default withAuth()(Web);
