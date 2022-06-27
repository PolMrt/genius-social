import { FacebookProvider, Login } from "react-facebook";
import Button from "../ui/button";

type Props = {
  token: string;
  setToken: Function;
};

export default function FbConnection({ token, setToken }: Props) {
  const onFacebookLogin = (e: any) => {
    if (e?.tokenDetail?.accessToken) {
      setToken(e.tokenDetail.accessToken);
    } else {
      alert("An error occured");
    }
  };

  const onError = (e: any) => {
    alert("An error occured");
  };

  return (
    <div>
      <FacebookProvider appId={process.env.NEXT_PUBLIC_FB_APP_ID}>
        <Login
          scope="email,pages_show_list,instagram_basic,instagram_manage_insights"
          onCompleted={onFacebookLogin}
          onError={onError}
        >
          {({ loading, handleClick, error, data }: any) => (
            <Button onClick={handleClick} loading={loading} className="w-full">
              Login via Facebook
            </Button>
          )}
        </Login>
      </FacebookProvider>
    </div>
  );
}
