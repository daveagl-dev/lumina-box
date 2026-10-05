import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { appText } from "./appText";

const LANG_KEY = "lumina-language";

const loginText = {
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
    errNameRequired: "Name is required",
    errInvalidEmail: "Enter a valid email address",
    errPasswordRequired: "Password is required",
    errPasswordShort: "Password must be at least 8 characters",
    errInvalidRegister: "Valid email and password (min 8 characters) are required",
    errEmailExists: "An account with this email already exists",
    errCredentialsRequired: "Email and password are required",
    errInvalidCredentials: "Invalid email or password",
    errNetwork: "Could not reach the server",
    errGeneric: "Something went wrong",
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
    errNameRequired: "El nombre es obligatorio",
    errInvalidEmail: "Introduce un correo electrónico válido",
    errPasswordRequired: "La contraseña es obligatoria",
    errPasswordShort: "La contraseña debe tener al menos 8 caracteres",
    errInvalidRegister: "Se requiere un correo válido y una contraseña (mín. 8 caracteres)",
    errEmailExists: "Ya existe una cuenta con este correo",
    errCredentialsRequired: "El correo y la contraseña son obligatorios",
    errInvalidCredentials: "Correo o contraseña incorrectos",
    errNetwork: "No se pudo conectar con el servidor",
    errGeneric: "Algo salió mal",
  },
};

export const translations = {
  en: { ...loginText.en, ...appText.en },
  es: { ...loginText.es, ...appText.es },
};

// Messages returned by the server / api layer (English) -> translation keys
const errorKeys = {
  "Name is required": "errNameRequired",
  "Valid email and password (min 8 characters) are required": "errInvalidRegister",
  "An account with this email already exists": "errEmailExists",
  "Email and password are required": "errCredentialsRequired",
  "Invalid email or password": "errInvalidCredentials",
  "Failed to fetch": "errNetwork",
  "No file provided": "errNoFile",
  "Upload failed": "errUpload",
  "Failed to upload file to Backblaze": "errUpload",
  "Failed to list files": "errList",
  "Failed to list files from Backblaze": "errList",
  "Failed to get download URL": "errDownload",
  "Failed to generate download URL": "errDownload",
  "Failed to delete file": "errDelete",
  "Failed to delete file from Backblaze": "errDelete",
  "Authentication required": "errAuthRequired",
  "Invalid or expired token": "errSessionExpired",
  "No image provided": "errNoImage",
  "Failed to upload profile picture": "errAvatar",
  "User not found": "errUserNotFound",
  "Internal server error": "errServer",
};

const LOCALES = { en: "en-US", es: "es-ES" };

function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved in translations) return saved;
  } catch {
    // localStorage unavailable
  }
  return navigator.language?.startsWith("es") ? "es" : "en";
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!(next in translations)) return;
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const value = useMemo(() => {
    const dict = translations[lang];
    const t = (key, vars) => {
      const text = dict[key] ?? key;
      return vars ? text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "") : text;
    };
    // Translates a known server/api error message; unknown ones become a generic message
    const tError = (message) => dict[errorKeys[message] ?? message] ?? dict.errGeneric;
    return { lang, setLang, t, tError, locale: LOCALES[lang] };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
