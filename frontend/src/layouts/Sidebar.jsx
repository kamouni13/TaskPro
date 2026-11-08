
import { useState } from 'react'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  CalendarDays,
  StickyNote,
  ChartNoAxesCombined,
  Settings,
  HelpCircle,
  ChevronDown,
  Zap,
  Menu,
  X,
} from 'lucide-react'

const navigation = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'Projects', icon: FolderKanban },
      { label: 'My Tasks', icon: CheckSquare },
      { label: 'Kanban Board', icon: Columns3 },
      { label: 'Calendar', icon: CalendarDays },
      { label: 'My Notes', icon: StickyNote },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'Statistics', icon: ChartNoAxesCombined },
    ],
  },
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-xl border border-border bg-surface p-3 text-white shadow-lg transition hover:bg-surface-hover lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-surface px-4 py-6 shadow-2xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-10 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">TaskPro</h1>
              <p className="text-xs text-text-secondary">Personal Workspace</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-text-secondary transition hover:bg-surface-hover hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-8">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.15em] text-text-secondary">
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeItem === item.label

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setActiveItem(item.label)
                        setMobileOpen(false)
                      }}
                      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 ${
                        isActive
                          ? 'bg-primary/15 text-white shadow-sm'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-accent" />
                      )}

                      <Icon
                        size={19}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-accent' : ''
                        }`}
                      />

                      <span>{item.label}</span>

                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_#38BDF8]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border pt-5">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-secondary transition-all duration-200 hover:translate-x-1 hover:bg-surface-hover hover:text-white"
          >
            <Settings size={19} /> Settings
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-text-secondary transition-all duration-200 hover:translate-x-1 hover:bg-surface-hover hover:text-white"
          >
            <HelpCircle size={19} /> Help & Support
          </button>

          <button
            type="button"
            className="mt-4 flex w-full items-center gap-3 rounded-xl bg-background p-3 text-left transition hover:bg-surface-hover"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-white ring-2 ring-primary/20">
              MK
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">My Workspace</p>
              <p className="text-xs text-text-secondary">Personal Account</p>
            </div>

            <ChevronDown size={16} className="text-text-secondary" />
          </button>
        </div>
      </aside>
    </>
  )
}
