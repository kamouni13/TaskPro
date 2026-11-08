
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  CheckCircle2,
  Clock3,
  CircleDot,
  AlertTriangle,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  ListTodo,
  FolderKanban,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'

const initialTasks = [
  {
    id: 1,
    title: 'Complete dashboard design',
    description: 'Finish the main dashboard interface and charts.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-11-12',
  },
  {
    id: 2,
    title: 'Create projects management',
    description: 'Build project creation, editing and filtering.',
    status: 'Completed',
    priority: 'Medium',
    dueDate: '2026-11-05',
  },
  {
    id: 3,
    title: 'Prepare calendar interface',
    description: 'Design the calendar and task scheduling system.',
    status: 'To Do',
    priority: 'Urgent',
    dueDate: '2026-11-20',
  },
  {
    id: 4,
    title: 'Review application layout',
    description: 'Check responsive design and navigation.',
    status: 'Review',
    priority: 'Low',
    dueDate: '2026-11-15',
  },
]

const emptyForm = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: '',
  projectId: '',
}

const statusStyles = {
  'To Do': 'bg-surface-hover text-text-secondary',
  'In Progress': 'bg-primary/10 text-primary',
  Review: 'bg-warning/10 text-warning',
  Completed: 'bg-success/10 text-success',
}

const priorityStyles = {
  Low: 'bg-surface-hover text-text-secondary',
  Medium: 'bg-primary/10 text-primary',
  High: 'bg-warning/10 text-warning',
  Urgent: 'bg-danger/10 text-danger',
}

const translations = {
  fr: {
    workspace: 'Espace de travail',
    tasks: 'Tâches',
    myTasks: 'Mes tâches',
    description: 'Organisez et suivez toutes vos tâches en un seul endroit.',
    newTask: 'Nouvelle tâche',
    totalTasks: 'Total des tâches',
    inProgress: 'En cours',
    completed: 'Terminées',
    pending: 'À faire',
    search: 'Rechercher des tâches...',
    allTasks: 'Toutes les tâches',
    todo: 'À faire',
    review: 'En révision',
    noTasks: 'Aucune tâche trouvée',
    noTasksDescription: 'Essayez une autre recherche ou créez une nouvelle tâche.',
    createTask: 'Créer une tâche',
    editTask: 'Modifier la tâche',
    deleteTask: 'Supprimer la tâche',
    deleteConfirmation: 'Voulez-vous vraiment supprimer cette tâche ?',
    taskTitle: 'Titre de la tâche',
    taskDescription: 'Description',
    enterTitle: 'Saisissez le titre de la tâche',
    enterDescription: 'Décrivez votre tâche...',
    status: 'Statut',
    priority: 'Priorité',
    dueDate: 'Date limite',
    cancel: 'Annuler',
    saveChanges: 'Enregistrer les modifications',
    create: 'Créer',
    taskCreated: 'Tâche créée',
    noDeadline: 'Aucune date limite',
    tasksFound: 'tâches trouvées',
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Élevée',
    urgent: 'Urgente',
    relatedProject: 'Projet associé',
    noProject: 'Aucun projet',
  },
}

function normalizeTask(task) {
  const rawDate = task.due_date || task.dueDate || ''

  return {
    id: task.id,
    title: task.title || '',
    description: task.description || '',
    status: task.status || 'To Do',
    priority: task.priority || 'Medium',
    dueDate: rawDate ? String(rawDate).slice(0, 10) : '',
    projectId: task.project_id ?? task.projectId ?? '',
    projectName: task.project?.name || task.projectName || '',
  }
}

function toApiPayload(task) {
  return {
    project_id: task.projectId ? Number(task.projectId) : null,
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority,
    due_date: task.dueDate || null,
  }
}

