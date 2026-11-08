
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Circle,
  Clock3,
  Eye,
  CheckCircle2,
  CalendarDays,
  GripVertical,
  ListTodo,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const columns = [
  { id: 'To Do', icon: Circle, color: 'text-text-secondary' },
  { id: 'In Progress', icon: Clock3, color: 'text-primary' },
  { id: 'Review', icon: Eye, color: 'text-warning' },
  { id: 'Completed', icon: CheckCircle2, color: 'text-success' },
]

const translations = {
  en: {
    workspace: 'Workspace',
    title: 'Kanban Board',
    description: 'Organize your tasks and track your progress.',
    todo: 'To Do',
    progress: 'In Progress',
    review: 'Review',
    completed: 'Completed',
    tasks: 'tasks',
    noTasks: 'No tasks here',
    noTasksDesc: 'Tasks assigned to this status will appear here.',
    dueDate: 'Due',
    priority: 'Priority',
    moveTo: 'Move to',
    empty: 'No tasks yet. Create tasks from the Tasks page.',
  },
  fr: {
    workspace: 'Espace de travail',
    title: 'Tableau Kanban',
    description: 'Organisez vos tâches et suivez votre progression.',
    todo: 'À faire',
    progress: 'En cours',
    review: 'En révision',
    completed: 'Terminées',
    tasks: 'tâches',
    noTasks: 'Aucune tâche ici',
    noTasksDesc: 'Les tâches avec ce statut apparaîtront ici.',
    dueDate: 'Échéance',
    priority: 'Priorité',
    moveTo: 'Déplacer vers',
    empty: 'Aucune tâche. Créez des tâches depuis la page Mes tâches.',
  },
}

const priorityLabels = {
  en: {
    Low: 'Low',
    Medium: 'Medium',
    High: 'High',
    Urgent: 'Urgent',
  },
  fr: {
    Low: 'Basse',
    Medium: 'Moyenne',
    High: 'Élevée',
    Urgent: 'Urgente',
  },
}

const priorityStyles = {
  Low: 'bg-surface-hover text-text-secondary',
  Medium: 'bg-primary/10 text-primary',
  High: 'bg-warning/10 text-warning',
  Urgent: 'bg-danger/10 text-danger',
}

export default function Kanban() {
  const { language } = useLanguage()
  const tr = (key) => translations[language]?.[key] || translations.en[key] || key

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskpro-tasks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [draggedTask, setDraggedTask] = useState(null)

  useEffect(() => {
    localStorage.setItem('taskpro-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Update the board if tasks change in another browser tab.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === 'taskpro-tasks') {
        try {
          setTasks(event.newValue ? JSON.parse(event.newValue) : [])
        } catch {
          setTasks([])
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function moveTask(taskId, newStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  function handleDrop(status) {
    if (draggedTask !== null) {
      moveTask(draggedTask, status)
    }

    setDraggedTask(null)
  }

  const statusLabels = {
    'To Do': tr('todo'),
    'In Progress': tr('progress'),
    Review: tr('review'),
    Completed: tr('completed'),
  }

  const locale = language === 'fr' ? 'fr-FR' : 'en-US'

  return (
    <main className="min-w-0 px-5 py-7 md:px-8 md:py-8">
      {/* Page heading */}
      <div className="mb-8">
        <p className="mb-2 text-sm text-text-secondary">
          {tr('workspace')} / {tr('title')}
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          {tr('title')}
        </h1>

        <p className="mt-2 text-sm text-text-secondary">
          {tr('description')}
        </p>
      </div>

      {/* Empty board */}
      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-5 py-16 text-center">
          <ListTodo
            size={40}
            className="mx-auto mb-4 text-text-secondary"
          />
          <h2 className="font-semibold text-text-primary">
            {tr('empty')}
          </h2>
        </div>
      ) : (
        <>
          {/* Board columns */}
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 2xl:grid-cols-4">
            {columns.map((column, index) => {
              const Icon = column.icon
              const columnTasks = tasks.filter(
                (task) => task.status === column.id
              )

              return (
                <motion.section
                  key={column.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(column.id)}
                  className={`min-h-[350px] rounded-2xl border border-border bg-surface/60 p-3 transition ${
                    draggedTask !== null
                      ? 'hover:border-primary/50'
                      : ''
                  }`}
                >
                  {/* Column heading */}
                  <div className="mb-4 flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Icon size={19} className={column.color} />

                      <h2 className="text-sm font-semibold text-text-primary">
                        {statusLabels[column.id]}
                      </h2>
                    </div>

                    <span className="rounded-lg bg-surface-hover px-2.5 py-1 text-xs font-semibold text-text-secondary">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Task cards */}
                  <div className="space-y-3">
                    {columnTasks.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border px-3 py-10 text-center">
                        <p className="text-sm font-medium text-text-secondary">
                          {tr('noTasks')}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary">
                          {tr('noTasksDesc')}
                        </p>
                      </div>
                    ) : (
                      columnTasks.map((task) => (
                        <motion.article
                          key={task.id}
                          layout
                          draggable
                          onDragStart={() => setDraggedTask(task.id)}
                          onDragEnd={() => setDraggedTask(null)}
                          className="group cursor-grab rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:cursor-grabbing"
                        >
                          <div className="mb-3 flex items-start justify-between gap-2">
                            <h3 className={`min-w-0 flex-1 text-sm font-semibold text-text-primary ${
                              task.status === 'Completed'
                                ? 'line-through opacity-60'
                                : ''
                            }`}>
                              {task.title}
                            </h3>

                            <GripVertical
                              size={17}
                              className="shrink-0 text-text-secondary opacity-50 transition group-hover:opacity-100"
                            />
                          </div>

                          {task.description && (
                            <p className="mb-4 line-clamp-3 text-xs leading-5 text-text-secondary">
                              {task.description}
                            </p>
                          )}

                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              priorityStyles[task.priority] ||
                              priorityStyles.Medium
                            }`}>
                              {priorityLabels[language]?.[task.priority] ||
                                task.priority}
                            </span>

                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                                <CalendarDays size={12} />
                                {new Date(
                                  `${task.dueDate}T00:00:00`
                                ).toLocaleDateString(locale)}
                              </span>
                            )}
                          </div>

                          {/* Mobile-friendly status selector */}
                          <div className="border-t border-border pt-3">
                            <label className="mb-1 block text-[10px] text-text-secondary">
                              {tr('moveTo')}
                            </label>

                            <select
                              value={task.status}
                              onChange={(event) =>
                                moveTask(task.id, event.target.value)
                              }
                              onMouseDown={(event) => event.stopPropagation()}
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-2 text-xs text-text-primary outline-none focus:border-primary"
                            >
                              {columns.map((option) => (
                                <option
                                  key={option.id}
                                  value={option.id}
                                >
                                  {statusLabels[option.id]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>
                </motion.section>
              )
            })}
          </div>

          <p className="mt-5 text-xs text-text-secondary">
            {tasks.length} {tr('tasks')}
          </p>
        </>
      )}
    </main>
  )
}
