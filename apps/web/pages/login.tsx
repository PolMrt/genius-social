import { useRouter } from "next/router";
import { FormEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ApiFormatedError, postFetcher } from "@/utils/fetcher";
import Button from "@/components/ui/button";
import ApiError from "@/components/ui/apiError";

export default function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (credentials: any) => postFetcher("/auth/login", credentials),
    {
      onSuccess: (data) => {
        if (data?.data?.user) {
          queryClient.setQueryData("/users/me", () => data.data.user);

          if (data.data.user?.favoritSpace?.slug) {
            return router.push("/" + data.data.user.favoritSpace.slug);
          } else {
            return router.push("/");
          }
        }
      },
      onError: (error) => {
        if (!(error instanceof ApiFormatedError)) {
          console.error(error);
          alert("An error occured");
        }
      },
    }
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements as typeof form.elements & {
      mail: HTMLInputElement;
      password: HTMLInputElement;
    };

    mutation.mutate({
      mail: formElements.mail.value,
      password: formElements.password.value,
    });
  };

  return (
    <div className="h-screen">
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          {mutation.isError && mutation.error instanceof ApiFormatedError ? (
            <ApiError error={mutation.error} />
          ) : null}
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="mail" className="sr-only">
                  Email address
                </label>
                <input
                  id="mail"
                  name="mail"
                  type="mail"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                loading={mutation.isLoading}
              >
                Sign in
              </Button>
              {/* <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-dark-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-dark-blue-700 focus:outline-none focus:ring-2 focus:ring-dark-blue-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                Sign in
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
