import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle2, Circle, Clock, ListTodo, ChevronDown, ChevronUp, ArrowRight, FileText, DollarSign, FileSpreadsheet, Shield, PartyPopper } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const STAGES = ['Getting Started', 'Building Your Case', 'Protected', '341 Meeting', 'Fresh Start'];

export default function Dashboard() {
  const { caseStage, tasks, activities, assignedStaff, completeTask, documents } = useAppContext();
  const [isProgressExpanded, setIsProgressExpanded] = useState(true); // Default to expanded to show the new design

  const currentStageIndex = STAGES.indexOf(caseStage);
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  // Unified Action Items
  // We want to show tasks, and also document needs if any
  const actionItems = [
    ...pendingTasks.map(t => ({ ...t, id: `task-${t.id}`, source: 'task' })),
    ...documents.filter(d => d.status === 'Needs Resubmission').map(d => ({
      id: `doc-${d.id}`,
      title: `Resubmit: ${d.name}`,
      description: d.note,
      status: 'pending',
      type: 'document',
      link: '/documents',
      source: 'document'
    }))
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Welcome back, Alex</h1>
      </div>

      {/* Case Timeline (Pizza Tracker) - Collapsible */}
      <section className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-stone-900">Case Progress</h2>
          <button 
            onClick={() => setIsProgressExpanded(!isProgressExpanded)}
            className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-xs font-medium"
          >
            {isProgressExpanded ? (
              <>Hide Details <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>View Full Timeline <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>

        {!isProgressExpanded ? (
          <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-100">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-stone-900 text-stone-900 bg-white">
              <Circle className="w-2.5 h-2.5 fill-stone-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Current Stage: {caseStage}</p>
            </div>
          </div>
        ) : (
          <div className="relative mt-2 px-2">
            {/* Progress Line Background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-stone-100 -translate-y-1/2 rounded-full hidden sm:block mx-6" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-5 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-1000 mx-6"
              style={{ width: `calc(${(currentStageIndex / (STAGES.length - 1)) * 100}% - 3rem)` }}
            />

            <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-6 sm:gap-0">
              {STAGES.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                const isProtected = stage === 'Protected';
                const isFreshStart = stage === 'Fresh Start';
                
                return (
                  <div key={stage} className="flex sm:flex-col items-center gap-2 sm:gap-1.5 flex-1 sm:text-center group">
                    <div className={`
                      relative flex items-center justify-center shrink-0 bg-white transition-all duration-500
                      ${isProtected ? 'w-10 h-10 border-[3px]' : 'w-8 h-8 border-2 mt-1'}
                      ${isCompleted ? 'border-emerald-500 text-emerald-500' : 
                        isCurrent ? 'border-stone-900 text-stone-900 scale-110' : 
                        'border-stone-200 text-stone-300'}
                      rounded-full shadow-sm
                    `}>
                      {isProtected ? (
                        <Shield className={`w-4 h-4 ${isCompleted ? 'fill-emerald-500' : isCurrent ? 'fill-stone-900' : 'fill-stone-200'}`} />
                      ) : isFreshStart ? (
                        <PartyPopper className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500' : isCurrent ? 'text-stone-900' : 'text-stone-300'}`} />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                      ) : (
                        <Circle className={`w-2.5 h-2.5 ${isCurrent ? 'fill-stone-900' : 'fill-stone-300'}`} />
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:items-center">
                      <p className={`text-sm font-bold ${isCurrent ? 'text-stone-900' : isCompleted ? 'text-stone-700' : 'text-stone-400'} ${isFreshStart && isCurrent ? 'text-emerald-600' : ''}`}>
                        {stage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Unified Action Items */}
        <div className="lg:col-span-2 space-y-4">
          
          <section className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-stone-400" />
                To-Do List
              </h2>
              <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                {actionItems.length} items
              </span>
            </div>

            {actionItems.length === 0 ? (
              <div className="text-center py-6 text-stone-500 bg-stone-50 rounded-xl border border-stone-100 border-dashed">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {actionItems.map((item) => {
                  let Icon = Circle;
                  if (item.type === 'document') Icon = FileText;
                  if (item.type === 'form') Icon = FileSpreadsheet;
                  if (item.type === 'payment') Icon = DollarSign;

                  return (
                    <div key={item.id} className="group flex items-start gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-300 hover:shadow-sm transition-all bg-white">
                      <div className={`mt-0.5 shrink-0 p-1.5 rounded-lg ${item.type === 'document' ? 'bg-blue-50 text-blue-500' : item.type === 'form' ? 'bg-purple-50 text-purple-500' : item.type === 'payment' ? 'bg-emerald-50 text-emerald-500' : 'bg-stone-50 text-stone-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-sm text-stone-900 truncate">{item.title}</h3>
                          {item.link && (
                            <Link to={item.link} className="text-stone-400 hover:text-stone-900 transition-colors shrink-0">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                        {item.description && <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{item.description}</p>}
                        {item.dueDate && (
                          <div className="flex items-center gap-1 mt-1.5 text-[10px] font-medium text-amber-600">
                            <Clock className="w-3 h-3" />
                            Due {format(new Date(item.dueDate), 'MMM d')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-4">
          <section className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 h-full">
            <h2 className="text-base font-semibold text-stone-900 mb-4">Recent Activity</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
              {[...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((activity) => {
                let Icon = CheckCircle2;
                let iconColor = 'text-stone-400 bg-stone-100';
                
                if (activity.type === 'document') { Icon = FileText; iconColor = 'text-blue-500 bg-blue-50'; }
                if (activity.type === 'payment') { Icon = DollarSign; iconColor = 'text-emerald-500 bg-emerald-50'; }
                if (activity.type === 'task') { Icon = ListTodo; iconColor = 'text-amber-500 bg-amber-50'; }
                if (activity.type === 'milestone') { Icon = CheckCircle2; iconColor = 'text-purple-500 bg-purple-50'; }

                return (
                  <div key={activity.id} className="relative flex items-center justify-between group is-active">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shrink-0 shadow-sm ${iconColor} z-10`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-[calc(100%-2.5rem)] p-3 rounded-xl border border-stone-100 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-medium text-stone-400">
                          {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
