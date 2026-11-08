
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  ArrowUpRight,
  FolderKanban,
  CheckCircle2,
  Clock3,
  ListTodo,
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
import api from '../services/api'

const PROJECTS_KEY = 'taskpro-projects'
const TASKS_KEY = 'taskpro-tasks'

const COLORS = {
  completed: '#22C55E',
  progress: '#7655E8',
  todo: '#38BDF8',
  review: '#F59E0B',
}

const readLocalData = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

const normalizeProject = (project) => ({
  ...project,
  dueDate: project.due_date ?? project.dueDate ?? null,
  progress: Number(project.progress ?? 0),
})

const normalizeTask = (task) => ({
  ...task,
  projectId:
    task.project_id ??
    task.projectId ??
    task.project?.id ??
    null,
  dueDate: task.due_date ?? task.dueDate ?? null,
  createdAt: task.created_at ?? task.createdAt ?? null,
})

const getDate = (value) => {
  if (!value) return null

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? `${value}T00:00:00`
      : value,
  )

  return Number.isNaN(date.getTime()) ? null : date
}

const formatDate = (value, language) => {
  const date = getDate(value)

  if (!date) return '—'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const taskDate = new Date(date)
  taskDate.setHours(0, 0, 0, 0)

  if (taskDate.getTime() === today.getTime()) {
    return language === 'fr' ? "Aujourd'hui" : 'Today'
  }

  if (taskDate.getTime() === tomorrow.getTime()) {
    return language === 'fr' ? 'Demain' : 'Tomorrow'
  }

  return new Intl.DateTimeFormat(
    language === 'fr' ? 'fr-FR' : 'en-US',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(date)
}

function Dashboard() {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const translations = {
    'Total Projects': 'Total des projets',
    'Completed Tasks': 'Tâches terminées',
    'Pending Tasks': 'Tâches en attente',
    'Total Tasks': 'Total des tâches',
    'Productivity Overview': 'Progression des projets',
    'Your weekly task activity': 'Progression réelle de vos projets',
    'This week': 'Projets',
    'Project Progress': 'Progression',
    'Task Distribution': 'Répartition des tâches',
    'Overview of all tasks': 'État réel de toutes les tâches',
    Completed: 'Terminées',
    'In Progress': 'En cours',
    'To Do': 'À faire',
    Review: 'En révision',
    'Total tasks': 'Total des tâches',
    'Recent Tasks': 'Tâches récentes',
    'Keep track of your latest work': 'Suivez vos dernières activités',
    'New Task': 'Nouvelle tâche',
    Task: 'Tâche',
    Project: 'Projet',
    'Due date': 'Date limite',
    Priority: 'Priorité',
    Status: 'Statut',
    High: 'Élevée',
    Urgent: 'Urgente',
    Medium: 'Moyenne',
    Low: 'Faible',
    'View all tasks': 'Voir toutes les tâches',
    'Project Overview': 'Aperçu des projets',
    'Your projects at a glance': 'Résumé de vos projets',
    'Active Projects': 'Projets actifs',
    'Completed Projects': 'Projets terminés',
    'Overall Completion': 'Progression globale',
    'No projects yet': 'Aucun projet pour le moment',
    'No tasks yet': 'Aucune tâche pour le moment',
    'No project': 'Sans projet',
    'No due date': 'Sans date limite',
    'Loading dashboard...': 'Chargement du tableau de bord...',
    'Could not load data': 'Impossible de charger les données',
    'TaskPro Workspace': 'Espace de travail TaskPro',
    'Personal productivity, organized.': 'Votre productivité personnelle, organisée.',
  }

  const tr = (value) =>
    language === 'fr' ? translations[value] || value : value

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      setLoading(true)

      let projectsData = readLocalData(PROJECTS_KEY)
      let tasksData = readLocalData(TASKS_KEY)

      if (api) {
        try {
          const [projectsResponse, tasksResponse] = await Promise.all([
            api.get('/projects'),
            api.get('/tasks'),
          ])

          projectsData = Array.isArray(projectsResponse.data)
            ? projectsResponse.data
            : projectsResponse.data?.data || []

          tasksData = Array.isArray(tasksResponse.data)
            ? tasksResponse.data
            : tasksResponse.data?.data || []
        } catch (error) {
          console.error('Dashboard API error:', error)
          // Use LocalStorage if the API is unavailable.
        }
      }

      if (!active) return

      setProjects(projectsData.map(normalizeProject))
      setTasks(tasksData.map(normalizeTask))
      setLoading(false)
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [])

  const statistics = useMemo(() => {
    const totalProjects = projects.length
    const totalTasks = tasks.length

    const completedTasks = tasks.filter(
      (task) => task.status === 'Completed',
    ).length

    const pendingTasks = tasks.filter(
      (task) => task.status === 'To Do',
    ).length

    const activeProjects = projects.filter(
      (project) => project.status === 'In Progress',
    ).length

    const completedProjects = projects.filter(
      (project) => project.status === 'Completed',
    ).length

    const completionRate =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      activeProjects,
      completedProjects,
      completionRate,
    }
  }, [projects, tasks])

  const progressData = useMemo(() => {
    const statuses = [
      { name: 'Completed', color: COLORS.completed },
      { name: 'In Progress', color: COLORS.progress },
      { name: 'Review', color: COLORS.review },
      { name: 'To Do', color: COLORS.todo },
    ]

    return statuses.map((status) => ({
      ...status,
      value: tasks.filter(
        (task) => task.status === status.name,
      ).length,
    }))
  }, [tasks])

  const projectChartData = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) =>
          String(task.projectId) === String(project.id),
      )

      const completed = projectTasks.filter(
        (task) => task.status === 'Completed',
      ).length

      const progress =
        projectTasks.length > 0
          ? Math.round((completed / projectTasks.length) * 100)
          : 0

      return {
        name: project.name,
        progress,
      }
    })
  }, [projects, tasks])

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => {
        const dateA = getDate(a.createdAt)?.getTime() || 0
        const dateB = getDate(b.createdAt)?.getTime() || 0

        if (dateA !== dateB) return dateB - dateA

        return Number(b.id || 0) - Number(a.id || 0)
      })
      .slice(0, 5)
  }, [tasks])

  const getProjectName = (task) => {
    if (task.project?.name) return task.project.name

    const project = projects.find(
      (item) => String(item.id) === String(task.projectId),
    )

    return project?.name || tr('No project')
  }

  const getPriorityClass = (priority) => {
    const classes = {
      Urgent: 'text-danger bg-danger/10',
      High: 'text-warning bg-warning/10',
      Medium: 'text-accent bg-accent/10',
      Low: 'text-success bg-success/10',
    }

    return classes[priority] || 'text-text-secondary bg-background'
  }

  const getStatusClass = (status) => {
    const classes = {
      Completed: 'text-success',
      'In Progress': 'text-primary',
      Review: 'text-warning',
      'To Do': 'text-accent',
    }

    return classes[status] || 'text-text-secondary'
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: statistics.totalProjects,
      icon: FolderKanban,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Completed Tasks',
      value: statistics.completedTasks,
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Pending Tasks',
      value: statistics.pendingTasks,
      icon: Clock3,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Total Tasks',
      value: statistics.totalTasks,
      icon: ListTodo,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-sm text-text-secondary">
        {tr('Loading dashboard...')}
      </div>
    )
  }

  return (
    <div className="w-full min-w-0">
      <main className="min-w-0 flex-1 px-5 py-6 md:px-8 md:py-8">

        {/* Quick overview */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
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
                  <ArrowUpRight
                    size={18}
                    className="text-text-secondary"
                  />
                </div>

                <p className="text-sm text-text-secondary">
                  {tr(stat.title)}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {stat.value}
                </h2>
              </div>
            )
          })}
        </section>

        {/* Charts */}
        <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Project progress */}
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
                onClick={() => navigate('/projects')}
                className="rounded-lg border border-border px-3 py-2 text-xs text-text-secondary transition hover:text-text-primary"
              >
                {tr('This week')}
              </button>
            </div>

            {projectChartData.length > 0 ? (
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectChartData}>
                    <defs>
                      <linearGradient
                        id="projectProgressGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#7655E8"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#7655E8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#263249"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 11 }}
                      dy={10}
                    />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94A3B8', fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />

                    <Tooltip
                      formatter={(value) => [`${value}%`, tr('Project Progress')]}
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
                      dataKey="progress"
                      stroke="#7655E8"
                      strokeWidth={2.5}
                      fill="url(#projectProgressGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-[260px] flex-col items-center justify-center text-center">
                <FolderKanban
                  size={34}
                  className="mb-3 text-text-secondary"
                />
                <p className="text-sm text-text-secondary">
                  {tr('No projects yet')}
                </p>
              </div>
            )}
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
              {statistics.totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData.filter((item) => item.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={67}
                      outerRadius={88}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {progressData
                        .filter((item) => item.value > 0)
                        .map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />
                        ))}
                    </Pie>

                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        tr(name),
                      ]}
                      contentStyle={{
                        background: '#151D32',
                        border: '1px solid #263249',
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ListTodo
                    size={36}
                    className="text-text-secondary"
                  />
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">
                  {statistics.totalTasks}
                </span>
                <span className="text-xs text-text-secondary">
                  {tr('Total tasks')}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-4">
              {progressData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-sm text-text-secondary">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {tr(item.name)}
                  </span>

                  <span className="text-sm font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent tasks and project overview */}
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
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
              >
                <Plus size={15} />
                {tr('New Task')}
              </button>
            </div>

            {recentTasks.length > 0 ? (
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
                    {recentTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="border-b border-border/60 transition hover:bg-surface-hover/50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium">
                            {task.title}
                          </p>
                          <p className="mt-1 text-xs text-text-secondary">
                            {getProjectName(task)}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-xs text-text-secondary">
                          {task.dueDate
                            ? formatDate(task.dueDate, language)
                            : tr('No due date')}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-md px-2 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}
                          >
                            {tr(task.priority || 'Medium')}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`text-xs font-medium ${getStatusClass(task.status)}`}
                          >
                            {tr(task.status || 'To Do')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                <ListTodo
                  size={32}
                  className="mb-3 text-text-secondary"
                />
                <p className="text-sm text-text-secondary">
                  {tr('No tasks yet')}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex w-full items-center justify-center gap-2 py-4 text-sm font-medium text-accent transition hover:text-text-primary"
            >
              {tr('View all tasks')}
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Project overview */}
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {tr('Project Overview')}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">
                  {tr('Your projects at a glance')}
                </p>
              </div>

              <TrendingUp
                size={20}
                className="text-success"
              />
            </div>

            <div className="mb-5 rounded-xl bg-background p-4">
              <p className="text-sm text-text-secondary">
                {tr('Overall Completion')}
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-3xl font-bold">
                  {statistics.completionRate}%
                </span>
                <span className="mb-1 text-sm text-text-secondary">
                  {statistics.completedTasks}/{statistics.totalTasks}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-hover">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: `${statistics.completionRate}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {tr('Active Projects')}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {statistics.activeProjects}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2.5 text-success">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {tr('Completed Projects')}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {statistics.completedProjects}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-2.5 text-warning">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {tr('Total Projects')}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {statistics.totalProjects}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-text-secondary transition hover:border-primary/40 hover:text-text-primary"
            >
              {tr('View all tasks')}
              <ArrowRight size={16} />
            </button>
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
