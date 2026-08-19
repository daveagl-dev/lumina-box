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

      <div className="mb-4 flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center shadow-sm sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
        <div className="relative shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-xl font-semibold text-coral sm:h-20 sm:w-20 sm:text-2xl">
            DA
          </div>
          <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white shadow-md hover:bg-coral/90 sm:h-7 sm:w-7">
            <Camera size={12} className="sm:size-[13px]" />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 sm:text-base">David Aguilera</p>
          <p className="text-xs text-slate-400 sm:text-sm">aguilera.davidna@gmail.com</p>
        </div>
        <button className="w-full rounded-lg bg-coral px-3 py-1.5 text-xs font-medium text-white transition hover:bg-coral/90 sm:w-auto sm:px-4 sm:py-2">
          Edit Profile
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
            <Globe size={16} className="sm:size-[18px]" />
          </div>
          <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">Language</p>
          <p className="mb-3 text-xs text-slate-400 sm:mb-4">Choose your preferred language</p>
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

        <div className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
            <Bell size={16} className="sm:size-[18px]" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">Notifications</p>
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

        <div className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-500 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
            <Moon size={16} className="sm:size-[18px]" />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">Dark Mode</p>
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

        <div className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
            <Lock size={16} className="sm:size-[18px]" />
          </div>
          <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">Security</p>
          <p className="mb-3 text-xs text-slate-400 sm:mb-4">Password and two-factor authentication</p>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Manage
          </button>
        </div>
      </div>
    </section>
  );
}
