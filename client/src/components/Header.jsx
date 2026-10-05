import { useRef } from "react";
import { Search, Bell, Grid2x2, Upload, Bot, Menu, LogOut } from "lucide-react";
import Avatar from "./Avatar";
import { useLanguage } from "../lib/i18n";

export default function Header({ onMenuClick, onUploadFile, avatarUrl, onLogout, userName }) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleAskAngela = () => {
    window.dispatchEvent(new CustomEvent("ask-angela"));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) onUploadFile?.(file);
    event.target.value = "";
  };

  return (
    <header className="mb-4 flex flex-col gap-3 sm:mb-6 md:mb-8 2xl:flex-row 2xl:items-start 2xl:justify-between 2xl:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold text-slate-800 sm:text-xl md:text-2xl">
            {userName ? t("welcomeNamed", { name: userName.split(" ")[0] }) : t("welcome")}
          </h1>
          <p className="mt-0.5 text-xs text-slate-400 sm:mt-1 sm:text-sm">
            {t("headerTagline")}
          </p>
          <div className="mt-2 flex items-center gap-2 sm:mt-3 sm:flex-wrap sm:gap-3">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleUploadClick}
              className="group flex shrink-0 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-coral shadow-sm transition hover:shadow-md active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
            >
              <Upload size={16} className="sm:size-[18px]" />
              <span className="hidden xs:inline">{t("uploadFile")}</span>
              <span className="inline xs:hidden">{t("upload")}</span>
            </button>
            <button
              onClick={handleAskAngela}
              className="group flex shrink-0 items-center gap-2 rounded-lg bg-coral px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-coral/90 active:scale-[0.98] sm:px-4 sm:py-2.5 sm:text-sm md:text-base"
            >
              <Bot size={16} className="sm:size-[18px]" />
              <span className="hidden sm:inline">{t("askAngela")}</span>
              <span className="inline sm:hidden">{t("ask")}</span>
            </button>
            {/* Mobile only: bell and logout share the row with the action buttons */}
            <div className="ml-auto flex shrink-0 items-center gap-2 sm:hidden">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <Bell size={16} />
              </button>
              <button
                onClick={onLogout}
                title={t("logOut")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden min-w-0 flex-1 items-center justify-between gap-2 sm:flex sm:gap-3 2xl:min-w-max 2xl:flex-none 2xl:justify-end">
        <div className="hidden min-w-0 flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm sm:flex md:px-4 md:py-2.5 2xl:flex-none 2xl:w-64">
          <Search size={16} className="shrink-0 text-slate-400 md:size-[18px]" />
          <input
            type="text"
            placeholder={t("searchFile")}
            className="w-full min-w-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm sm:h-10 sm:w-10">
            <Bell size={16} className="sm:size-[18px]" />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm sm:flex md:h-10 md:w-10">
            <Grid2x2 size={16} className="md:size-[18px]" />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <Avatar name={userName} avatarUrl={avatarUrl} size="sm" />
            <span className="hidden text-xs font-medium text-slate-700 xl:inline">{userName || ""}</span>
          </div>
          <button
            onClick={onLogout}
            title={t("logOut")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm sm:h-10 sm:w-10"
          >
            <LogOut size={16} className="sm:size-[18px]" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm sm:hidden">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder={t("search")}
          className="w-full min-w-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </header>
  );
}
