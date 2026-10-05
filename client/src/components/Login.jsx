import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Cloud, Shield, Zap, Languages } from "lucide-react";
import { login, register } from "../lib/auth";

const translations = {
  en: {
    headlineStart: "Your files,",
    headlineAccent: "organized",
    headlineEnd: "and always within reach.",
    tagline:
      "Store, share, and manage everything in one secure place — built to keep your workflow effortless.",
    feature1: "Seamless cloud storage, anywhere you go",
    feature2: "Private accounts, protected with encryption",
    feature3: "Fast uploads and instant access",
    rights: "All rights reserved.",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    loginSubtitle: "Sign in to access your files and folders.",
    registerSubtitle: "Start storing and organizing your files today.",
    fullName: "Full name",
    email: "Email address",
    password: "Password",
    passwordHint: "Must be at least 8 characters.",
    wait: "Please wait...",
    signIn: "Sign in",
    createAccountBtn: "Create account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    signUp: "Sign up",
    switchTo: "Cambiar a español",
  },
  es: {
    headlineStart: "Tus archivos,",
    headlineAccent: "organizados",
    headlineEnd: "y siempre al alcance.",
    tagline:
      "Guarda, comparte y gestiona todo en un solo lugar seguro, pensado para que tu trabajo fluya sin esfuerzo.",
    feature1: "Almacenamiento en la nube, vayas donde vayas",
    feature2: "Cuentas privadas, protegidas con cifrado",
    feature3: "Subidas rápidas y acceso inmediato",
    rights: "Todos los derechos reservados.",
    welcomeBack: "Bienvenido de nuevo",
    createAccount: "Crea tu cuenta",
    loginSubtitle: "Inicia sesión para acceder a tus archivos y carpetas.",
    registerSubtitle: "Empieza a guardar y organizar tus archivos hoy.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHint: "Debe tener al menos 8 caracteres.",
    wait: "Espera un momento...",
    signIn: "Iniciar sesión",
    createAccountBtn: "Crear cuenta",
    noAccount: "¿No tienes una cuenta?",
    haveAccount: "¿Ya tienes una cuenta?",
    signUp: "Regístrate",
    switchTo: "Switch to English",
  },
};

const LANG_KEY = "lumina-language";

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved in translations) return saved;
  } catch {
    // localStorage unavailable
  }
  return navigator.language?.startsWith("es") ? "es" : "en";
}

function Login({ onAuthenticated }) {
  const [lang, setLang] = useState(getInitialLang);
  const t = translations[lang];
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = isLogin ? await login(email, password) : await register(name, email, password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLang = () => {
    const next = lang === "en" ? "es" : "en";
    setLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // localStorage unavailable
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#eef0f4]">
      {/* Left panel — brand */}
      <div className="relative hidden w-full max-w-xl flex-col justify-between overflow-hidden bg-navy px-12 py-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #f2673e 0%, transparent 40%), radial-gradient(circle at 80% 70%, #f2673e 0%, transparent 35%)",
          }}
        />

        <div className="relative flex items-center gap-1 text-2xl font-semibold text-white">
          Lumina Box<span className="text-coral">.</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">
              {t.headlineStart} <span className="text-coral">{t.headlineAccent}</span> {t.headlineEnd}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              {t.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Cloud size={16} className="text-coral" />
              </span>
              {t.feature1}
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Shield size={16} className="text-coral" />
              </span>
              {t.feature2}
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Zap size={16} className="text-coral" />
              </span>
              {t.feature3}
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">&copy; {new Date().getFullYear()} Lumina Box. {t.rights}</p>
      </div>

      {/* Right panel — form */}
      <div className="relative flex w-full flex-1 items-center justify-center overflow-hidden px-6 py-10 sm:px-10">
        {/* Mobile-only decoration */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden bg-navy lg:hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, #f2673e 0%, transparent 45%), radial-gradient(circle at 90% 80%, #f2673e 0%, transparent 40%)",
            }}
          />
          <div className="absolute -right-6 -top-10 h-16 w-16 rounded-full border border-white/10" />
          <div className="absolute -bottom-6 left-32 h-10 w-10 rounded-full border border-white/10" />
          <div className="absolute left-6 top-4 flex items-center gap-1 text-2xl font-semibold text-white">
            Lumina Box<span className="text-coral">.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleLang}
          aria-label={t.switchTo}
          className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-navy shadow-sm transition hover:border-coral hover:text-coral sm:right-6 sm:top-6"
        >
          <Languages size={15} />
          {lang === "en" ? "ES" : "EN"}
        </button>
        <div className="relative mt-6 w-full max-w-sm lg:mt-0">
          <h2 className="text-2xl font-semibold text-navy">
            {isLogin ? t.welcomeBack : t.createAccount}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {isLogin ? t.loginSubtitle : t.registerSubtitle}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy shadow-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                    placeholder="Alex Morgan"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.email}
              </label>
              <div className="relative">
                <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-navy shadow-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                {t.password}
              </label>
              <div className="relative">
                <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-navy shadow-sm outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1.5 text-xs text-slate-400">{t.passwordHint}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-coral py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-coral/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                t.wait
              ) : (
                <>
                  {isLogin ? t.signIn : t.createAccountBtn}
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? t.noAccount : t.haveAccount}{" "}
            <button type="button" onClick={switchMode} className="font-semibold text-coral hover:underline">
              {isLogin ? t.signUp : t.signIn}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