function Tasks() {
  const { language } = useLanguage()
  const tr = (key) => translations[language]?.[key] || key

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskpro-tasks')
      return saved ? JSON.parse(saved) : initialTasks
    } catch {
      return initialTasks
    }
  })

  const [projects, setProjects] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskpro-projects')) || []
    } catch {
      return []
    }
  })

  const [apiAvailable, setApiAvailable] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Load tasks from Laravel API.
  useEffect(() => {
    let active = true

    async function loadTasks() {
      if (!api) {
        setApiAvailable(false)
        return
      }

      try {
        const response = await api.get('/tasks')

        if (active) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data.data || []

          setTasks(data.map(normalizeTask))
          setApiAvailable(true)
        }
      } catch (error) {
        console.error('Failed to load tasks from API:', error)

        if (active) {
          setApiAvailable(false)
        }
      }
    }

    loadTasks()

    return () => {
      active = false
    }
  }, [])

  // Load projects from Laravel API.
  useEffect(() => {
    let active = true

    async function loadProjects() {
      if (!api) return

      try {
        const response = await api.get('/projects')

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || []

        if (active) {
          setProjects(data)
          localStorage.setItem('taskpro-projects', JSON.stringify(data))
        }
      } catch (error) {
        console.error('Failed to load projects:', error)
      }
    }

    loadProjects()

    return () => {
      active = false
    }
  }, [])

  // Synchronize tasks with LocalStorage.
  useEffect(() => {
    localStorage.setItem('taskpro-tasks', JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description || '').toLowerCase().includes(search.toLowerCase())

      const matchesFilter = filter === 'All' || task.status === filter

      return matchesSearch && matchesFilter
    })
  }, [tasks, search, filter])

  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  const inProgressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const pendingCount = tasks.filter(
    (task) => task.status === 'To Do'
  ).length

  const statusLabels = {
    'To Do': tr('todo'),
    'In Progress': tr('inProgress'),
    Review: tr('review'),
    Completed: tr('completed'),
  }

  const priorityLabels = {
    Low: tr('low'),
    Medium: tr('medium'),
    High: tr('high'),
    Urgent: tr('urgent'),
  }

  function getProjectName(task) {
    return (
      task.projectName ||
      projects.find(
        (project) => String(project.id) === String(task.projectId)
      )?.name ||
      ''
    )
  }

  function openCreateModal() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEditModal(task) {
    setEditingId(task.id)

    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      projectId: task.projectId || '',
    })

    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const taskData = { ...form }

    try {
      if (api && apiAvailable !== false) {
        if (editingId !== null) {
          const response = await api.put(
            `/tasks/${editingId}`,
            toApiPayload(taskData)
          )

          const updatedTask = normalizeTask(response.data)

          setTasks((current) =>
            current.map((task) =>
              task.id === editingId ? updatedTask : task
            )
          )
        } else {
          const response = await api.post(
            '/tasks',
            toApiPayload(taskData)
          )

          const newTask = normalizeTask(response.data)

          setTasks((current) => [newTask, ...current])
        }

        setApiAvailable(true)
      } else {
        const selectedProject = projects.find(
          (project) => String(project.id) === String(taskData.projectId)
        )

        if (editingId !== null) {
          setTasks((current) =>
            current.map((task) =>
              task.id === editingId
                ? {
                    ...task,
                    ...taskData,
                    projectName: selectedProject?.name || '',
                  }
                : task
            )
          )
        } else {
          setTasks((current) => [
            {
              id: Date.now(),
              ...taskData,
              projectName: selectedProject?.name || '',
            },
            ...current,
          ])
        }
      }

      setModalOpen(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (error) {
      console.error('Failed to save task through API:', error)

      setApiAvailable(false)

      const selectedProject = projects.find(
        (project) => String(project.id) === String(taskData.projectId)
      )

      if (editingId !== null) {
        setTasks((current) =>
          current.map((task) =>
            task.id === editingId
              ? {
                  ...task,
                  ...taskData,
                  projectName: selectedProject?.name || '',
                }
              : task
          )
        )
      } else {
        setTasks((current) => [
          {
            id: Date.now(),
            ...taskData,
            projectName: selectedProject?.name || '',
          },
          ...current,
        ])
      }

      setModalOpen(false)
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  async function deleteTask(id) {
    const message = language === 'fr'
      ? 'Voulez-vous vraiment supprimer cette tâche ?'
      : 'Are you sure you want to delete this task?'

    if (!window.confirm(message)) return

    try {
      if (api && apiAvailable !== false) {
        await api.delete(`/tasks/${id}`)
        setApiAvailable(true)
      }

      setTasks((current) => current.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Failed to delete task through API:', error)

      setApiAvailable(false)
      setTasks((current) => current.filter((task) => task.id !== id))
    }
  }

  const stats = [
    { label: tr('totalTasks'), value: tasks.length, icon: ListTodo },
    { label: tr('inProgress'), value: inProgressCount, icon: Clock3 },
    { label: tr('completed'), value: completedCount, icon: CheckCircle2 },
  ]

  const locale = language === 'fr' ? 'fr-FR' : 'en-US'

  return (
    <main className="min-w-0 px-5 py-7 md:px-8 md:py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-text-secondary">
            {tr('workspace')} / {tr('tasks')}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            {tr('myTasks')}
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            {tr('description')}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Plus size={18} />
          {tr('newTask')}
        </button>
      </div>

      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  {stat.label}
                </span>

                <span className="rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon size={19} />
                </span>
              </div>

              <p className="text-3xl font-bold text-text-primary">
                {stat.value}
              </p>
            </motion.div>
          )
        })}
      </section>

      <section className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <Search size={19} className="text-text-secondary" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tr('search')}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
        >
          <option value="All">{tr('allTasks')}</option>
          <option value="To Do">{tr('todo')}</option>
          <option value="In Progress">{tr('inProgress')}</option>
          <option value="Review">{tr('review')}</option>
          <option value="Completed">{tr('completed')}</option>
        </select>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">
          {tr('allTasks')}
        </h2>

        <span className="text-xs text-text-secondary">
          {filteredTasks.length} {tr('tasksFound')}
        </span>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-5 py-16 text-center">
          <ListTodo size={38} className="mx-auto mb-4 text-text-secondary" />

          <h3 className="font-semibold text-text-primary">
            {tr('noTasks')}
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            {tr('noTasksDescription')}
          </p>

          <button
            onClick={openCreateModal}
            className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            {tr('createTask')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.article
                key={task.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl border border-border bg-surface p-5 transition hover:border-primary/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div className="mt-1 text-primary">
                      {task.status === 'Completed' ? (
                        <CheckCircle2 size={21} />
                      ) : task.priority === 'Urgent' ? (
                        <AlertTriangle size={21} />
                      ) : (
                        <CircleDot size={21} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-semibold text-text-primary ${
                          task.status === 'Completed'
                            ? 'line-through opacity-60'
                            : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        {task.description}
                      </p>

                      {getProjectName(task) && (
                        <p className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                          <FolderKanban size={14} />
                          {getProjectName(task)}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[task.status]}`}
                        >
                          {statusLabels[task.status]}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}
                        >
                          {priorityLabels[task.priority]}
                        </span>

                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <CalendarDays size={14} />
                            {new Date(
                              `${task.dueDate}T00:00:00`
                            ).toLocaleDateString(locale)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      title={tr('editTask')}
                      aria-label={tr('editTask')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      title={tr('deleteTask')}
                      aria-label={tr('deleteTask')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="mt-5 text-xs text-text-secondary">
        {tr('pending')}: {pendingCount}
      </p>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setModalOpen(false)
              }
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.form
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              onSubmit={handleSubmit}
              className="my-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    {editingId !== null ? tr('editTask') : tr('newTask')}
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    {tr('description')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('taskTitle')} *
                  </label>

                  <input
                    required
                    maxLength={100}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder={tr('enterTitle')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('taskDescription')}
                  </label>

                  <textarea
                    rows={3}
                    maxLength={500}
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    placeholder={tr('enterDescription')}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>

                {/* Related Project */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {language === 'fr'
                      ? tr('relatedProject')
                      : 'Related Project'}
                  </label>

                  <select
                    value={form.projectId}
                    onChange={(event) =>
                      setForm({ ...form, projectId: event.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  >
                    <option value="">
                      {language === 'fr'
                        ? tr('noProject')
                        : 'No project'}
                    </option>

                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      {tr('status')}
                    </label>

                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm({ ...form, status: event.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text-primary outline-none focus:border-primary"
                    >
                      <option value="To Do">{tr('todo')}</option>
                      <option value="In Progress">{tr('inProgress')}</option>
                      <option value="Review">{tr('review')}</option>
                      <option value="Completed">{tr('completed')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-text-primary">
                      {tr('priority')}
                    </label>

                    <select
                      value={form.priority}
                      onChange={(event) =>
                        setForm({ ...form, priority: event.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm text-text-primary outline-none focus:border-primary"
                    >
                      <option value="Low">{tr('low')}</option>
                      <option value="Medium">{tr('medium')}</option>
                      <option value="High">{tr('high')}</option>
                      <option value="Urgent">{tr('urgent')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('dueDate')}
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({ ...form, dueDate: event.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-7 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-hover"
                >
                  {tr('cancel')}
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  {editingId !== null
                    ? tr('saveChanges')
                    : tr('create')}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Tasks
