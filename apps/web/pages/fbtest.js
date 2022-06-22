import FacebookLogin from "react-facebook-login";

export default function fbtest() {
  const onClick = (e) => {
    console.log("CLICKED", e);
  };

  const onCb = (e) => {
    console.log("CB", e);
  };

  return (
    <div>
      <FacebookLogin
        appId="451620940125646"
        autoLoad={true}
        fields="name,email,pages_show_list,instagram_basic"
        onClick={onClick}
        callback={onCb}
      />
    </div>
  );
}
