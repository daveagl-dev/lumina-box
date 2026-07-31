import { useState } from "react";
import { Globe, Bell, Lock, Moon, Camera } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function Settings() {
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-800">Settings</h2>

      <div className="mb-4 flex flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-sm sm:flex-row sm:text-left">
        <div className="relative shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral/10 text-2xl font-semibold text-coral">
            DA
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-coral text-white shadow-md hover:bg-coral/90">
            <Camera size={13} />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold text-slate-800">David Aguilera</p>
          <p className="text-sm text-slate-400">aguilera.davidna@gmail.com</p>
        </div>
        <button className="rounded-lg bg-coral px-4 py-2 text-xs font-medium text-white transition hover:bg-coral/90">
          Edit Profile
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
            <Globe size={18} />
          </div>
          <p className="mb-1 text-sm font-semibold text-slate-800">Language</p>
          <p className="mb-4 text-xs text-slate-400">Choose your preferred language</p>
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  language === l.code
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Bell size={18} />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-800">Notifications</p>
              <p className="text-xs text-slate-400">Email and push alerts</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
                notifications ? "bg-coral" : "bg-slate-200"
              }`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  notifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-500">
            <Moon size={18} />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-800">Dark Mode</p>
              <p className="text-xs text-slate-400">Switch to a darker theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
                darkMode ? "bg-coral" : "bg-slate-200"
              }`}
            >
              <span
                className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${
                  darkMode ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <Lock size={18} />
          </div>
          <p className="mb-1 text-sm font-semibold text-slate-800">Security</p>
          <p className="mb-4 text-xs text-slate-400">Password and two-factor authentication</p>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Manage
          </button>
        </div>
      </div>
    </section>
  );
}
