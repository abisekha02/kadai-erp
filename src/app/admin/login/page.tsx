import Link from "next/link";
import { login } from "../actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-display text-3xl font-bold">Kadai &amp; Co. staff</h1>
      <p className="mt-2 text-sm text-mute">Sign in to manage stock, orders and purchasing.</p>
      <form action={login} className="panel mt-6 space-y-4 p-5">
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input" required autoFocus />
        </div>
        {searchParams.error && (
          <p role="alert" className="rounded-md bg-brick/10 p-3 text-sm text-brick">
            That password is not right. Try again.
          </p>
        )}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
      <Link href="/" className="mt-4 text-sm text-mute underline underline-offset-4">
        Back to the store
      </Link>
    </main>
  );
}
