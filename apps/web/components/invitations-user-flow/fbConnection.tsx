import { FacebookProvider, Login } from "react-facebook";
import Image from "next/image";
import Button from "../ui/button";

import FacebookLogoWhite from "assets/facebook-f-white.png";

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
            <Button
              onClick={handleClick}
              loading={loading}
              className="inline-flex w-full items-center !bg-facebook-light"
            >
              <div className="mr-[0.375rem] h-6 w-6">
                <Image src={FacebookLogoWhite} alt="Facebook Logo" />
              </div>
              Login with Facebook
            </Button>
          )}
        </Login>
      </FacebookProvider>
    </div>
  );
}
