
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HelpCircle,
  Search,
  ChevronDown,
  FolderKanban,
  ListTodo,
  Columns3,
  CalendarDays,
  StickyNote,
  BarChart3,
  Settings,
  BookOpen,
  MessageCircle,
  ArrowRight,
  Lightbulb,
  ShieldCheck,
  X,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const translations = {
  en: {
    title: 'Help & Support',
    subtitle: 'Find answers and learn how to get the most out of TaskPro.',
    search: 'Search for help...',
    popular: 'Quick access',
    guides: 'Workspace guides',
    faq: 'Frequently Asked Questions',
    faqSubtitle: 'Answers to common questions about TaskPro.',
    noResults: 'No results found.',
    noResultsDescription: 'Try another keyword.',
    clear: 'Clear search',
    needHelp: 'Need more help?',
    needHelpDescription: 'Explore the workspace guides or review the FAQ to find your answer.',
    explore: 'Explore workspace',
    tips: 'Helpful tips',
    tip1: 'Keep your tasks updated to get accurate statistics.',
    tip2: 'Use Kanban to organize tasks visually by status.',
    tip3: 'Add due dates to identify overdue tasks.',
    tip4: 'Use Notes to keep important information in one place.',
    gettingStarted: 'Getting started',
    gettingStartedDesc: 'Learn the essential features of your workspace.',
    manageWork: 'Manage your work',
    manageWorkDesc: 'Organize projects, tasks and deadlines.',
    trackProgress: 'Track your progress',
    trackProgressDesc: 'Monitor your productivity and results.',
    customize: 'Customize your workspace',
    customizeDesc: 'Adjust the appearance and language.',
    questions: [
      {
        q: 'How do I create a new task?',
        a: 'Open My Tasks from the sidebar and select the button to add a task. Enter its title, description, priority and due date, then save it.',
      },
      {
        q: 'How can I organize tasks with Kanban?',
        a: 'Open the Kanban Board. You can move cards between To Do, In Progress, Review and Completed by dragging them or using the status selector.',
      },
      {
        q: 'How do I create and manage projects?',
        a: 'Open Projects, create a project and fill in its details. You can update its status and progress or edit and delete it later.',
      },
      {
        q: 'How does the Calendar work?',
        a: 'The Calendar displays your tasks according to their due dates. Select a date to see the tasks scheduled for that day.',
      },
      {
        q: 'Where are my notes saved?',
        a: 'Your notes are saved in this browser using local storage. They remain available on this device unless browser data is cleared.',
      },
      {
        q: 'How are statistics calculated?',
        a: 'Statistics are calculated from your saved tasks and projects. Completed tasks, overdue tasks, priorities and project progress are used to generate the metrics.',
      },
      {
        q: 'Can I switch between dark and light mode?',
        a: 'Yes. Open Settings and choose Dark mode or Light mode. Your choice is saved automatically.',
      },
      {
        q: 'Can I change the interface language?',
        a: 'Yes. You can choose English or French from the Header or from the Settings page.',
      },
      {
        q: 'Are my data synchronized across devices?',
        a: 'Currently, data is stored locally in your browser. Cross-device synchronization will require the backend and database integration.',
      },
    ],
  },
  fr: {
    title: 'Aide et assistance',
    subtitle: 'Trouvez des réponses et profitez pleinement de TaskPro.',
    search: 'Rechercher de l’aide...',
    popular: 'Accès rapide',
    guides: 'Guides de l’espace de travail',
    faq: 'Questions fréquentes',
    faqSubtitle: 'Réponses aux questions les plus courantes.',
    noResults: 'Aucun résultat trouvé.',
    noResultsDescription: 'Essayez un autre mot-clé.',
    clear: 'Effacer la recherche',
    needHelp: 'Besoin d’aide supplémentaire ?',
    needHelpDescription: 'Consultez les guides ou les questions fréquentes.',
    explore: 'Explorer l’espace',
    tips: 'Conseils utiles',
    tip1: 'Mettez vos tâches à jour pour obtenir des statistiques précises.',
    tip2: 'Utilisez Kanban pour organiser visuellement vos tâches.',
    tip3: 'Ajoutez des dates limites pour identifier les retards.',
    tip4: 'Utilisez Notes pour conserver vos informations importantes.',
    gettingStarted: 'Bien démarrer',
    gettingStartedDesc: 'Découvrez les fonctionnalités essentielles.',
    manageWork: 'Gérer votre travail',
    manageWorkDesc: 'Organisez vos projets, tâches et échéances.',
    trackProgress: 'Suivre vos progrès',
    trackProgressDesc: 'Surveillez votre productivité et vos résultats.',
    customize: 'Personnaliser votre espace',
    customizeDesc: 'Modifiez l’apparence et la langue.',
    questions: [
      {
        q: 'Comment créer une nouvelle tâche ?',
        a: 'Ouvrez Mes tâches depuis la barre latérale et cliquez sur le bouton d’ajout. Saisissez le titre, la description, la priorité et la date limite, puis enregistrez.',
      },
      {
        q: 'Comment organiser les tâches avec Kanban ?',
        a: 'Ouvrez le tableau Kanban. Déplacez les cartes entre À faire, En cours, En révision et Terminées par glisser-déposer ou avec le sélecteur de statut.',
      },
      {
        q: 'Comment créer et gérer des projets ?',
        a: 'Ouvrez Projets, créez un projet et renseignez ses informations. Vous pourrez modifier son statut et sa progression, ou le supprimer.',
      },
      {
        q: 'Comment fonctionne le calendrier ?',
        a: 'Le calendrier affiche vos tâches selon leurs dates limites. Sélectionnez une date pour consulter les tâches prévues ce jour-là.',
      },
      {
        q: 'Où sont enregistrées mes notes ?',
        a: 'Vos notes sont enregistrées dans le navigateur grâce au stockage local. Elles restent disponibles sur cet appareil tant que les données du navigateur ne sont pas effacées.',
      },
      {
        q: 'Comment les statistiques sont-elles calculées ?',
        a: 'Les statistiques sont calculées à partir de vos tâches et projets enregistrés : tâches terminées, retards, priorités et progression des projets.',
      },
      {
        q: 'Puis-je passer du mode sombre au mode clair ?',
        a: 'Oui. Ouvrez Paramètres et choisissez le mode sombre ou clair. Votre choix est enregistré automatiquement.',
      },
      {
        q: 'Puis-je changer la langue de l’interface ?',
        a: 'Oui. Vous pouvez choisir l’anglais ou le français depuis l’en-tête ou la page Paramètres.',
      },
      {
        q: 'Mes données sont-elles synchronisées entre appareils ?',
        a: 'Actuellement, les données sont enregistrées localement dans votre navigateur. La synchronisation entre appareils nécessitera l’intégration du backend et de la base de données.',
      },
    ],
  },
}

