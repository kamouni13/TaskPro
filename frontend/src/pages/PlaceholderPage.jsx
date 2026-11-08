import { useLanguage } from '../context/LanguageContext'

const translations = {
  'My Tasks': 'Mes tâches',
  'Kanban Board': 'Tableau Kanban',
  Calendar: 'Calendrier',
  'My Notes': 'Mes notes',
  Statistics: 'Statistiques',
  Settings: 'Paramètres',
  'Help & Support': 'Aide et assistance',
  'Page Not Found': 'Page introuvable',
}

export default function PlaceholderPage({ title }) {
  const { language } = useLanguage()

  const translatedTitle =
    language === 'fr' ? translations[title] || title : title

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 rounded-2xl bg-primary/10 p-5 text-primary">
        <span className="text-4xl">🚀</span>
      </div>

      <h1 className="text-3xl font-bold text-text-primary">
        {translatedTitle}
      </h1>

      <p className="mt-3 max-w-md text-sm text-text-secondary">
        {language === 'fr'
          ? 'Cet espace de travail est en cours de préparation. Restez connecté !'
          : 'This workspace is being prepared. Stay tuned!'}
      </p>
    </main>
  )
}