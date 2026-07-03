import Image from "next/image";
import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <Image src="/maravi-logo.png" alt="Maravi Group" width={180} height={42} className="mb-8" />
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-lg font-semibold text-zinc-900">Maravi Admin</h1>
        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid username or password.
          </p>
        )}
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-zinc-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
