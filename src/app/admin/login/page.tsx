import { isAdminPasswordSet } from "@/lib/admin-auth";
import { login } from "../actions";

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-extrabold">🔐 Admin login</h1>

      {!isAdminPasswordSet() ? (
        <p className="mt-4 rounded-xl bg-warn-soft p-4 text-sm text-warn-fg">
          Set <code>ADMIN_PASSWORD</code> in <code>.env.local</code> and restart <code>npm run dev</code>.
        </p>
      ) : (
        <form action={login} className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="Admin password"
            className="w-full rounded-xl border-2 border-line-strong bg-surface px-4 py-3 text-fg outline-none focus:border-link"
          />
          {error && <p className="text-sm font-semibold text-bad">Wrong password. Try again.</p>}
          <button className="w-full rounded-xl bg-primary px-4 py-3 font-bold text-on-primary hover:bg-primary-hover">Log in</button>
        </form>
      )}
    </div>
  );
}
