
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Plus,
  Search,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  X,
  FileText,
  Clock,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'

const translations = {
  en: {
    workspace: 'Workspace',
    title: 'My Notes',
    description: 'Capture your ideas and keep important information organized.',
    newNote: 'New Note',
    search: 'Search notes...',
    allNotes: 'All Notes',
    pinned: 'Pinned',
    noNotes: 'No notes found',
    noNotesDesc: 'Create your first note to get started.',
    create: 'Create Note',
    edit: 'Edit Note',
    noteTitle: 'Note title',
    content: 'Content',
    titlePlaceholder: 'Enter note title...',
    contentPlaceholder: 'Write your thoughts here...',
    cancel: 'Cancel',
    save: 'Save Note',
    update: 'Update Note',
    deleteConfirm: 'Are you sure you want to delete this note?',
    notes: 'notes',
    untitled: 'Untitled Note',
    pin: 'Pin note',
    unpin: 'Unpin note',
    characters: 'characters',
  },
  fr: {
    workspace: 'Espace de travail',
    title: 'Mes notes',
    description: 'Capturez vos idées et organisez vos informations importantes.',
    newNote: 'Nouvelle note',
    search: 'Rechercher des notes...',
    allNotes: 'Toutes les notes',
    pinned: 'Épinglées',
    noNotes: 'Aucune note trouvée',
    noNotesDesc: 'Créez votre première note pour commencer.',
    create: 'Créer une note',
    edit: 'Modifier la note',
    noteTitle: 'Titre de la note',
    content: 'Contenu',
    titlePlaceholder: 'Saisissez le titre...',
    contentPlaceholder: 'Écrivez vos idées ici...',
    cancel: 'Annuler',
    save: 'Enregistrer',
    update: 'Mettre à jour',
    deleteConfirm: 'Voulez-vous vraiment supprimer cette note ?',
    notes: 'notes',
    untitled: 'Note sans titre',
    pin: 'Épingler',
    unpin: 'Désépingler',
    characters: 'caractères',
  },
}

const emptyForm = {
  title: '',
  content: '',
}

function normalizeNote(note) {
  return {
    id: note.id,
    title: note.title || '',
    content: note.content || '',
    pinned: Boolean(note.pinned),
    createdAt: note.created_at
      ? new Date(note.created_at).getTime()
      : note.createdAt || Date.now(),
    updatedAt: note.updated_at
      ? new Date(note.updated_at).getTime()
      : note.updatedAt || Date.now(),
  }
}

function toApiPayload(note) {
  return {
    title: note.title || null,
    content: note.content,
    pinned: Boolean(note.pinned),
  }
}

