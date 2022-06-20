import Layout from "@/components/ui/layout";
import { GetServerSideProps } from "next";

export default function invitationPage({ invitation }: any) {
  return (
    <Layout>
      <h1>{invitation.space.name} want to get access to your stats</h1>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, iure
        dicta quae obcaecati perspiciatis sapiente aliquam labore sed quisquam
        cupiditate eligendi nemo delectus nihil cum. Necessitatibus et numquam
        excepturi soluta!
      </p>
      <button>Give access</button>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawData = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/space/${context.query.spaceSlug}/connected-accounts/invitations/${context.query.invitationId}`
  );
  if (!rawData.ok) {
    throw new Error();
  }
  const data = await rawData.json();

  return {
    props: {
      invitation: data,
    },
  };
};
