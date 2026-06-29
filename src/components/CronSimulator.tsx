import { useState } from 'react';
import { Task, Notification, Language } from '../types';
import { Calendar, Play, AlertCircle, CheckCircle, BellRing, Clock, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CronSimulatorProps {
  lang: Language;
  t: Record<string, string>;
  tasks: Task[];
  notifications: Notification[];
  onAddNotification: (notification: Notification) => void;
  onClearNotifications: () => void;
  onMarkRead: (id: string) => void;
  onDeleteNotification: (id: string) => void;
}

export default function CronSimulator({
  lang,
  t,
  tasks,
  notifications,
  onAddNotification,
  onClearNotifications,
  onMarkRead,
  onDeleteNotification,
}: CronSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);

  const triggerCronJob = () => {
    setIsRunning(true);
    setAuditLogs([
      '[CRON] Initializing automated midnight deadline scan...',
      '[CRON] Reading tasks from MongoDB with index check on "dueDate"...',
    ]);

    setTimeout(() => {
      // Find tasks that are either overdue, due today, or due within 2 days
      const today = new Date('2026-06-29'); // Today according to metadata
      let foundCount = 0;
      const logs: string[] = [
        ...auditLogs,
        `[CRON] Total pending/in-progress tasks to verify: ${tasks.filter(t => t.status !== 'done').length}`,
      ];

      tasks.forEach((task) => {
        if (task.status === 'done') return;

        const due = new Date(task.dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          // Overdue task
          const alertMsg = `⚠️ ALERT: Task "${task.title}" is OVERDUE by ${Math.abs(diffDays)} days!`;
          logs.push(`[CRON-WARN] Overdue task found: ${task.title}`);
          foundCount++;

          onAddNotification({
            id: 'notif_' + Date.now() + Math.random().toString(36).substr(2, 4),
            title: lang === 'ja' ? '【警告】期限超過タスク' : lang === 'uz' ? '⚠️ OGOHLANTIRISH: Muddati oʻtgan' : '⚠️ WARNING: Overdue Task',
            message: lang === 'ja' 
              ? `「${task.title}」の締切（${task.dueDate}）を ${Math.abs(diffDays)}日 超過しています。至急対応してください！` 
              : lang === 'uz'
                ? `"${task.title}" vazifasi topshirilishi ${Math.abs(diffDays)} kunga kechikdi! (Muddat: ${task.dueDate})`
                : `Task "${task.title}" is overdue by ${Math.abs(diffDays)} days (Due: ${task.dueDate}). Take action immediately!`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning',
            read: false,
          });
        } else if (diffDays >= 0 && diffDays <= 2) {
          // Approaching deadline
          const alertMsg = `⏰ NOTIFY: Task "${task.title}" is due soon (${diffDays} days remaining)`;
          logs.push(`[CRON-INFO] Approaching task found: ${task.title} (${diffDays} days left)`);
          foundCount++;

          onAddNotification({
            id: 'notif_' + Date.now() + Math.random().toString(36).substr(2, 4),
            title: lang === 'ja' ? '【通知】締切間近のタスク' : lang === 'uz' ? '⏰ DIQQAT: Muddat yaqin' : '⏰ NOTIFICATION: Approaching Due Date',
            message: lang === 'ja'
              ? `「${task.title}」の締切が近づいています（残り ${diffDays} 日 / 期限：${task.dueDate}）。`
              : lang === 'uz'
                ? `"${task.title}" vazifasining muddati yaqinlashmoqda (${diffDays} kun qoldi / Muddat: ${task.dueDate}).`
                : `Task "${task.title}" is due soon (${diffDays} days remaining / Due: ${task.dueDate}).`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'info',
            read: false,
          });
        }
      });

      logs.push(`[CRON] Verification finished. ${foundCount} notifications successfully generated.`);
      setAuditLogs(logs);
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Simulation Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.cronSimulatorTitle}</h2>
            <p className="text-sm text-slate-500 font-mono mt-0.5">📅 Simulated System Date: June 29, 2026</p>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
          {t.cronDescription}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            id="btn-trigger-cron"
            disabled={isRunning}
            onClick={triggerCronJob}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all text-white shadow-sm shadow-indigo-100 ${
              isRunning 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            {t.triggerCron}
          </button>

          {notifications.length > 0 && (
            <button
              id="btn-clear-notifications"
              onClick={onClearNotifications}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-600 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors"
            >
              Clear Inbox
            </button>
          )}
        </div>
      </div>

      {/* Audit Logs & Live Notification Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Terminal Logs */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs flex flex-col justify-between min-h-[300px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> cron-daemon.log</span>
              <span>node-cron 3.0.0</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {auditLogs.length > 0 ? (
                auditLogs.map((log, index) => {
                  let colorClass = 'text-slate-300';
                  if (log.includes('[CRON-WARN]')) colorClass = 'text-amber-400 font-bold';
                  if (log.includes('[CRON-INFO]')) colorClass = 'text-indigo-400';
                  if (log.includes('finished')) colorClass = 'text-emerald-400 font-semibold';
                  return (
                    <div key={index} className={`leading-relaxed ${colorClass}`}>
                      {log}
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-500 italic">No logs. Trigger the cron check to view background operations.</div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-900 pt-3 text-[10px] text-slate-500 flex justify-between items-center">
            <span>Daemon: online</span>
            <span>Interval: 0 0 * * * (Midnight)</span>
          </div>
        </div>

        {/* Live Inbox */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="font-bold text-slate-950 text-base mb-4 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-indigo-500" />
              {t.upcomingDeadlines}
            </h3>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <motion.div
                      id={`notif-${n.id}`}
                      key={n.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        n.read 
                          ? 'bg-slate-50 border-slate-100 opacity-60' 
                          : n.type === 'warning'
                            ? 'bg-red-50/60 border-red-100 shadow-xs shadow-red-50'
                            : 'bg-indigo-50/60 border-indigo-100 shadow-xs shadow-indigo-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 ${
                          n.type === 'warning' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${
                              n.type === 'warning' ? 'text-red-950' : 'text-indigo-950'
                            }`}>
                              {n.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{n.message}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            id={`btn-read-${n.id}`}
                            onClick={() => onMarkRead(n.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          id={`btn-del-notif-${n.id}`}
                          onClick={() => onDeleteNotification(n.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">{t.emptyNotifications}</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
