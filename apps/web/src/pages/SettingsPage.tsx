
import { useAuthStore } from '../store/authStore';

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">
          Profile Settings
        </h2>

        <div className="mt-4 grid gap-4">
          <div>
            <div className="text-sm text-slate-500">
              Full Name
            </div>

            <div className="font-medium">
              {user?.fullName || 'User'}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Email
            </div>

            <div className="font-medium">
              {user?.email || '-'}
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-500">
              Role
            </div>

            <div className="font-medium">
              {user?.role || 'user'}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">
          Preferences
        </h2>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <div className="font-medium">
            Theme
          </div>

          <div className="mt-1 text-sm text-slate-500">
            Dark mode will be added in the next phase.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <button
          onClick={() => clearAuth()}
          className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </section>
    </div>
  );
}