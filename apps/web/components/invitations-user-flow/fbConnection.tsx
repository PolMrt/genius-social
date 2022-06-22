import FacebookLogin from "react-facebook-login";

type Props = {
  token: string;
  setToken: Function;
};

export default function FbConnection({ token, setToken }: Props) {
  const onFacebookLogin = (e) => {
    if (e.accessToken) {
      setToken(e.accessToken);
    } else {
      alert("An error occured");
    }
  };

  return (
    <div>
      <FacebookLogin
        appId={process.env.NEXT_PUBLIC_FB_APP_ID}
        version={process.env.NEXT_PUBLIC_FB_V}
        autoLoad={false}
        fields="name,email,pages_show_list,instagram_basic,instagram_manage_insights"
        callback={onFacebookLogin}
        cssClass="w-full border-transparent bg-dark-blue-600 text-white hover:bg-dark-blue-700 focus:ring-dark-blue-500 inline-flex justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      />
    </div>
  );
}
