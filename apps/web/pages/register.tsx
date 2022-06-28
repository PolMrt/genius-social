import { useRouter } from "next/router";
import { FormEvent, useMemo, useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ApiFormatedError, postFetcher } from "@/utils/fetcher";
import Button from "@/components/ui/button";
import ApiError from "@/components/ui/apiError";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);

  const mutation = useMutation(
    (credentials: any) => postFetcher("/users/register", credentials),
    {
      onSuccess: (data) => {
        if (formRef) formRef?.current?.reset();
        alert(
          "Account requested ! We'll reach you as soon as possible to activate your account."
        );
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
      email: HTMLInputElement;
      password: HTMLInputElement;
      name: HTMLInputElement;
    };

    mutation.mutate({
      email: formElements.email.value,
      password: formElements.password.value,
      name: formElements.name.value,
    });
  };

  const fakeUser = useMemo(() => {
    const data = [
      { name: "John Doe", email: "john.doe@hey.com" },
      { name: "Jane Doe", email: "jane.doe@hey.com" },
    ];
    return data[Math.floor(Math.random() * data.length)];
  }, []);

  return (
    <div className="h-screen">
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-md flex-col space-y-8">
          <div className="flex flex-col items-center">
            <img src="/logo.svg" className="h-12" alt="Genius Social's logo" />
            <h2 className="mt-4 text-center text-2xl font-bold text-gray-800">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We&apos;re currently in alpha phase. You can create an account but
              it will require an activation from us. Already have an account ?{" "}
              <Link href="/login">
                <a className="font-medium text-dark-blue-600 hover:text-dark-blue-500">
                  Log in
                </a>
              </Link>
              .
            </p>
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {mutation.isError && mutation.error instanceof ApiFormatedError ? (
              <ApiError className="mb-4" error={mutation.error} />
            ) : null}
            <form className="space-y-6" onSubmit={onSubmit} ref={formRef}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder={fakeUser.name}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={fakeUser.email}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    placeholder="••••••••"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-dark-blue-500 focus:outline-none focus:ring-dark-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  loading={mutation.isLoading}
                >
                  Register
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
