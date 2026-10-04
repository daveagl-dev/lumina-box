import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Cloud, Shield, Zap } from "lucide-react";
import { login, register } from "../lib/auth";

function Login({ onAuthenticated }) {
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
              Your files, <span className="text-coral">organized</span> and always within reach.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Store, share, and manage everything in one secure place — built to keep your workflow
              effortless.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Cloud size={16} className="text-coral" />
              </span>
              Seamless cloud storage, anywhere you go
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Shield size={16} className="text-coral" />
              </span>
              Private accounts, protected with encryption
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Zap size={16} className="text-coral" />
              </span>
              Fast uploads and instant access
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">&copy; {new Date().getFullYear()} Lumina Box. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-1 text-2xl font-semibold text-navy lg:hidden">
            Lumina Box<span className="text-coral">.</span>
          </div>

          <h2 className="text-2xl font-semibold text-navy">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {isLogin
              ? "Sign in to access your files and folders."
              : "Start storing and organizing your files today."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Full name
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
                Email address
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
                Password
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
                <p className="mt-1.5 text-xs text-slate-400">Must be at least 8 characters.</p>
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
                "Please wait..."
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={switchMode} className="font-semibold text-coral hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
