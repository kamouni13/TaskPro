
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings as SettingsIcon,
  UserRound,
  Palette,
  Languages,
  Moon,
  Sun,
  Check,
  Save,
  Monitor,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

const translations = {
  en: {
    title: 'Settings',
    subtitle: 'Personalize your TaskPro workspace.',
    profile: 'Profile',
    profileDescription: 'Manage your personal workspace information.',
    displayName: 'Display name',
    role: 'Workspace role',
    roleValue: 'Workspace Owner',
    appearance: 'Appearance',
    appearanceDescription: 'Choose how TaskPro looks on your device.',
    dark: 'Dark mode',
    light: 'Light mode',
    darkDescription: 'Easy on the eyes in low-light environments.',
    lightDescription: 'A clean and bright workspace.',
    language: 'Language',
    languageDescription: 'Choose your preferred interface language.',
    english: 'English',
    french: 'French',
    preferences: 'Preferences',
    preferencesDescription: 'Your workspace preferences are saved automatically.',
    save: 'Save changes',
    saved: 'Changes saved successfully!',
    security: 'Privacy & Security',
    securityDescription: 'Your current workspace settings are stored locally on this device.',
    local: 'Local storage',
    localDescription: 'Your preferences stay in this browser.',
    reset: 'Reset profile name',
    resetDescription: 'Restore the default display name.',
  },
  fr: {
    title: 'Paramètres',
    subtitle: 'Personnalisez votre espace de travail TaskPro.',
    profile: 'Profil',
    profileDescription: 'Gérez les informations de votre espace personnel.',
    displayName: 'Nom affiché',
    role: 'Rôle dans l’espace',
    roleValue: 'Propriétaire',
    appearance: 'Apparence',
    appearanceDescription: 'Choisissez l’apparence de TaskPro.',
    dark: 'Mode sombre',
    light: 'Mode clair',
    darkDescription: 'Confortable dans les environnements peu éclairés.',
    lightDescription: 'Un espace de travail clair et lumineux.',
    language: 'Langue',
    languageDescription: 'Choisissez la langue de l’interface.',
    english: 'Anglais',
    french: 'Français',
    preferences: 'Préférences',
    preferencesDescription: 'Vos préférences sont enregistrées automatiquement.',
    save: 'Enregistrer',
    saved: 'Modifications enregistrées avec succès !',
    security: 'Confidentialité et sécurité',
    securityDescription: 'Vos paramètres sont stockés localement sur cet appareil.',
    local: 'Stockage local',
    localDescription: 'Vos préférences restent dans ce navigateur.',
    reset: 'Réinitialiser le nom',
    resetDescription: 'Restaurer le nom affiché par défaut.',
  },
}

const DEFAULT_NAME = 'Mohamed Kamouni'
const PROFILE_KEY = 'taskpro-profile-name'

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-text-primary">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const t = translations[language] || translations.en

  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(PROFILE_KEY) || DEFAULT_NAME,
  )
  const [savedMessage, setSavedMessage] = useState(false)

  useEffect(() => {
    if (!savedMessage) return

    const timeout = setTimeout(() => setSavedMessage(false), 3000)
    return () => clearTimeout(timeout)
  }, [savedMessage])

  const handleSave = () => {
    const cleanName = displayName.trim()

    if (!cleanName) return

    localStorage.setItem(PROFILE_KEY, cleanName)
    setDisplayName(cleanName)
    setSavedMessage(true)
  }

  const handleResetName = () => {
    setDisplayName(DEFAULT_NAME)
    localStorage.setItem(PROFILE_KEY, DEFAULT_NAME)
    setSavedMessage(true)
  }

  const changeTheme = (selectedTheme) => {
    if (theme !== selectedTheme) {
      toggleTheme()
    }
  }

  const changeLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage)
  }

  return (
    <main className="mx-auto max-w-5xl space-y-7 pb-10">
      {/* Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-primary">
          <SettingsIcon size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            TaskPro Workspace
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{t.subtitle}</p>
      </div>

      {/* Profile */}
      <Section
        icon={UserRound}
        title={t.profile}
        description={t.profileDescription}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-xl font-bold text-white shadow-lg shadow-primary/20">
            {displayName.trim().charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="min-w-0 flex-1">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              {t.displayName}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSave()
              }}
              maxLength={50}
              placeholder={t.displayName}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <p className="mt-2 text-xs text-text-secondary">
              {t.role}: <span className="font-medium text-primary">{t.roleValue}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!displayName.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            {t.save}
          </button>

          <button
            onClick={handleResetName}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-primary hover:text-primary"
          >
            <RotateCcw size={15} />
            {t.reset}
          </button>

          {savedMessage && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 text-sm text-green-500"
            >
              <Check size={16} />
              {t.saved}
            </motion.span>
          )}
        </div>
      </Section>

      {/* Appearance */}
      <Section
        icon={Palette}
        title={t.appearance}
        description={t.appearanceDescription}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => changeTheme('dark')}
            className={`relative rounded-2xl border-2 p-4 text-left transition ${
              theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {theme === 'dark' && (
              <span className="absolute right-3 top-3 rounded-full bg-primary p-1 text-white">
                <Check size={13} />
              </span>
            )}

            <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-slate-700 bg-[#0B1020]">
              <div className="flex w-4/5 gap-2">
                <div className="h-14 w-1/4 rounded-md bg-[#1C2740]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-[#7655E8]" />
                  <div className="h-7 rounded bg-[#151D32]" />
                  <div className="h-3 w-1/2 rounded bg-[#263249]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-text-primary">
              <Moon size={17} />
              <span className="text-sm font-semibold">{t.dark}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{t.darkDescription}</p>
          </button>

          <button
            onClick={() => changeTheme('light')}
            className={`relative rounded-2xl border-2 p-4 text-left transition ${
              theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {theme === 'light' && (
              <span className="absolute right-3 top-3 rounded-full bg-primary p-1 text-white">
                <Check size={13} />
              </span>
            )}

            <div className="mb-4 flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-[#F1F5F9]">
              <div className="flex w-4/5 gap-2">
                <div className="h-14 w-1/4 rounded-md bg-white shadow-sm" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-[#7655E8]" />
                  <div className="h-7 rounded bg-white shadow-sm" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-text-primary">
              <Sun size={17} />
              <span className="text-sm font-semibold">{t.light}</span>
            </div>
            <p className="mt-1 text-xs text-text-secondary">{t.lightDescription}</p>
          </button>
        </div>
      </Section>

      {/* Language */}
      <Section
        icon={Languages}
        title={t.language}
        description={t.languageDescription}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { code: 'en', label: t.english, flag: '🇬🇧' },
            { code: 'fr', label: t.french, flag: '🇫🇷' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => changeLanguage(item.code)}
              className={`flex items-center justify-between rounded-xl border-2 p-4 transition ${
                language === item.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl">{item.flag}</span>
                <span className="text-sm font-semibold text-text-primary">
                  {item.label}
                </span>
              </span>
              {language === item.code && (
                <span className="rounded-full bg-primary p-1 text-white">
                  <Check size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Preferences information */}
      <Section
        icon={ShieldCheck}
        title={t.security}
        description={t.securityDescription}
      >
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
          <div className="rounded-xl bg-green-500/10 p-2.5 text-green-500">
            <Monitor size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{t.local}</p>
            <p className="mt-1 text-xs text-text-secondary">
              {t.localDescription}
            </p>
          </div>
          <span className="ml-auto rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
            Local
          </span>
        </div>
      </Section>

      <p className="text-center text-xs text-text-secondary">
        TaskPro · Personal Workspace
      </p>
    </main>
  )
}
