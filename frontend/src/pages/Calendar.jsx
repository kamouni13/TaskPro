
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Circle,
  Eye,
  CalendarCheck,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const translations = {
  en: {
    workspace: 'Workspace',
    title: 'Calendar',
    description: 'Plan your schedule and keep track of deadlines.',
    today: 'Today',
    upcoming: 'Selected day',
    noTasks: 'No tasks scheduled',
    noTasksDesc: 'There are no tasks with a deadline on this date.',
    tasks: 'tasks',
    dueDate: 'Due date',
    todo: 'To Do',
    progress: 'In Progress',
    review: 'Review',
    completed: 'Completed',
    priority: 'Priority',
    allDay: 'All day',
  },
  fr: {
    workspace: 'Espace de travail',
    title: 'Calendrier',
    description: 'Planifiez votre emploi du temps et suivez vos échéances.',
    today: "Aujourd'hui",
    upcoming: 'Jour sélectionné',
    noTasks: 'Aucune tâche prévue',
    noTasksDesc: "Aucune tâche n'a d'échéance à cette date.",
    tasks: 'tâches',
    dueDate: 'Date limite',
    todo: 'À faire',
    progress: 'En cours',
    review: 'En révision',
    completed: 'Terminées',
    priority: 'Priorité',
    allDay: 'Toute la journée',
  },
}

const priorityLabels = {
  en: { Low: 'Low', Medium: 'Medium', High: 'High', Urgent: 'Urgent' },
  fr: { Low: 'Basse', Medium: 'Moyenne', High: 'Élevée', Urgent: 'Urgente' },
}

const priorityStyles = {
  Low: 'bg-surface-hover text-text-secondary',
  Medium: 'bg-primary/10 text-primary',
  High: 'bg-warning/10 text-warning',
  Urgent: 'bg-danger/10 text-danger',
}

const statusStyles = {
  'To Do': 'text-text-secondary',
  'In Progress': 'text-primary',
  Review: 'text-warning',
  Completed: 'text-success',
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday is the first day of the week.
  const startOffset = (firstDay.getDay() + 6) % 7

  const days = []

  for (let i = 0; i < startOffset; i++) {
    days.push(new Date(year, month, 1 - (startOffset - i)))
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - startOffset - lastDay.getDate() + 1
    days.push(new Date(year, month + 1, nextDay))
  }

  return days
}