const guideIcons = [
  { icon: ListTodo, path: '/tasks', color: 'text-primary', bg: 'bg-primary/10', title: 'gettingStarted', desc: 'gettingStartedDesc' },
  { icon: FolderKanban, path: '/projects', color: 'text-sky-500', bg: 'bg-sky-500/10', title: 'manageWork', desc: 'manageWorkDesc' },
  { icon: BarChart3, path: '/statistics', color: 'text-green-500', bg: 'bg-green-500/10', title: 'trackProgress', desc: 'trackProgressDesc' },
  { icon: Settings, path: '/settings', color: 'text-amber-500', bg: 'bg-amber-500/10', title: 'customize', desc: 'customizeDesc' },
]

const quickLinks = [
  { icon: ListTodo, label: 'Tasks', path: '/tasks' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: Columns3, label: 'Kanban', path: '/kanban' },
  { icon: CalendarDays, label: 'Calendar', path: '/calendar' },
  { icon: StickyNote, label: 'Notes', path: '/notes' },
  { icon: BarChart3, label: 'Statistics', path: '/statistics' },
]

export default function Help() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  const [search, setSearch] = useState('')
  const [openQuestion, setOpenQuestion] = useState(null)

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return t.questions

    return t.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(query) ||
        item.a.toLowerCase().includes(query),
    )
  }, [search, t])

  const tips = [t.tip1, t.tip2, t.tip3, t.tip4]

  return (
    <main className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241B50] via-[#30246B] to-[#16466A] px-6 py-10 text-white sm:px-10 sm:py-14"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium">
            <HelpCircle size={15} />
            TaskPro Help Center
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">{t.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
            {t.subtitle}
          </p>

          <div className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <Search size={19} className="shrink-0 text-white/70" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setOpenQuestion(null)
              }}
              placeholder={t.search}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/55"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label={t.clear}
                className="text-white/70 transition hover:text-white"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Quick access */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{t.popular}</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {quickLinks.map(({ icon: Icon, label, path }, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={path}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="rounded-xl bg-primary/10 p-3 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon size={21} />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">{t.guides}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {guideIcons.map(({ icon: Icon, path, color, bg, title, desc }) => (
            <Link
              key={path}
              to={path}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40 hover:shadow-lg"
            >
              <div className={`rounded-xl p-3 ${bg} ${color}`}>
                <Icon size={23} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-text-primary">{t[title]}</h3>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {t[desc]}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-text-secondary transition group-hover:translate-x-1 group-hover:text-primary"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={19} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">{t.faq}</h2>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{t.faqSubtitle}</p>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-12 text-center">
            <Search size={30} className="mx-auto mb-3 text-text-secondary/50" />
            <h3 className="font-semibold text-text-primary">{t.noResults}</h3>
            <p className="mt-1 text-sm text-text-secondary">
              {t.noResultsDescription}
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              {t.clear}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((item, index) => {
              const isOpen = openQuestion === item.q

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl border border-border bg-surface"
                >
                  <button
                    onClick={() => setOpenQuestion(isOpen ? null : item.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">
                        {item.q}
                      </span>
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-text-secondary transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <p className="border-t border-border px-5 py-4 pl-16 text-sm leading-7 text-text-secondary">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Tips */}
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-500">
            <Lightbulb size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">{t.tips}</h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 rounded-xl bg-background p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <p className="text-sm leading-6 text-text-secondary">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Help footer */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MessageCircle size={23} />
        </div>
        <h2 className="text-lg font-bold text-text-primary">{t.needHelp}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
          {t.needHelpDescription}
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          {t.explore}
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  )
}
