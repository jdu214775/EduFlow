import { useState, useEffect, FormEvent } from 'react';
import { Project, Task, Language } from '../types';
import { Plus, CheckCircle2, Circle, Clock, Trash2, Users, Tag, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  lang: Language;
  t: Record<string, string>;
  projects: Project[];
  tasks: Task[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateTasks: (tasks: Task[]) => void;
}

export default function Dashboard({
  lang,
  t,
  projects,
  tasks,
  onUpdateProjects,
  onUpdateTasks,
}: DashboardProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  
  // Modals
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  
  // Form States - Project
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjSubject, setNewProjSubject] = useState('');
  const [newProjMembers, setNewProjMembers] = useState('');
  
  // Form States - Task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskAssigned, setNewTaskAssigned] = useState('');
  const [newTaskProjId, setNewTaskProjId] = useState('');

  // Handle Project Creation
  const handleCreateProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjSubject.trim()) return;

    const newProj: Project = {
      id: 'p_' + Date.now(),
      name: newProjName,
      description: newProjDesc,
      subject: newProjSubject,
      progress: 0,
      members: newProjMembers ? newProjMembers.split(',').map(m => m.trim()) : [],
      tasksCount: { total: 0, completed: 0 },
    };

    const updated = [newProj, ...projects];
    onUpdateProjects(updated);
    
    // Reset Form
    setNewProjName('');
    setNewProjDesc('');
    setNewProjSubject('');
    setNewProjMembers('');
    setShowAddProject(false);
  };

  // Handle Task Creation
  const handleCreateTask = (e: FormEvent) => {
    e.preventDefault();
    const projId = newTaskProjId || (selectedProjectId !== 'all' ? selectedProjectId : projects[0]?.id);
    if (!newTaskTitle.trim() || !projId) return;

    const newTask: Task = {
      id: 't_' + Date.now(),
      projectId: projId,
      title: newTaskTitle,
      description: newTaskDesc,
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
      status: 'todo',
      priority: newTaskPriority,
      assignedTo: newTaskAssigned || undefined,
    };

    const updatedTasks = [...tasks, newTask];
    onUpdateTasks(updatedTasks);
    recalculateProgress(projId, updatedTasks);

    // Reset Form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
    setNewTaskAssigned('');
    setShowAddTask(false);
  };

  // Toggle Task Status
  const handleToggleStatus = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        let nextStatus: 'todo' | 'in_progress' | 'done' = 'todo';
        if (task.status === 'todo') nextStatus = 'in_progress';
        else if (task.status === 'in_progress') nextStatus = 'done';
        return { ...task, status: nextStatus };
      }
      return task;
    });

    onUpdateTasks(updatedTasks);
    
    // Find project of that task to recalculate progress
    const taskObj = tasks.find(t => t.id === taskId);
    if (taskObj) {
      recalculateProgress(taskObj.projectId, updatedTasks);
    }
  };

  // Delete Task
  const handleDeleteTask = (taskId: string, projId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    onUpdateTasks(updatedTasks);
    recalculateProgress(projId, updatedTasks);
  };

  // Recalculate Project Progress percentage
  const recalculateProgress = (projId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter(t => t.projectId === projId);
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'done').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const updatedProjects = projects.map((p) => {
      if (p.id === projId) {
        return {
          ...p,
          progress: percentage,
          tasksCount: { total, completed },
        };
      }
      return p;
    });
    onUpdateProjects(updatedProjects);
  };

  // Filter items
  const filteredTasks = tasks.filter((task) => {
    const matchProj = selectedProjectId === 'all' || task.projectId === selectedProjectId;
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchProj && matchStatus;
  });

  const getPriorityBadge = (prio: 'low' | 'medium' | 'high') => {
    switch (prio) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {t.high}</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1"><Clock className="w-3 h-3" /> {t.medium}</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200 flex items-center gap-1"><Circle className="w-3 h-3 text-slate-400" /> {t.low}</span>;
    }
  };

  const getStatusIcon = (status: 'todo' | 'in_progress' | 'done') => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 cursor-pointer hover:scale-115 transition-transform" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-indigo-500 cursor-pointer hover:scale-115 transition-transform animate-pulse" />;
      case 'todo':
        return <Circle className="w-5 h-5 text-slate-300 cursor-pointer hover:scale-115 transition-transform hover:text-indigo-400" />;
    }
  };

  const activeProject = selectedProjectId === 'all' ? null : projects.find(p => p.id === selectedProjectId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* LEFT: Project Selector Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm tracking-wide uppercase">{t.projects}</h3>
            <button
              id="btn-add-project"
              onClick={() => setShowAddProject(true)}
              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              id="project-tab-all"
              onClick={() => { setSelectedProjectId('all'); setStatusFilter('all'); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between border ${
                selectedProjectId === 'all'
                  ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-md'
                  : 'bg-white border-transparent text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm truncate">🌐 All Projects</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${selectedProjectId === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                {tasks.length}
              </span>
            </button>

            {projects.map((p) => {
              const projTasks = tasks.filter(t => t.projectId === p.id);
              const isSelected = selectedProjectId === p.id;
              return (
                <button
                  id={`project-tab-${p.id}`}
                  key={p.id}
                  onClick={() => { setSelectedProjectId(p.id); setStatusFilter('all'); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all border block space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white font-medium shadow-md shadow-indigo-100'
                      : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="truncate pr-2">
                      <span className="block text-xs uppercase tracking-wider opacity-75 font-mono">
                        {p.subject}
                      </span>
                      <span className="block text-sm font-medium truncate mt-0.5">
                        {p.name}
                      </span>
                    </div>
                    <span className={`text-xs shrink-0 px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                      {projTasks.length}
                    </span>
                  </div>

                  {/* Tiny progress bar */}
                  <div className="w-full bg-black/10 rounded-full h-1 mt-2">
                    <div
                      className={`h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Members of selected project */}
        {activeProject && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Project Members
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeProject.members.length > 0 ? (
                activeProject.members.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-xs font-medium text-slate-600 border border-slate-200 rounded-lg flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    {m}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 font-normal">No members assigned</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Tasks Panel */}
      <div className="lg:col-span-3 space-y-6">
        {/* Active Project Header Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg font-mono">
              {activeProject ? activeProject.subject : 'ALL SUBJECTS'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {activeProject ? activeProject.name : t.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {activeProject ? activeProject.description : t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {activeProject ? (
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900 font-mono">{activeProject.progress}%</span>
                <span className="block text-xs text-slate-400 font-medium">Completed</span>
                <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${activeProject.progress}%` }} />
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center min-w-[120px]">
                <span className="block text-2xl font-black text-indigo-600 font-mono">
                  {tasks.filter(t => t.status === 'done').length}/{tasks.length}
                </span>
                <span className="text-xs text-indigo-500 font-medium font-sans">Total Completed</span>
              </div>
            )}

            <button
              id="btn-add-task"
              onClick={() => {
                if (projects.length > 0) {
                  setNewTaskProjId(selectedProjectId === 'all' ? projects[0].id : selectedProjectId);
                  setShowAddTask(true);
                } else {
                  alert('Please create a project first.');
                }
              }}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              {t.addTask}
            </button>
          </div>
        </div>

        {/* Task Filters & Task List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">{t.status}:</span>
              {(['all', 'todo', 'in_progress', 'done'] as const).map((status) => (
                <button
                  id={`filter-btn-${status}`}
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status === 'all' ? 'All' : t[status]}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredTasks.length} tasks
            </span>
          </div>

          {/* Task Entries */}
          <div className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const proj = projects.find(p => p.id === task.projectId);
                  // Calculate days remaining dynamically
                  const today = new Date('2026-06-29'); // Set to current system time
                  const due = new Date(task.dueDate);
                  const diffTime = due.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isOverdue = diffDays < 0 && task.status !== 'done';
                  const isSoon = diffDays >= 0 && diffDays <= 2 && task.status !== 'done';

                  return (
                    <motion.div
                      id={`task-item-${task.id}`}
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`px-6 py-4 hover:bg-slate-50/50 transition-colors flex items-start justify-between gap-4 ${
                        task.status === 'done' ? 'opacity-65' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <button
                          id={`btn-toggle-task-${task.id}`}
                          onClick={() => handleToggleStatus(task.id)}
                          className="mt-1 transition-transform active:scale-90"
                        >
                          {getStatusIcon(task.status)}
                        </button>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`text-base font-semibold text-slate-800 ${
                              task.status === 'done' ? 'line-through text-slate-400' : ''
                            }`}>
                              {task.title}
                            </h4>
                            {selectedProjectId === 'all' && proj && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 font-mono">
                                {proj.name.split('/')[0].trim()}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                            {task.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1.5 flex-wrap">
                            <span className="flex items-center gap-1 font-medium text-slate-500">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {t.dueDate}: {task.dueDate}
                            </span>

                            {getPriorityBadge(task.priority)}

                            {task.assignedTo && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                {task.assignedTo}
                              </span>
                            )}

                            {/* Warnings / Badges */}
                            {isOverdue && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 animate-pulse border border-red-200">
                                {t.overdue}
                              </span>
                            )}
                            {isSoon && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 animate-pulse border border-amber-200">
                                {t.daysRemaining.replace('{days}', String(diffDays))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        id={`btn-delete-task-${task.id}`}
                        onClick={() => handleDeleteTask(task.id, task.projectId)}
                        className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <div className="inline-flex p-4 rounded-full bg-slate-50 border border-slate-100 mb-4 text-slate-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">{t.noProjects}</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MODAL: ADD PROJECT */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">{t.addProject}</h3>
              <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.projectName} *</label>
                <input
                  id="input-project-name"
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  placeholder="e.g., Graduation Thesis Work"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.subject} *</label>
                <input
                  id="input-project-subject"
                  type="text"
                  required
                  value={newProjSubject}
                  onChange={(e) => setNewProjSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  placeholder="e.g., Database Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.description}</label>
                <textarea
                  id="input-project-desc"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm h-20"
                  placeholder="Add a short synopsis of the project workload..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.members}</label>
                <input
                  id="input-project-members"
                  type="text"
                  value={newProjMembers}
                  onChange={(e) => setNewProjMembers(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  placeholder="John Doe, Mary Sue, Arthur Pendragon"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  id="btn-submit-project"
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  {t.create}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">{t.addTask}</h3>
              <button onClick={() => setShowAddTask(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.projectName}</label>
                <select
                  id="select-task-project"
                  value={newTaskProjId}
                  onChange={(e) => setNewTaskProjId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.taskTitle} *</label>
                <input
                  id="input-task-title"
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  placeholder="e.g., Code API endpoints"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.description}</label>
                <textarea
                  id="input-task-desc"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm h-20"
                  placeholder="Detailed assignment parameters..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.dueDate}</label>
                  <input
                    id="input-task-due"
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{t.priority}</label>
                  <select
                    id="select-task-priority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm bg-white"
                  >
                    <option value="low">{t.low}</option>
                    <option value="medium">{t.medium}</option>
                    <option value="high">{t.high}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Assignee</label>
                <input
                  id="input-task-assignee"
                  type="text"
                  value={newTaskAssigned}
                  onChange={(e) => setNewTaskAssigned(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                  placeholder="Name of member"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  id="btn-submit-task"
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                  {t.create}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
