import { SWRConfig } from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/sketchy/bootstrap.min.css";
import Layout from "./components/Layout";
import RouteGuard from "./components/RouteGuard";



const fetcher = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }
  return response.json();
};



export default function App({ Component, pageProps }) {
  return (
    <>
    <RouteGuard>
      <SWRConfig value={{ fetcher }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SWRConfig>
      </RouteGuard>
    </>
  );
}