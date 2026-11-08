import { Search, Bell, Sun, Moon, Languages } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const today = new Intl.DateTimeFormat(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  ).format(new Date())

  return (
    <header className="sticky top-0 z-20 flex min-h-[88px] flex-wrap items-center justify-between gap-4 border-b border-border bg-surface/90 px-5 py-4 backdrop-blur-xl md:px-8">
      <div>
        <p className="text-xs capitalize text-text-secondary">{today}</p>
        <p className="mt-1 text-sm font-semibold text-text-primary">
          {language === 'fr'
            ? 'Votre espace de travail, tout en un.'
            : 'Your workspace, all in one place.'}
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 md:flex">
          <Search size={18} className="text-text-secondary" />
          <input
            type="search"
            placeholder={t('search')}
            className="w-36 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
          <Languages size={17} className="text-text-secondary" />
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            aria-label="Choose language"
            className="cursor-pointer bg-transparent text-sm font-semibold text-text-primary outline-none"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-border bg-background p-3 text-text-secondary transition-all duration-300 hover:bg-surface-hover hover:text-primary hover:rotate-12"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          type="button"
          className="relative rounded-xl border border-border bg-background p-3 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
          aria-label={t('notifications')}
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
          MK
        </div>
      </div>
    </header>
  )
}
