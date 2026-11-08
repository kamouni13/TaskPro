import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FolderKanban,
  ListTodo,
  TrendingUp,
  Target,
  RefreshCw,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useLanguage } from '../context/LanguageContext'

const TASKS_KEY = 'taskpro-tasks'
const PROJECTS_KEY = 'taskpro-projects'

const COLORS = ['#7655E8', '#38BDF8', '#F59E0B', '#22C55E']
const PRIORITY_COLORS = {
  Low: '#38BDF8',
  Medium: '#22C55E',
  High: '#F59E0B',
  Urgent: '#EF4444',
}

const translations = {
  en: {
    title: 'Statistics & Analytics',
    subtitle: 'Track your productivity and monitor your progress.',
    refresh: 'Refresh',
    tasksOverview: 'Tasks Overview',
    projectsOverview: 'Projects Overview',
    totalTasks: 'Total Tasks',
    completedTasks: 'Completed Tasks',
    inProgress: 'In Progress',
    overdueTasks: 'Overdue Tasks',
    totalProjects: 'Total Projects',
    completedProjects: 'Completed Projects',
    activeProjects: 'Active Projects',
    averageProgress: 'Average Progress',
    taskStatus: 'Tasks by Status',
    taskPriority: 'Tasks by Priority',
    projectStatus: 'Projects by Status',
    projectProgress: 'Project Progress',
    completionRate: 'Task Completion Rate',
    completed: 'Completed',
    todo: 'To Do',
    review: 'Review',
    onHold: 'On Hold',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
    noTasks: 'No tasks yet',
    noProjects: 'No projects yet',
    noData: 'Add some tasks or projects to see your statistics.',
    productivity: 'Productivity Summary',
    taskCompletion: 'Task completion',
    projectCompletion: 'Project completion',
    overdueDescription: 'Tasks past their due date',
    updated: 'Statistics are based on your saved data.',
    noDueDate: 'No due date',
  },
  fr: {
    title: 'Statistiques et analyses',
    subtitle: 'Suivez votre productivité et mesurez vos progrès.',
    refresh: 'Actualiser',
    tasksOverview: 'Aperçu des tâches',
    projectsOverview: 'Aperçu des projets',
    totalTasks: 'Total des tâches',
    completedTasks: 'Tâches terminées',
    inProgress: 'En cours',
    overdueTasks: 'Tâches en retard',
    totalProjects: 'Total des projets',
    completedProjects: 'Projets terminés',
    activeProjects: 'Projets actifs',
    averageProgress: 'Progression moyenne',
    taskStatus: 'Tâches par statut',
    taskPriority: 'Tâches par priorité',
    projectStatus: 'Projets par statut',
    projectProgress: 'Progression des projets',
    completionRate: 'Taux de réalisation des tâches',
    completed: 'Terminées',
    todo: 'À faire',
    review: 'En révision',
    onHold: 'En pause',
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
    urgent: 'Urgente',
    noTasks: 'Aucune tâche',
    noProjects: 'Aucun projet',
    noData: 'Ajoutez des tâches ou des projets pour voir vos statistiques.',
    productivity: 'Résumé de productivité',
    taskCompletion: 'Réalisation des tâches',
    projectCompletion: 'Réalisation des projets',
    overdueDescription: 'Tâches dont la date limite est dépassée',
    updated: 'Statistiques basées sur vos données enregistrées.',
    noDueDate: 'Sans date limite',
  },
}

function readStorage(key) {
  try {
    const saved = localStorage.getItem(key)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function StatCard({ title, value, subtitle, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-text-primary">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-2 text-xs text-text-secondary">{subtitle}</p>
          )}
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  )
}

function ChartCard({ title, children, empty, emptyText }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-5 text-base font-semibold text-text-primary">
        {title}
      </h3>

      {empty ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <BarChart3 size={34} className="mb-3 text-text-secondary/50" />
          <p className="text-sm text-text-secondary">{emptyText}</p>
        </div>
      ) : (
        <div className="h-64 w-full">{children}</div>
      )}
    </section>
  )
}