export default function Notes() {
  const { language } = useLanguage()
  const tr = (key) =>
    translations[language]?.[key] || translations.en[key] || key

  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskpro-notes')) || []
    } catch {
      return []
    }
  })

  const [apiAvailable, setApiAvailable] = useState(null)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Load notes from Laravel API.
  useEffect(() => {
    let active = true

    async function loadNotes() {
      if (!api) {
        setApiAvailable(false)
        return
      }

      try {
        const response = await api.get('/notes')

        if (active) {
          const data = Array.isArray(response.data)
            ? response.data
            : response.data.data || []

          setNotes(data.map(normalizeNote))
          setApiAvailable(true)
        }
      } catch (error) {
        console.error('Failed to load notes from API:', error)

        if (active) {
          setApiAvailable(false)
        }
      }
    }

    loadNotes()

    return () => {
      active = false
    }
  }, [])

  // Save locally only when API is not configured or unavailable.
  useEffect(() => {
    if (!api || apiAvailable === false) {
      localStorage.setItem('taskpro-notes', JSON.stringify(notes))
    }
  }, [notes, apiAvailable])

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const text = `${note.title || ''} ${note.content || ''}`.toLowerCase()
        return text.includes(search.toLowerCase())
      })
      .filter((note) => {
        if (activeFilter === 'pinned') return note.pinned
        return true
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return Number(b.pinned) - Number(a.pinned)
        }

        return (b.updatedAt || 0) - (a.updatedAt || 0)
      })
  }, [notes, search, activeFilter])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(note) {
    setEditingId(note.id)
    setForm({
      title: note.title || '',
      content: note.content || '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const now = Date.now()

    try {
      if (api && apiAvailable !== false) {
        if (editingId !== null) {
          const existingNote = notes.find((note) => note.id === editingId)

          const response = await api.put(
            `/notes/${editingId}`,
            toApiPayload({
              ...existingNote,
              ...form,
            })
          )

          const updatedNote = normalizeNote(response.data)

          setNotes((current) =>
            current.map((note) =>
              note.id === editingId ? updatedNote : note
            )
          )
        } else {
          const response = await api.post(
            '/notes',
            toApiPayload({
              ...form,
              pinned: false,
            })
          )

          const newNote = normalizeNote(response.data)

          setNotes((current) => [newNote, ...current])
        }

        setApiAvailable(true)
      } else if (editingId !== null) {
        setNotes((current) =>
          current.map((note) =>
            note.id === editingId
              ? { ...note, ...form, updatedAt: now }
              : note
          )
        )
      } else {
        setNotes((current) => [
          {
            id: now,
            ...form,
            pinned: false,
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ])
      }

      setModalOpen(false)
      setEditingId(null)
      setForm(emptyForm)
    } catch (error) {
      console.error('Failed to save note through API:', error)

      setApiAvailable(false)

      if (editingId !== null) {
        setNotes((current) =>
          current.map((note) =>
            note.id === editingId
              ? { ...note, ...form, updatedAt: now }
              : note
          )
        )
      } else {
        setNotes((current) => [
          {
            id: now,
            ...form,
            pinned: false,
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ])
      }

      setModalOpen(false)
      setEditingId(null)
      setForm(emptyForm)
    }
  }

  async function deleteNote(id) {
    if (!window.confirm(tr('deleteConfirm'))) return

    try {
      if (api && apiAvailable !== false) {
        await api.delete(`/notes/${id}`)
        setApiAvailable(true)
      }

      setNotes((current) => current.filter((note) => note.id !== id))
    } catch (error) {
      console.error('Failed to delete note through API:', error)

      setApiAvailable(false)
      setNotes((current) => current.filter((note) => note.id !== id))
    }
  }

  async function togglePin(id) {
    const note = notes.find((item) => item.id === id)
    if (!note) return

    const updatedNote = {
      ...note,
      pinned: !note.pinned,
      updatedAt: Date.now(),
    }

    try {
      if (api && apiAvailable !== false) {
        const response = await api.put(
          `/notes/${id}`,
          toApiPayload(updatedNote)
        )

        const savedNote = normalizeNote(response.data)

        setNotes((current) =>
          current.map((item) => item.id === id ? savedNote : item)
        )

        setApiAvailable(true)
      } else {
        setNotes((current) =>
          current.map((item) =>
            item.id === id ? updatedNote : item
          )
        )
      }
    } catch (error) {
      console.error('Failed to update note pin through API:', error)

      setApiAvailable(false)

      setNotes((current) =>
        current.map((item) =>
          item.id === id ? updatedNote : item
        )
      )
    }
  }

  const locale = language === 'fr' ? 'fr-FR' : 'en-US'

  function formatDate(timestamp) {
    return new Date(timestamp || Date.now()).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <main className="min-w-0 px-5 py-7 md:px-8 md:py-8">
      {/* Heading */}
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
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
        >
          <Plus size={18} />
          {tr('newNote')}
        </button>
      </div>

      {/* Search and filters */}
      <section className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
          <Search size={18} className="text-text-secondary" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={tr('search')}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
        </div>

        <div className="flex rounded-xl border border-border bg-surface p-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeFilter === 'all'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tr('allNotes')}
          </button>

          <button
            onClick={() => setActiveFilter('pinned')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeFilter === 'pinned'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Pin size={14} />
            {tr('pinned')}
          </button>
        </div>
      </section>

      {/* Notes count */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">
          {activeFilter === 'pinned' ? tr('pinned') : tr('allNotes')}
        </h2>

        <span className="text-xs text-text-secondary">
          {filteredNotes.length} {tr('notes')}
        </span>
      </div>

      {/* Notes grid */}
      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-5 py-16 text-center">
          <FileText size={38} className="mx-auto mb-4 text-text-secondary" />

          <h3 className="font-semibold text-text-primary">
            {tr('noNotes')}
          </h3>

          <p className="mt-2 text-sm text-text-secondary">
            {tr('noNotesDesc')}
          </p>

          <button
            onClick={openCreate}
            className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            {tr('newNote')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredNotes.map((note, index) => (
              <motion.article
                key={note.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
                className="group flex min-h-[220px] flex-col rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <FileText size={17} className="shrink-0 text-primary" />
                    <h3 className="truncate font-semibold text-text-primary">
                      {note.title || tr('untitled')}
                    </h3>
                  </div>

                  <button
                    onClick={() => togglePin(note.id)}
                    title={note.pinned ? tr('unpin') : tr('pin')}
                    aria-label={note.pinned ? tr('unpin') : tr('pin')}
                    className={`shrink-0 rounded-lg p-2 transition ${
                      note.pinned
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-primary'
                    }`}
                  >
                    {note.pinned ? <Pin size={16} /> : <PinOff size={16} />}
                  </button>
                </div>

                <p className="mb-5 flex-1 whitespace-pre-wrap break-words text-sm leading-6 text-text-secondary">
                  {note.content}
                </p>

                <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Clock size={13} />
                    {formatDate(note.updatedAt || note.createdAt)}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(note)}
                      aria-label={tr('edit')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      aria-label={tr('deleteConfirm')}
                      className="rounded-lg p-2 text-text-secondary transition hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit modal */}
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
                    {editingId !== null ? tr('edit') : tr('newNote')}
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
                    {tr('noteTitle')}
                  </label>
                  <input
                    maxLength={100}
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    placeholder={tr('titlePlaceholder')}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text-primary">
                    {tr('content')}
                  </label>
                  <textarea
                    required
                    rows={7}
                    maxLength={5000}
                    value={form.content}
                    onChange={(event) =>
                      setForm({ ...form, content: event.target.value })
                    }
                    placeholder={tr('contentPlaceholder')}
                    className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-right text-xs text-text-secondary">
                    {form.content.length} / 5000 {tr('characters')}
                  </p>
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
                  {editingId !== null ? tr('update') : tr('save')}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
