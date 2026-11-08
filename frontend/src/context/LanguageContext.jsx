import { createContext, useContext, useEffect, useState } from 'react'

const translations = {
  en: {
    dashboard: 'Dashboard',
    projects: 'Projects',
    myTasks: 'My Tasks',
    kanban: 'Kanban Board',
    calendar: 'Calendar',
    notes: 'My Notes',
    statistics: 'Statistics',
    settings: 'Settings',
    help: 'Help & Support',
    workspace: 'WORKSPACE',
    analytics: 'ANALYTICS',
    search: 'Search anything...',
    notifications: 'Notifications',
    welcome: 'Welcome back!',
    overview: 'Here is what is happening with your workspace today.',
    newProject: 'New Project',
    allProjects: 'All Projects',
    totalProjects: 'Total Projects',
    inProgress: 'In Progress',
    completed: 'Completed',
    onHold: 'On Hold',
    description: 'Description',
    projectName: 'Project name',
    dueDate: 'Due date',
    progress: 'Project progress',
    createProject: 'Create Project',
    editProject: 'Edit Project',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    noProjects: 'No projects found',
    personalAccount: 'Personal Account',
    personalWorkspace: 'Personal Workspace',
  },
  fr: {
    dashboard: 'Tableau de bord',
    projects: 'Projets',
    myTasks: 'Mes tâches',
    kanban: 'Tableau Kanban',
    calendar: 'Calendrier',
    notes: 'Mes notes',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    help: 'Aide et assistance',
    workspace: 'ESPACE DE TRAVAIL',
    analytics: 'ANALYSE',
    search: 'Rechercher...',
    notifications: 'Notifications',
    welcome: 'Bon retour !',
    overview: 'Voici les activités de votre espace de travail aujourd’hui.',
    newProject: 'Nouveau projet',
    allProjects: 'Tous les projets',
    totalProjects: 'Total des projets',
    inProgress: 'En cours',
    completed: 'Terminé',
    onHold: 'En pause',
    description: 'Description',
    projectName: 'Nom du projet',
    dueDate: 'Date limite',
    progress: 'Progression du projet',
    createProject: 'Créer un projet',
    editProject: 'Modifier le projet',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    noProjects: 'Aucun projet trouvé',
    personalAccount: 'Compte personnel',
    personalWorkspace: 'Espace personnel',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('taskpro-language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('taskpro-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
