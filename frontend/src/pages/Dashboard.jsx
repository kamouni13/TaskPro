import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListTodo,
  MoreHorizontal,
  CalendarDays,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { useLanguage } from '../context/LanguageContext'

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    change: '+2 this month',
    positive: true,
    icon: FolderKanban,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    title: 'Completed Tasks',
    value: '48',
    change: '+12.5%',
    positive: true,
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    title: 'Pending Tasks',
    value: '18',
    change: '3 due today',
    positive: false,
    icon: Clock3,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    title: 'Total Tasks',
    value: '66',
    change: '+8 this week',
    positive: true,
    icon: ListTodo,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
]

const activityData = [
  { day: 'Mon', completed: 5, created: 3 },
  { day: 'Tue', completed: 8, created: 5 },
  { day: 'Wed', completed: 6, created: 4 },
  { day: 'Thu', completed: 10, created: 6 },
  { day: 'Fri', completed: 7, created: 4 },
  { day: 'Sat', completed: 12, created: 7 },
  { day: 'Sun', completed: 9, created: 5 },
]

const progressData = [
  { name: 'Completed', value: 48, color: '#22C55E' },
  { name: 'In Progress', value: 12, color: '#7655E8' },
  { name: 'To Do', value: 6, color: '#38BDF8' },
]

const tasks = [
  {
    title: 'Design new dashboard interface',
    project: 'TaskPro Platform',
    date: 'Today',
    priority: 'High',
    status: 'In Progress',
    color: 'text-warning bg-warning/10',
  },
  {
    title: 'Create authentication system',
    project: 'Personal Workspace',
    date: 'Tomorrow',
    priority: 'Urgent',
    status: 'To Do',
    color: 'text-danger bg-danger/10',
  },
  {
    title: 'Update project documentation',
    project: 'TaskPro Platform',
    date: 'Nov 10, 2026',
    priority: 'Medium',
    status: 'Completed',
    color: 'text-success bg-success/10',
  },
  {
    title: 'Review database structure',
    project: 'Backend Development',
    date: 'Nov 12, 2026',
    priority: 'Low',
    status: 'To Do',
    color: 'text-accent bg-accent/10',
  },
]

