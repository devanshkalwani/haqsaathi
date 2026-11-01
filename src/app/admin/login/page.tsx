import { isAdminPasswordSet } from "@/lib/admin-auth";
import { login } from "../actions";

export default async function AdminLogin({ searchParams }: PageProps<"/admin/login">) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-extrabold">🔐 Admin login</h1>

      {!isAdminPasswordSet() ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
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
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-brand-600"
          />
          {error && <p className="text-sm font-semibold text-rose-600">Wrong password. Try again.</p>}
          <button className="w-full rounded-xl bg-brand-700 px-4 py-3 font-bold text-white hover:bg-brand-800">Log in</button>
        </form>
      )}
    </div>
  );
}
