import { GetServerSidePropsContext } from "next";
import qs from "node:querystring";

const Callback = () => {
  return null;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/?" + qs.stringify(context.query),
      permanent: false,
    },
  };
}

export default Callback;