function Dashboard() {
  const { language } = useLanguage()

  const translations = {
    'Total Projects': 'Total des projets',
    'Completed Tasks': 'Tâches terminées',
    'Pending Tasks': 'Tâches en attente',
    'Total Tasks': 'Total des tâches',
    '+2 this month': '+2 ce mois-ci',
    '3 due today': '3 pour aujourd’hui',
    '+8 this week': '+8 cette semaine',

    'Productivity Overview': 'Vue d’ensemble de la productivité',
    'Your weekly task activity': 'Votre activité hebdomadaire',
    'This week': 'Cette semaine',
    'Completed tasks': 'Tâches terminées',
    'Created tasks': 'Tâches créées',

    'Task Distribution': 'Répartition des tâches',
    'Overview of all tasks': 'Vue d’ensemble des tâches',
    'Completed': 'Terminées',
    'In Progress': 'En cours',
    'To Do': 'À faire',
    'Total tasks': 'Total des tâches',

    'Recent Tasks': 'Tâches récentes',
    'Keep track of your latest work': 'Suivez vos dernières activités',
    'New Task': 'Nouvelle tâche',
    'Task': 'Tâche',
    'Due date': 'Date limite',
    'Priority': 'Priorité',
    'Status': 'Statut',

    'High': 'Élevée',
    'Urgent': 'Urgente',
    'Medium': 'Moyenne',
    'Low': 'Faible',
    'Today': 'Aujourd’hui',
    'Tomorrow': 'Demain',

    'View all tasks': 'Voir toutes les tâches',

    'Weekly Goal': 'Objectif hebdomadaire',
    'Your productivity target': 'Votre objectif de productivité',
    'Tasks completed': 'Tâches terminées',
    '80% of your weekly goal achieved': '80 % de votre objectif atteint',
    'Stay consistent': 'Restez régulier',
    '4 active days this week': '4 jours actifs cette semaine',
    'Great progress': 'Excellent progrès',
    '6 tasks left to reach your goal': '6 tâches restantes pour atteindre votre objectif',

    'TaskPro Workspace': 'Espace de travail TaskPro',
    'Personal productivity, organized.': 'Votre productivité personnelle, organisée.',

    'Design new dashboard interface': 'Concevoir le tableau de bord',
    'Create authentication system': 'Créer le système d’authentification',
    'Update project documentation': 'Mettre à jour la documentation',
    'Review database structure': 'Examiner la structure de la base de données',
    'Personal Workspace': 'Espace personnel',
    'Backend Development': 'Développement Backend',

    'Mon': 'Lun',
    'Tue': 'Mar',
    'Wed': 'Mer',
    'Thu': 'Jeu',
    'Fri': 'Ven',
    'Sat': 'Sam',
    'Sun': 'Dim',
  }

  const tr = (text) => {
    return language === 'fr' ? translations[text] || text : text
  }

  const localizedActivityData = activityData.map((item) => ({
    ...item,
    day: tr(item.day),
  }))

  const localizedProgressData = progressData.map((item) => ({
    ...item,
    name: tr(item.name),
  }))

  return (
    <div className="w-full min-w-0">
      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">

        {/* Quick overview */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-border bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon size={21} className={stat.color} />
                  </div>

                  <button
                    type="button"
                    aria-label="More options"
                    className="text-text-secondary hover:text-text-primary"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <p className="text-sm text-text-secondary">
                  {tr(stat.title)}
                </p>

                <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>

                  <span
                    className={`flex items-center gap-1 text-xs ${
                      stat.positive ? 'text-success' : 'text-warning'
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {tr(stat.change)}
                  </span>
                </div>
              </div>
            )
          })}
        </section>

        {/* Charts */}
        <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Productivity chart */}
          <div className="rounded-2xl border border-border bg-surface p-5 md:p-6 xl:col-span-2">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  {tr('Productivity Overview')}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {tr('Your weekly task activity')}
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-xs text-text-secondary transition hover:text-text-primary"
              >
                {tr('This week')}
              </button>
            </div>

            <div className="mb-5 flex flex-wrap gap-5">
              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                {tr('Completed tasks')}
              </span>

              <span className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                {tr('Created tasks')}
              </span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={localizedActivityData}>
                  <defs>
                    <linearGradient
                      id="completedGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#7655E8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#7655E8" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="createdGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#263249"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: '#151D32',
                      border: '1px solid #263249',
                      borderRadius: 12,
                      color: '#F8FAFC',
                    }}
                    labelStyle={{ color: '#94A3B8' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#7655E8"
                    strokeWidth={2.5}
                    fill="url(#completedGradient)"
                  />

                  <Area
                    type="monotone"
                    dataKey="created"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    fill="url(#createdGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task distribution */}
          <div className="rounded-2xl border border-border bg-surface p-5 md:p-6">
            <div className="mb-2">
              <h2 className="text-lg font-semibold">
                {tr('Task Distribution')}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {tr('Overview of all tasks')}
              </p>
            </div>

            <div className="relative mx-auto h-[220px] max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={localizedProgressData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={67}
                    outerRadius={88}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {localizedProgressData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: '#151D32',
                      border: '1px solid #263249',
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">66</span>
                <span className="text-xs text-text-secondary">
                  {tr('Total tasks')}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-4">
              {localizedProgressData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm text-text-secondary">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>

                  <span className="text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent tasks and weekly goal */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Recent tasks */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  {tr('Recent Tasks')}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {tr('Keep track of your latest work')}
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
              >
                <Plus size={15} />
                {tr('New Task')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-border text-xs text-text-secondary">
                    <th className="px-5 py-4 font-medium">
                      {tr('Task')}
                    </th>

                    <th className="px-4 py-4 font-medium">
                      {tr('Due date')}
                    </th>

                    <th className="px-4 py-4 font-medium">
                      {tr('Priority')}
                    </th>

                    <th className="px-4 py-4 font-medium">
                      {tr('Status')}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr
                      key={task.title}
                      className="border-b border-border/60 transition hover:bg-surface-hover/50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">
                          {tr(task.title)}
                        </p>

                        <p className="mt-1 text-xs text-text-secondary">
                          {tr(task.project)}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-xs text-text-secondary">
                        {tr(task.date)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-medium ${task.color}`}
                        >
                          {tr(task.priority)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-xs text-text-secondary">
                          {tr(task.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 py-4 text-sm font-medium text-accent transition hover:text-text-primary"
            >
              {tr('View all tasks')}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Weekly goal */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {tr('Weekly Goal')}
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  {tr('Your productivity target')}
                </p>
              </div>

              <TrendingUp size={20} className="text-success" />
            </div>

            <div className="mb-5 rounded-xl bg-background p-4">
              <p className="text-sm text-text-secondary">
                {tr('Tasks completed')}
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold">24</span>
                <span className="mb-1 text-sm text-text-secondary">
                  / 30 {tr('tasks')}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-hover">
                <div className="h-full w-[80%] rounded-full bg-primary" />
              </div>

              <p className="mt-3 text-xs text-success">
                {tr('80% of your weekly goal achieved')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
                  <CalendarDays size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {tr('Stay consistent')}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {tr('4 active days this week')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2.5 text-success">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {tr('Great progress')}
                  </p>

                  <p className="text-xs text-text-secondary">
                    {tr('6 tasks left to reach your goal')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-5 text-xs text-text-secondary">
          <span>{tr('TaskPro Workspace')}</span>
          <span>{tr('Personal productivity, organized.')}</span>
        </footer>
      </main>
    </div>
  )
}

export default Dashboard