import type { AppProps } from "next/app";
import "../style/tailwind.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
