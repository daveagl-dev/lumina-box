import { useRef, useState } from "react";
import { Globe, Bell, Lock, Moon, Camera } from "lucide-react";
import Avatar from "./Avatar";
import { uploadAvatar } from "../lib/auth";
import { useLanguage } from "../lib/i18n";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default function Settings({ currentUser, onUserUpdated }) {
  const { t, tError, lang, setLang } = useLanguage();
    const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const updatedUser = await uploadAvatar(file);
      onUserUpdated?.(updatedUser);
    } catch (err) {
      setAvatarError(tError(err.message));
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-slate-800">{t("settingsTitle")}</h2>

      <div className="mb-4 flex flex-col items-center gap-3 rounded-2xl bg-white p-4 text-center shadow-sm sm:flex-row sm:gap-4 sm:p-5 sm:text-left">
        <div className="relative shrink-0">
          <Avatar name={currentUser?.name} avatarUrl={currentUser?.avatarUrl} size="lg" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={handleAvatarClick}
            disabled={avatarUploading}
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white shadow-md transition hover:bg-coral/90 disabled:opacity-60 sm:h-7 sm:w-7"
          >
            <Camera size={12} className="sm:size-[13px]" />
          </button>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 sm:text-base">{currentUser?.name || ""}</p>
          <p className="text-xs text-slate-400 sm:text-sm">{currentUser?.email || ""}</p>
          {avatarUploading && <p className="mt-1 text-xs text-slate-400">{t("uploadingPhoto")}</p>}
          {avatarError && <p className="mt-1 text-xs text-red-500">{avatarError}</p>}
        </div>
        <button className="w-full rounded-lg bg-coral px-3 py-1.5 text-xs font-medium text-white transition hover:bg-coral/90 sm:w-auto sm:px-4 sm:py-2">
          {t("editProfile")}
        </button>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 sm:mb-4 sm:h-10 sm:w-10 sm:rounded-xl">
            <Globe size={16} className="sm:size-[18px]" />
          </div>
          <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">{t("languageTitle")}</p>
          <p className="mb-3 text-xs text-slate-400 sm:mb-4">{t("languageDesc")}</p>
          <div className="flex gap-2">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  lang === l.code
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
              <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">{t("notifications")}</p>
              <p className="text-xs text-slate-400">{t("notificationsDesc")}</p>
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
              <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">{t("darkMode")}</p>
              <p className="text-xs text-slate-400">{t("darkModeDesc")}</p>
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
          <p className="mb-0.5 text-sm font-semibold text-slate-800 sm:mb-1">{t("security")}</p>
          <p className="mb-3 text-xs text-slate-400 sm:mb-4">{t("securityDesc")}</p>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            {t("manage")}
          </button>
        </div>
      </div>
    </section>
  );
}
