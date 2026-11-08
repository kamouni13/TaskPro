
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import {
  FolderKanban,
  Plus,
  Search,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  PauseCircle,
  Pencil,
  Trash2,
  X,
  ListTodo,
  CheckCheck,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const initialProjects = [
  {
    id: 1,
    name: 'TaskPro Platform',
    description: 'Personal workspace and productivity management platform.',
    status: 'In Progress',
    progress: 0,
    tasksCount: 0,
    completedTasksCount: 0,
    dueDate: '2026-12-15',
  },
  {
    id: 2,
    name: 'Portfolio Website',
    description: 'Professional portfolio and personal projects showcase.',
    status: 'Completed',
    progress: 0,
    tasksCount: 0,
    completedTasksCount: 0,
    dueDate: '2026-10-25',
  },
  {
    id: 3,
    name: 'E-commerce Platform',
    description: 'Modern online store for home and living products.',
    status: 'On Hold',
    progress: 0,
    tasksCount: 0,
    completedTasksCount: 0,
    dueDate: '2027-01-20',
  },
]

const emptyForm = {
  name: '',
  description: '',
  status: 'In Progress',
  dueDate: '',
}

const statusStyles = {
  'In Progress': 'bg-primary/10 text-primary',
  Completed: 'bg-success/10 text-success',
  'On Hold': 'bg-warning/10 text-warning',
}

const translations = {
  fr: {
    workspace: 'Espace de travail',
    projects: 'Projets',
    myProjects: 'Mes projets',
    pageDescription: 'Organisez, suivez et gérez tous vos projets au même endroit.',
    newProject: 'Nouveau projet',
    totalProjects: 'Total des projets',
    inProgress: 'En cours',
    completed: 'Terminés',
    search: 'Rechercher des projets...',
    allProjects: 'Tous les projets',
    onHold: 'En pause',
    projectsFound: 'projets trouvés',
    noProjects: 'Aucun projet trouvé',
    noProjectsDescription: 'Essayez une autre recherche ou créez un nouveau projet.',
    createProject: 'Créer un projet',
    noDescription: 'Aucune description fournie.',
    projectProgress: 'Progression du projet',
    due: 'Échéance',
    noDeadline: 'Aucune date limite',
    editProject: 'Modifier le projet',
    deleteProject: 'Supprimer le projet',
    deleteConfirmation: 'Voulez-vous vraiment supprimer ce projet ?',
    createNewProject: 'Créer un nouveau projet',
    editDetails: 'Modifiez les informations de votre projet.',
    addDetails: 'Ajoutez les informations de votre projet.',
    projectName: 'Nom du projet',
    description: 'Description',
    status: 'Statut',
    dueDate: 'Date limite',
    enterProjectName: 'Saisissez le nom du projet',
    projectAbout: 'En quoi consiste ce projet ?',
    cancel: 'Annuler',
    saveChanges: 'Enregistrer les modifications',
    close: 'Fermer',
    statusInProgress: 'En cours',
    statusCompleted: 'Terminé',
    statusOnHold: 'En pause',
    tasks: 'Tâches',
    completedTasks: 'Terminées',
    noTasks: 'Aucune tâche associée',
  },
}

function normalizeProject(project) {
  return {
    ...project,
    description: project.description ?? '',
    progress: Number(project.progress ?? 0),
    tasksCount: Number(
      project.tasks_count ?? project.tasksCount ?? 0
    ),
    completedTasksCount: Number(
      project.completed_tasks_count ??
      project.completedTasksCount ??
      0
    ),
    dueDate: project.due_date
      ? String(project.due_date).slice(0, 10)
      : project.dueDate ?? '',
  }
}

function toApiPayload(project) {
  return {
    name: project.name,
    description: project.description || null,
    status: project.status,
    due_date: project.dueDate || null,
  }
}

function Projects() {
  const { language } = useLanguage()

  const tr = (text) => translations[language]?.[text] || text

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('taskpro-projects')
      return saved
        ? JSON.parse(saved).map(normalizeProject)
        : initialProjects
    } catch {
      return initialProjects
    }
  })

  const [apiAvailable, setApiAvailable] = useState(api ? null : false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Load projects and their task statistics from Laravel
  useEffect(() => {
    if (!api) return

    let cancelled = false

    api.get('/projects')
      .then(({ data }) => {
        if (!cancelled) {
          setProjects(data.map(normalizeProject))
          setApiAvailable(true)
        }
      })
      .catch((error) => {
        console.error('Projects API error:', error)

        if (!cancelled) {
          setApiAvailable(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Keep LocalStorage synchronized for Dashboard and Statistics
  useEffect(() => {
    localStorage.setItem(
      'taskpro-projects',
      JSON.stringify(projects)
    )
  }, [projects])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const description = project.description ?? ''

      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'All' || project.status === filter

      return matchesSearch && matchesFilter
    })
  }, [projects, search, filter])

  const completedCount = projects.filter(
    (project) => project.status === 'Completed'
  ).length

  const inProgressCount = projects.filter(
    (project) => project.status === 'In Progress'
  ).length

  function openCreateModal() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setModalOpen(true)
  }

  function openEditModal(project) {
    setEditingId(project.id)

    setForm({
      name: project.name,
      description: project.description ?? '',
      status: project.status,
      dueDate: project.dueDate ?? '',
    })

    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const projectData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    }

    if (!projectData.name) return

    const payload = toApiPayload(projectData)

    if (api && apiAvailable !== false) {
      try {
        if (editingId !== null) {
          const { data } = await api.put(
            `/projects/${editingId}`,
            payload
          )

          const updatedProject = normalizeProject(data)

          setProjects((current) =>
            current.map((project) =>
              project.id === editingId
                ? updatedProject
                : project
            )
          )
        } else {
          const { data } = await api.post('/projects', payload)

          setProjects((current) => [
            normalizeProject(data),
            ...current,
          ])
        }

        setApiAvailable(true)
      } catch (error) {
        console.error('Save project error:', error)

        setApiAvailable(false)

        if (editingId !== null) {
          setProjects((current) =>
            current.map((project) =>
              project.id === editingId
                ? normalizeProject({
                    ...project,
                    ...projectData,
                  })
                : project
            )
          )
        } else {
          setProjects((current) => [
            normalizeProject({
              id: Date.now(),
              ...projectData,
              progress: 0,
              tasksCount: 0,
              completedTasksCount: 0,
            }),
            ...current,
          ])
        }
      }
    } else {
      if (editingId !== null) {
        setProjects((current) =>
          current.map((project) =>
            project.id === editingId
              ? normalizeProject({
                  ...project,
                  ...projectData,
                })
              : project
          )
        )
      } else {
        setProjects((current) => [
          normalizeProject({
            id: Date.now(),
            ...projectData,
            progress: 0,
            tasksCount: 0,
            completedTasksCount: 0,
          }),
          ...current,
        ])
      }
    }

    setModalOpen(false)
    setForm({ ...emptyForm })
    setEditingId(null)
  }

  async function deleteProject(id) {
    const message = language === 'fr'
      ? 'Voulez-vous vraiment supprimer ce projet ?'
      : 'Are you sure you want to delete this project?'

    if (!window.confirm(message)) return

    if (api && apiAvailable !== false) {
      try {
        await api.delete(`/projects/${id}`)

        setProjects((current) =>
          current.filter((project) => project.id !== id)
        )

        setApiAvailable(true)
      } catch (error) {
        console.error('Delete project error:', error)

        setApiAvailable(false)

        setProjects((current) =>
          current.filter((project) => project.id !== id)
        )
      }
    } else {
      setProjects((current) =>
        current.filter((project) => project.id !== id)
      )
    }
  }

  function getStatusLabel(status) {
    const labels = {
      'In Progress': tr('statusInProgress'),
      Completed: tr('statusCompleted'),
      'On Hold': tr('statusOnHold'),
    }

    return labels[status] || status
  }

  const stats = [
    {
      label: tr('totalProjects'),
      value: projects.length,
      icon: FolderKanban,
    },
    {
      label: tr('inProgress'),
      value: inProgressCount,
      icon: CircleDot,
    },
    {
      label: tr('completed'),
      value: completedCount,
      icon: CheckCircle2,
    },
  ]

  const locale = language === 'fr' ? 'fr-FR' : 'en-US'

  return (
    <main className="min-w-0 px-5 py-7 md:px-8 md:py-8">

      {/* Page Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-text-secondary">
            {tr('workspace')} / {tr('projects')}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            {tr('myProjects')}
          </h1>

          <p className="mt-2 text-sm text-text-secondary">
            {tr('pageDescription')}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Plus size={18} />
          {tr('newProject')}
        </button>
      </div>

      {/* Statistics */}
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

      {/* Search and Filter */}
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
          <option value="All">{tr('allProjects')}</option>
          <option value="In Progress">{tr('statusInProgress')}</option>
          <option value="Completed">{tr('statusCompleted')}</option>
          <option value="On Hold">{tr('statusOnHold')}</option>
        </select>
      </section>

      {/* Projects List */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">
          {tr('allProjects')}
        </h2>

        <span className="text-xs text-text-secondary">
          {filteredProjects.length} {tr('projectsFound')}
        </span>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-5 py-16 text-center">
          <FolderKanban
            size={38}
            className="mx-auto mb-4 text-text-secondary"
          />

          <h3 className="font-semibold text-text-primary">
            {tr('noProjects')}
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            {tr('noProjectsDescription')}
          </p>

          <button
            onClick={openCreateModal}
            className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            {tr('createProject')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10"
              >
                {/* Card Header */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <FolderKanban size={22} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-text-primary">
                        {project.name}
                      </h3>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[project.status] || ''}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEditModal(project)}
                      aria-label={tr('editProject')}
                      title={tr('editProject')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => deleteProject(project.id)}
                      aria-label={tr('deleteProject')}
                      title={tr('deleteProject')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 min-h-10 text-sm leading-6 text-text-secondary">
                  {project.description || tr('noDescription')}
                </p>

                {/* Task Statistics */}
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-xl bg-background/70 p-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <ListTodo size={17} />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-text-primary">
                        {project.tasksCount ?? 0}
                      </p>

                      <p className="text-[11px] text-text-secondary">
                        {language === 'fr' ? 'Tâches' : 'Tasks'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-background/70 p-3">
                    <div className="rounded-lg bg-success/10 p-2 text-success">
                      <CheckCheck size={17} />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-text-primary">
                        {project.completedTasksCount ?? 0}
                      </p>

                      <p className="text-[11px] text-text-secondary">
                        {tr('completedTasks')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Automatic Progress */}
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-text-secondary">
                    {tr('projectProgress')}
                  </span>

                  <span className="font-bold text-text-primary">
                    {project.progress ?? 0}%
                  </span>
                </div>

                <div className="mb-5 h-2 overflow-hidden rounded-full bg-background">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, Math.max(0, project.progress ?? 0))}%`,
                    }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>

                {/* Card Footer */}
                <div className="flex items-center gap-2 border-t border-border pt-4 text-xs text-text-secondary">
                  <CalendarDays size={15} />

                  <span>
                    {project.dueDate
                      ? `${tr('due')} ${new Date(
                          `${project.dueDate}T00:00:00`
                        ).toLocaleDateString(locale)}`
                      : tr('noDeadline')}
                  </span>

                  <span className="ml-auto">
                    {project.status === 'Completed' ? (
                      <CheckCircle2 size={17} className="text-success" />
                    ) : project.status === 'On Hold' ? (
                      <PauseCircle size={17} className="text-warning" />
                    ) : (
                      <CircleDot size={17} className="text-primary" />
                    )}
                  </span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setModalOpen(false)
              }
            }}
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
                    {editingId !== null
                      ? tr('editProject')
                      : tr('createNewProject')}
                  </h2>

                  <p className="mt-1 text-sm text-text-secondary">
                    {editingId !== null
                      ? tr('editDetails')
                      : tr('addDetails')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
                  aria-label={tr('close')}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">

                {/* Project Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('projectName')} *
                  </label>

                  <input
                    required
                    maxLength={80}
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder={tr('enterProjectName')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('description')}
                  </label>

                  <textarea
                    rows={3}
                    maxLength={300}
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    placeholder={tr('projectAbout')}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('status')}
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  >
                    <option value="In Progress">
                      {tr('statusInProgress')}
                    </option>

                    <option value="Completed">
                      {tr('statusCompleted')}
                    </option>

                    <option value="On Hold">
                      {tr('statusOnHold')}
                    </option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('dueDate')}
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        dueDate: event.target.value,
                      })
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
                    : tr('createProject')}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default Projects
