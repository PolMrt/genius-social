import { Button } from "ui";

export default function Web() {
  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
      body: JSON.stringify({ mail: email, password }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h1>Genius Social App</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