export default function Calendar() {
  const { language } = useLanguage()
  const tr = (key) => translations[language]?.[key] || translations.en[key]

  const today = new Date()

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  const [selectedDate, setSelectedDate] = useState(formatDateKey(today))

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('taskpro-tasks')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

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

  const days = useMemo(
    () => getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth]
  )

  const tasksByDate = useMemo(() => {
    return tasks.reduce((groups, task) => {
      if (!task.dueDate) return groups

      if (!groups[task.dueDate]) {
        groups[task.dueDate] = []
      }

      groups[task.dueDate].push(task)
      return groups
    }, {})
  }, [tasks])

  const selectedTasks = tasksByDate[selectedDate] || []

  const monthName = currentMonth.toLocaleDateString(
    language === 'fr' ? 'fr-FR' : 'en-US',
    { month: 'long', year: 'numeric' }
  )

  const weekDays = language === 'fr'
    ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const statusLabels = {
    'To Do': tr('todo'),
    'In Progress': tr('progress'),
    Review: tr('review'),
    Completed: tr('completed'),
  }

  function changeMonth(direction) {
    setCurrentMonth((current) =>
      new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1
      )
    )
  }

  function goToToday() {
    const now = new Date()
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(formatDateKey(now))
  }

  const locale = language === 'fr' ? 'fr-FR' : 'en-US'

  return (
    <main className="min-w-0 px-5 py-7 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
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

        <button
          onClick={goToToday}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary"
        >
          <CalendarCheck size={17} />
          {tr('today')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Calendar */}
        <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 md:p-6">
          {/* Month navigation */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold capitalize text-text-primary md:text-xl">
              {monthName}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="rounded-xl border border-border p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
              >
                <ChevronLeft size={19} />
              </button>

              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="rounded-xl border border-border p-2 text-text-secondary transition hover:bg-surface-hover hover:text-text-primary"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          </div>

          {/* Week days */}
          <div className="mb-2 grid grid-cols-7">
            {weekDays.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-text-secondary"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((date, index) => {
              const dateKey = formatDateKey(date)
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth()

              const isToday = dateKey === formatDateKey(today)
              const isSelected = dateKey === selectedDate
              const dayTasks = tasksByDate[dateKey] || []

              return (
                <button
                  key={`${dateKey}-${index}`}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative flex min-h-[72px] flex-col items-center rounded-xl border p-1.5 transition sm:min-h-[105px] sm:p-2 ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-transparent hover:border-border hover:bg-surface-hover'
                  } ${
                    !isCurrentMonth ? 'opacity-30' : ''
                  }`}
                >
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold sm:size-8 sm:text-sm ${
                      isToday
                        ? 'bg-primary text-white'
                        : 'text-text-primary'
                    }`}
                  >
                    {date.getDate()}
                  </span>

                  <div className="mt-2 flex min-h-2 flex-wrap justify-center gap-1">
                    {dayTasks.slice(0, 4).map((task) => (
                      <span
                        key={task.id}
                        className={`size-1.5 rounded-full ${
                          task.status === 'Completed'
                            ? 'bg-success'
                            : task.status === 'Review'
                              ? 'bg-warning'
                              : task.status === 'In Progress'
                                ? 'bg-primary'
                                : 'bg-text-secondary'
                        }`}
                      />
                    ))}
                  </div>

                  {dayTasks.length > 0 && (
                    <span className="mt-1 hidden text-[10px] text-text-secondary sm:block">
                      {dayTasks.length} {tr('tasks')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-border pt-5">
            {columnsLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${item.color}`} />
                <span className="text-xs text-text-secondary">
                  {tr(item.label)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Selected day tasks */}
        <aside className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {tr('upcoming')}
            </p>

            <h2 className="text-xl font-bold text-text-primary">
              {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                locale,
                { weekday: 'long', day: 'numeric', month: 'long' }
              )}
            </h2>

            <p className="mt-1 text-xs text-text-secondary">
              {selectedTasks.length} {tr('tasks')}
            </p>
          </div>

          <div className="space-y-3">
            {selectedTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
                <CalendarDays
                  size={34}
                  className="mx-auto mb-3 text-text-secondary"
                />
                <p className="text-sm font-semibold text-text-primary">
                  {tr('noTasks')}
                </p>
                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  {tr('noTasksDesc')}
                </p>
              </div>
            ) : (
              selectedTasks.map((task, index) => {
                const StatusIcon =
                  task.status === 'Completed'
                    ? CheckCircle2
                    : task.status === 'In Progress'
                      ? Clock3
                      : task.status === 'Review'
                        ? Eye
                        : Circle

                return (
                  <motion.article
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {task.title}
                      </h3>

                      <StatusIcon
                        size={17}
                        className={`shrink-0 ${statusStyles[task.status] || 'text-text-secondary'}`}
                      />
                    </div>

                    {task.description && (
                      <p className="mb-3 text-xs leading-5 text-text-secondary">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-text-secondary">
                        {tr('dueDate')}
                      </span>

                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        priorityStyles[task.priority] || priorityStyles.Medium
                      }`}>
                        {priorityLabels[language]?.[task.priority] || task.priority}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-text-secondary">
                      {statusLabels[task.status] || task.status}
                    </p>
                  </motion.article>
                )
              })
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

const columnsLegend = [
  { label: 'todo', color: 'bg-text-secondary' },
  { label: 'progress', color: 'bg-primary' },
  { label: 'review', color: 'bg-warning' },
  { label: 'completed', color: 'bg-success' },
]