export default function Statistics() {
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  const [tasks, setTasks] = useState(() => readStorage(TASKS_KEY))
  const [projects, setProjects] = useState(() => readStorage(PROJECTS_KEY))

  const refreshData = () => {
    setTasks(readStorage(TASKS_KEY))
    setProjects(readStorage(PROJECTS_KEY))
  }

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || event.key === TASKS_KEY || event.key === PROJECTS_KEY) {
        refreshData()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('focus', refreshData)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('focus', refreshData)
    }
  }, [])

  const metrics = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')

    const completedTasks = tasks.filter(
      (task) => task.status === 'Completed',
    ).length

    const inProgressTasks = tasks.filter(
      (task) => task.status === 'In Progress',
    ).length

    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== 'Completed' &&
        task.dueDate &&
        task.dueDate < todayString,
    ).length

    const completedProjects = projects.filter(
      (project) => project.status === 'Completed',
    ).length

    const activeProjects = projects.filter(
      (project) => project.status === 'In Progress',
    ).length

    const averageProgress = projects.length
      ? Math.round(
          projects.reduce(
            (total, project) =>
              total + Math.min(100, Math.max(0, Number(project.progress) || 0)),
            0,
          ) / projects.length,
        )
      : 0

    return {
      totalTasks: tasks.length,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      taskRate: tasks.length
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0,
      totalProjects: projects.length,
      completedProjects,
      activeProjects,
      averageProgress,
      projectRate: projects.length
        ? Math.round((completedProjects / projects.length) * 100)
        : 0,
    }
  }, [tasks, projects])

  const taskStatusData = [
    {
      name: t.todo,
      value: tasks.filter((task) => task.status === 'To Do').length,
    },
    {
      name: t.inProgress,
      value: tasks.filter((task) => task.status === 'In Progress').length,
    },
    {
      name: t.review,
      value: tasks.filter((task) => task.status === 'Review').length,
    },
    {
      name: t.completed,
      value: tasks.filter((task) => task.status === 'Completed').length,
    },
  ]

  const priorityData = [
    { name: t.low, value: tasks.filter((task) => task.priority === 'Low').length, fill: PRIORITY_COLORS.Low },
    { name: t.medium, value: tasks.filter((task) => task.priority === 'Medium').length, fill: PRIORITY_COLORS.Medium },
    { name: t.high, value: tasks.filter((task) => task.priority === 'High').length, fill: PRIORITY_COLORS.High },
    { name: t.urgent, value: tasks.filter((task) => task.priority === 'Urgent').length, fill: PRIORITY_COLORS.Urgent },
  ]

  const projectStatusData = [
    {
      name: t.inProgress,
      value: projects.filter((project) => project.status === 'In Progress').length,
    },
    {
      name: t.completed,
      value: projects.filter((project) => project.status === 'Completed').length,
    },
    {
      name: t.onHold,
      value: projects.filter((project) => project.status === 'On Hold').length,
    },
  ]

  const projectProgressData = projects.map((project) => ({
    name:
      project.name?.length > 16
        ? `${project.name.slice(0, 16)}…`
        : project.name || 'Project',
    progress: Math.min(100, Math.max(0, Number(project.progress) || 0)),
  }))

  const chartText = {
    fill: 'var(--color-text-secondary, #94A3B8)',
    fontSize: 11,
  }

  const tooltipStyle = {
    backgroundColor: 'var(--color-surface, #151D32)',
    border: '1px solid var(--color-border, #263249)',
    borderRadius: '12px',
    color: 'var(--color-text-primary, #F8FAFC)',
  }

  return (
    <main className="space-y-7 pb-10">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <BarChart3 size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              TaskPro Analytics
            </span>
          </div>

          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">{t.subtitle}</p>
        </div>

        <button
          onClick={refreshData}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-primary transition hover:border-primary hover:text-primary sm:self-auto"
        >
          <RefreshCw size={16} />
          {t.refresh}
        </button>
      </div>

      {/* Tasks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ListTodo size={19} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">
            {t.tasksOverview}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t.totalTasks}
            value={metrics.totalTasks}
            icon={ListTodo}
            color="bg-primary/10 text-primary"
            delay={0.05}
          />
          <StatCard
            title={t.completedTasks}
            value={metrics.completedTasks}
            subtitle={`${metrics.taskRate}% ${t.completionRate}`}
            icon={CheckCircle2}
            color="bg-green-500/10 text-green-500"
            delay={0.1}
          />
          <StatCard
            title={t.inProgress}
            value={metrics.inProgressTasks}
            icon={Clock3}
            color="bg-sky-500/10 text-sky-500"
            delay={0.15}
          />
          <StatCard
            title={t.overdueTasks}
            value={metrics.overdueTasks}
            subtitle={t.overdueDescription}
            icon={AlertTriangle}
            color="bg-red-500/10 text-red-500"
            delay={0.2}
          />
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban size={19} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">
            {t.projectsOverview}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={t.totalProjects}
            value={metrics.totalProjects}
            icon={FolderKanban}
            color="bg-primary/10 text-primary"
            delay={0.05}
          />
          <StatCard
            title={t.completedProjects}
            value={metrics.completedProjects}
            icon={CheckCircle2}
            color="bg-green-500/10 text-green-500"
            delay={0.1}
          />
          <StatCard
            title={t.activeProjects}
            value={metrics.activeProjects}
            icon={TrendingUp}
            color="bg-sky-500/10 text-sky-500"
            delay={0.15}
          />
          <StatCard
            title={t.averageProgress}
            value={`${metrics.averageProgress}%`}
            icon={Target}
            color="bg-amber-500/10 text-amber-500"
            delay={0.2}
          />
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={19} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">
            {t.productivity}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ChartCard
            title={t.taskStatus}
            empty={tasks.length === 0}
            emptyText={t.noTasks}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #263249)" vertical={false} />
                <XAxis dataKey="name" tick={chartText} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={chartText} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(118,85,232,0.08)' }} />
                <Bar dataKey="value" name={t.totalTasks} fill="#7655E8" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={t.taskPriority}
            empty={tasks.length === 0}
            emptyText={t.noTasks}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="46%"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {priorityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: 'var(--color-text-secondary, #94A3B8)', fontSize: 12 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={t.projectStatus}
            empty={projects.length === 0}
            emptyText={t.noProjects}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #263249)" vertical={false} />
                <XAxis dataKey="name" tick={chartText} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={chartText} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" name={t.totalProjects} fill="#38BDF8" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title={t.projectProgress}
            empty={projects.length === 0}
            emptyText={t.noProjects}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #263249)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={chartText} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={95} tick={chartText} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}%`, t.averageProgress]}
                />
                <Bar dataKey="progress" name={t.averageProgress} fill="#22C55E" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      {/* Completion summary */}
      <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="mb-6 text-lg font-semibold text-text-primary">
          {t.productivity}
        </h2>

        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {t.taskCompletion}
              </span>
              <span className="text-sm font-bold text-text-primary">
                {metrics.taskRate}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.taskRate}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              {metrics.completedTasks} / {metrics.totalTasks} {t.completed.toLowerCase()}
            </p>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {t.projectCompletion}
              </span>
              <span className="text-sm font-bold text-text-primary">
                {metrics.projectRate}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-background">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.projectRate}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-sky-500"
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              {metrics.completedProjects} / {metrics.totalProjects} {t.completed.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-text-secondary">
        {t.updated}
      </p>
    </main>
  )
}