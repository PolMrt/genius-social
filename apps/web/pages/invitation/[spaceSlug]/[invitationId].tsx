import Button from "@/components/ui/button";
import Layout from "@/components/ui/layout";
import { GetServerSideProps } from "next";

export default function invitationPage({ invitation }: any) {
  return (
    <main className="pt-6">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-sans2 text-2xl font-extrabold">
          {invitation.space.name}
        </h1>
        <div className="mt-6 rounded-lg bg-white px-6 py-6 shadow">
          <h2 className="text-xl font-medium">
            @{invitation.identifier} access request
          </h2>
          <p className="mt-4">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
            iure dicta quae obcaecati perspiciatis sapiente aliquam labore sed
            quisquam cupiditate eligendi nemo delectus nihil cum. Necessitatibus
            et numquam excepturi soluta!
          </p>
          <h2 className="mt-8 text-xl font-medium">
            {invitation.space.name} will be able to
          </h2>
          <ul className="mt-4 flex flex-col space-y-4">
            <li className="inline-flex items-center">
              <div className="mr-4 rounded-full bg-gray-200 p-2">
                <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.75 11.25l5.5-5.5M5.75 19.25h.5a1 1 0 001-1v-2.5a1 1 0 00-1-1h-.5a1 1 0 00-1 1v2.5a1 1 0 001 1zM11.75 19.25h.5a1 1 0 001-1v-5.5a1 1 0 00-1-1h-.5a1 1 0 00-1 1v5.5a1 1 0 001 1zM17.75 19.25h.5a1 1 0 001-1V5.75a1 1 0 00-1-1h-.5a1 1 0 00-1 1v12.5a1 1 0 001 1zM11.25 8.25v-3.5h-3.5"
                  ></path>
                </svg>
              </div>
              See profile performance
            </li>

            <li className="inline-flex items-center">
              <div className="mr-4 rounded-full bg-gray-200 p-2">
                <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.75 16l2.746-3.493a2 2 0 013.09-.067L13 15.25m-2.085-2.427c1.037-1.32 2.482-3.188 2.576-3.31a2 2 0 013.094-.073L19 12.25m-12.25 7h10.5a2 2 0 002-2V6.75a2 2 0 00-2-2H6.75a2 2 0 00-2 2v10.5a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              See posts
            </li>

            <li className="inline-flex items-center">
              <div className="mr-4 rounded-full bg-gray-200 p-2">
                <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.75 11.25l5.5-5.5M5.75 19.25h.5a1 1 0 001-1v-2.5a1 1 0 00-1-1h-.5a1 1 0 00-1 1v2.5a1 1 0 001 1zM11.75 19.25h.5a1 1 0 001-1v-5.5a1 1 0 00-1-1h-.5a1 1 0 00-1 1v5.5a1 1 0 001 1zM17.75 19.25h.5a1 1 0 001-1V5.75a1 1 0 00-1-1h-.5a1 1 0 00-1 1v12.5a1 1 0 001 1zM11.25 8.25v-3.5h-3.5"
                  ></path>
                </svg>
              </div>
              See posts performance
            </li>
          </ul>

          <h2 className="mt-8 text-xl font-medium">
            {invitation.space.name} will not be able to
          </h2>
          <ul className="mt-4 flex flex-col space-y-4">
            <li className="inline-flex items-center">
              <div className="mr-4 rounded-full bg-gray-200 p-2">
                <svg className="h-6 w-6 " fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4.75 4.75h12.5a2 2 0 012 2v5.5m0 0l-2.664-2.81a2 2 0 00-3.085.06l-.01.013c-.067.087-.879 1.137-1.718 2.213m7.477.524v7M4.75 16l2.5-3.25M4.75 16v1.25a2 2 0 002 2h7.5M4.75 16V9M4.75 4.75l14.5 14.5"
                  ></path>
                </svg>
              </div>
              Post on your account or edit your content
            </li>
          </ul>
        </div>

        <p className="mt-4 text-gray-700">
          You will be redirected to Facebook to login to an account who has
          access to the page set as your Instagram account's page.
        </p>

        <Button className="mt-8 w-full">Authorize</Button>
      </div>
    </main>
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
