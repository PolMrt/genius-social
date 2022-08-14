import FbConnection from "@/components/invitations-user-flow/fbConnection";
import InstagramAccount from "@/components/invitations-user-flow/instagramAccounts";
import Pages from "@/components/invitations-user-flow/pages";
import Steps from "@/components/invitations-user-flow/steps";
import { ApiFormatedError, postFetcher } from "@/utils/fetcher";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import ReactCanvasConfetti from "react-canvas-confetti";
import LoadingIndicator from "@/components/ui/loadingIndicator";
import Button from "@/components/ui/button";
import ApiError from "@/components/ui/apiError";
import Card from "@/components/ui/card";
import Bullet, { IconEnum } from "components/ui/permissionBullet";

export default function InvitationPage({ invitation }: any) {
  const [confState, setConfState] = useState({ fire: false, reset: false });
  const [fbAT, setFbAT] = useState("");
  const [selectedPageId, setSelectedPageId] = useState("");
  const [selectedInstaId, setSelectedInstaId] = useState("");
  const [step, setStep] = useState(1);

  const acceptInvitationMutation = useMutation(
    (invitationData: any) =>
      postFetcher(
        `/space/${invitation.space.slug}/invitations/accept/${invitation.uniqueId}`,
        invitationData
      ),
    {
      onSuccess: () => {
        setTimeout(
          () => setConfState((prev) => ({ ...prev, fire: true })),
          250
        );
      },
    }
  );

  useEffect(() => {
    if (fbAT) {
      setStep((prev) => (prev > 2 ? prev : 2));
    }
  }, [fbAT]);

  useEffect(() => {
    if (selectedPageId) {
      setStep((prev) => (prev > 3 ? prev : 3));
    }
  }, [selectedPageId]);

  useEffect(() => {
    if (selectedInstaId) {
      setStep((prev) => (prev > 4 ? prev : 4));

      if (!acceptInvitationMutation.isLoading) {
        acceptInvitationMutation.mutate({
          instagramAccountId: selectedInstaId,
          pageId: selectedPageId,
          accessToken: fbAT,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstaId]);

  return (
    <main className="pt-8 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-center font-sans2 text-2xl font-extrabold">
          {invitation.space.name}
        </h1>
        <Card className="mt-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            @{invitation.identifier} access request
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae,
            iure dicta quae obcaecati perspiciatis sapiente aliquam labore sed
            quisquam cupiditate eligendi nemo delectus nihil cum. Necessitatibus
            et numquam excepturi soluta!
          </p>
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
            {invitation.space.name} will be able to
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            <li>
              <Bullet
                title="See profile performance"
                icon={IconEnum.check}
                description="Tempor tellus in aliquet eu et sit nulla tellus. Suspendisse est, molestie blandit quis ac. Lacus."
              />
            </li>
            <li>
              <Bullet
                title="See posts & performance"
                icon={IconEnum.check}
                description="Tempor tellus in aliquet eu et sit nulla tellus. Suspendisse est, molestie blandit quis ac. Lacus."
              />
            </li>
          </ul>

          <h2 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
            {invitation.space.name} will not be able to
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            <li>
              <Bullet
                title="Post on your account"
                icon={IconEnum.cross}
                description="Tempor tellus in aliquet eu et sit nulla tellus. Suspendisse est, molestie blandit quis ac. Lacus."
              />
            </li>
            <li>
              <Bullet
                title="Edit your content or account"
                icon={IconEnum.cross}
                description="Tempor tellus in aliquet eu et sit nulla tellus. Suspendisse est, molestie blandit quis ac. Lacus."
              />
            </li>
            <li>
              <Bullet
                title="See your messages"
                icon={IconEnum.cross}
                description="Tempor tellus in aliquet eu et sit nulla tellus. Suspendisse est, molestie blandit quis ac. Lacus."
              />
            </li>
          </ul>
        </Card>

        {acceptInvitationMutation.isSuccess ||
        invitation.state === "accepted" ? (
          <>
            <ReactCanvasConfetti
              className="fixed top-0 left-0 h-full w-full object-cover"
              fire={confState.fire}
              reset={confState.reset}
              origin={{
                x: 0.5,
                y: 0.6,
              }}
              zIndex={10}
            />
            <div className="relative z-20 mt-6 flex items-center justify-center rounded-lg bg-white px-6 py-6 shadow">
              <div className="flex flex-col items-center">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-green-400">
                  Your account is connected
                </h2>
              </div>
            </div>
          </>
        ) : (
          <Card className="mt-6">
            <Steps step={step} />
            <div className="mt-8">
              {step === 1 ? (
                <FbConnection token={fbAT} setToken={setFbAT} />
              ) : null}

              {step === 2 ? (
                <Pages
                  accessToken={fbAT}
                  selectedPageId={selectedPageId}
                  setSelectedPageId={setSelectedPageId}
                />
              ) : null}

              {step === 3 ? (
                <InstagramAccount
                  accessToken={fbAT}
                  selectedPageId={selectedPageId}
                  requestedAccountUsername={invitation.identifier}
                  setSelectedInstaId={setSelectedInstaId}
                />
              ) : null}

              {step === 4 ? (
                <>
                  {acceptInvitationMutation.isLoading ? (
                    <div className="flex items-center justify-center text-gray-700">
                      <div>
                        <LoadingIndicator />
                      </div>
                    </div>
                  ) : null}
                  {acceptInvitationMutation.isError ? (
                    <>
                      {acceptInvitationMutation.error instanceof
                      ApiFormatedError ? (
                        <ApiError error={acceptInvitationMutation.error} />
                      ) : (
                        "An error occured"
                      )}{" "}
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const rawData = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/space/${context.query.spaceSlug}/invitations/${context.query.invitationId}`
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
