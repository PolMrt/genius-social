import { useState } from "react";
import { Button } from "ui";
import Spaces from "../components/spaces";

export default function Web() {
  const [token, setToken] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
      body: JSON.stringify({ mail: email, password }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.access_token) {
          setToken(res.access_token);
        } else if (res.message) {
          alert(res.message);
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h1>Genius Social App</h1>
      {token ? (
        <button onClick={() => setToken("")}>Log out</button>
      ) : (
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
          <button type="submit">Login</button>
        </form>
      )}

      {token ? <Spaces token={token} /> : null}

      <h2>Token</h2>
      {token ? (
        <details>
          <summary>Show token</summary>
          {token}
        </details>
      ) : null}
    </div>
  );
}
