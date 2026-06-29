import { useState, useEffect } from 'react';
import { Language, Project, Task, Notification } from './types';
import { translations } from './data/translations';
import { initialProjects, initialTasks } from './data/initialData';
import Dashboard from './components/Dashboard';
import CronSimulator from './components/CronSimulator';
import DatabaseVisualizer from './components/DatabaseVisualizer';
import JwtPlayground from './components/JwtPlayground';
import StrugglesReflections from './components/StrugglesReflections';
import { 
  BookOpen, 
  Database, 
  ShieldCheck, 
  CalendarClock, 
  FileText, 
  LayoutDashboard, 
  Bell,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Language State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('gakusei_lang');
    return (saved as Language) || 'ja';
  });

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cron' | 'db' | 'jwt' | 'report'>(() => {
    const saved = localStorage.getItem('gakusei_tab');
    return (saved as any) || 'dashboard';
  });

  // 3. Projects and Tasks State
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // 4. Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 5. Mobile Sidebar Open/Close
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('gakusei_projects');
    const savedTasks = localStorage.getItem('gakusei_tasks');
    const savedNotifs = localStorage.getItem('gakusei_notifs');

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(initialProjects);
      localStorage.setItem('gakusei_projects', JSON.stringify(initialProjects));
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(initialTasks);
      localStorage.setItem('gakusei_tasks', JSON.stringify(initialTasks));
    }

    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }
  }, []);

  // Save Language change
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('gakusei_lang', newLang);
  };

  // Save Tab change
  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    localStorage.setItem('gakusei_tab', tab);
    setMobileSidebarOpen(false);
  };

  // Core Data Update Handlers
  const handleUpdateProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('gakusei_projects', JSON.stringify(newProjects));
  };

  const handleUpdateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('gakusei_tasks', JSON.stringify(newTasks));
  };

  // Notifications Handlers
  const handleAddNotification = (newNotif: Notification) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('gakusei_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('gakusei_notifs');
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('gakusei_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('gakusei_notifs', JSON.stringify(updated));
      return updated;
    });
  };

  const t = translations[lang];

  // System status parameters
  const pendingCount = tasks.filter(t => t.status !== 'done').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden select-none">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between shrink-0 h-full">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo / Brand Header */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black shadow-sm shadow-indigo-100">
              E
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">EduFlow</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <button
              id="tab-dashboard"
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {t.dashboard}
            </button>

            <button
              id="tab-cron"
              onClick={() => handleTabChange('cron')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                activeTab === 'cron'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarClock className="w-5 h-5 shrink-0" />
                <span>{t.cronSim}</span>
              </div>
              {unreadNotifsCount > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            <button
              id="tab-db"
              onClick={() => handleTabChange('db')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                activeTab === 'db'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <Database className="w-5 h-5 shrink-0" />
              {t.dbDesign}
            </button>

            <button
              id="tab-jwt"
              onClick={() => handleTabChange('jwt')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                activeTab === 'jwt'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {t.jwtAuth}
            </button>

            <button
              id="tab-report"
              onClick={() => handleTabChange('report')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                activeTab === 'report'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              {t.strugglesAndLearnings}
            </button>
          </nav>
        </div>

        {/* User Student Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center font-bold text-indigo-700 font-mono text-sm shrink-0">
              RW
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-slate-800">Riku Watanabe</p>
              <p className="text-xs text-slate-500 truncate">ID: 2026-4044</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden flex">
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-64 bg-white h-full flex flex-col justify-between shadow-2xl"
            >
              <div className="flex flex-col flex-1 min-h-0">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">
                      E
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">EduFlow</span>
                  </div>
                  <button 
                    onClick={() => setMobileSidebarOpen(false)} 
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                  <button
                    onClick={() => handleTabChange('dashboard')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                      activeTab === 'dashboard'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {t.dashboard}
                  </button>

                  <button
                    onClick={() => handleTabChange('cron')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                      activeTab === 'cron'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarClock className="w-5 h-5" />
                      <span>{t.cronSim}</span>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotifsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleTabChange('db')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                      activeTab === 'db'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Database className="w-5 h-5" />
                    {t.dbDesign}
                  </button>

                  <button
                    onClick={() => handleTabChange('jwt')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                      activeTab === 'jwt'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    {t.jwtAuth}
                  </button>

                  <button
                    onClick={() => handleTabChange('report')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all font-medium ${
                      activeTab === 'report'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    {t.strugglesAndLearnings}
                  </button>
                </nav>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center font-bold text-indigo-700 font-mono text-sm">
                    RW
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Riku Watanabe</p>
                    <p className="text-xs text-slate-500">ID: 2026-4044</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-xs shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base lg:text-lg font-semibold text-slate-800 hidden sm:block">
              {activeTab === 'dashboard' && 'Campus Project Dashboard'}
              {activeTab === 'cron' && 'Deadline Services'}
              {activeTab === 'db' && 'MongoDB Data Architecture'}
              {activeTab === 'jwt' && 'JSON Web Token Security'}
              {activeTab === 'report' && 'Theme ④ Submission Report'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] lg:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Status: Live
            </span>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Language Switcher */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1">
              <button
                id="lang-btn-ja"
                onClick={() => handleLanguageChange('ja')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'ja' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                日本語
              </button>
              <button
                id="lang-btn-en"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'en' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-uz"
                onClick={() => handleLanguageChange('uz')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  lang === 'uz' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                UZ
              </button>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => handleTabChange('cron')}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Bell className="w-5.5 h-5.5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard
                  lang={lang}
                  t={t}
                  projects={projects}
                  tasks={tasks}
                  onUpdateProjects={handleUpdateProjects}
                  onUpdateTasks={handleUpdateTasks}
                />
              )}

              {activeTab === 'cron' && (
                <CronSimulator
                  lang={lang}
                  t={t}
                  tasks={tasks}
                  notifications={notifications}
                  onAddNotification={handleAddNotification}
                  onClearNotifications={handleClearNotifications}
                  onMarkRead={handleMarkRead}
                  onDeleteNotification={handleDeleteNotification}
                />
              )}

              {activeTab === 'db' && (
                <DatabaseVisualizer
                  lang={lang}
                  t={t}
                />
              )}

              {activeTab === 'jwt' && (
                <JwtPlayground
                  lang={lang}
                  t={t}
                />
              )}

              {activeTab === 'report' && (
                <StrugglesReflections
                  lang={lang}
                  t={t}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
