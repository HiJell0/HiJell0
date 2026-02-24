import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, FileText, CheckCircle2, XCircle, AlertCircle, Plus, Send, Clock, Edit3 } from 'lucide-react';
import { format } from 'date-fns';

export default function StaffDashboard() {
  const { 
    documents, 
    updateDocumentStatus, 
    tasks, 
    addTask, 
    caseStage, 
    setCaseStage,
    firmStatus,
    setFirmStatus,
    activities,
    addActivity
  } = useAppContext();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle, description: newTaskDesc, status: 'pending' });
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addActivity({ description: `Staff Note: ${newNote}`, type: 'note' });
    setNewNote('');
  };

  const pendingDocs = documents.filter(d => d.status === 'Pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Client Overview: Alex Doe</h1>
          <p className="text-stone-500 mt-2">Manage case progress, documents, and tasks.</p>
        </div>
        <div className="flex items-center gap-3 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
          <span className="text-sm font-medium text-stone-600">Current Stage:</span>
          <select 
            value={caseStage}
            onChange={(e) => setCaseStage(e.target.value as any)}
            className="bg-transparent font-semibold text-stone-900 focus:outline-none cursor-pointer"
          >
            {['Intake', 'Document Review', 'Filing', 'Court Hearing', 'Discharge'].map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Document Review Queue */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Document Review Queue
              <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full ml-auto">
                {pendingDocs.length} pending
              </span>
            </h2>

            {pendingDocs.length === 0 ? (
              <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                <p>No documents pending review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDocs.map(doc => (
                  <div key={doc.id} className="border border-stone-200 rounded-2xl p-4 bg-stone-50">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-stone-900">{doc.name}</h3>
                        <p className="text-xs text-stone-500 mt-1">Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateDocumentStatus(doc.id, 'Approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </button>
                        <button 
                          onClick={() => setRejectingDocId(doc.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                    
                    {rejectingDocId === doc.id && (
                      <div className="mt-4 bg-white p-4 rounded-xl border border-red-100 animate-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Reason for rejection (sent to client)</label>
                        <textarea 
                          value={rejectionNote}
                          onChange={e => setRejectionNote(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                          rows={3}
                          placeholder="e.g., The second page is blurry..."
                        />
                        <div className="flex justify-end gap-2 mt-3">
                          <button 
                            onClick={() => setRejectingDocId(null)}
                            className="px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => {
                              updateDocumentStatus(doc.id, 'Needs Resubmission', rejectionNote);
                              setRejectingDocId(null);
                              setRejectionNote('');
                            }}
                            disabled={!rejectionNote.trim()}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Manage Tasks */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Manage Client Tasks
            </h2>
            
            <form onSubmit={handleAddTask} className="mb-8 bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h3 className="text-sm font-medium text-stone-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Push New Task to Client
              </h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Task Title (e.g., Upload 2023 Tax Return)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm"
                />
                <input 
                  type="text" 
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Optional description or instructions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm"
                />
                <button 
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
                >
                  Assign Task
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">Current Tasks</h3>
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-stone-500 line-through' : 'text-stone-900'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 capitalize">{task.status}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Update Firm Status */}
          <section className="bg-stone-900 rounded-3xl p-6 shadow-lg text-white">
            <h2 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-stone-400" />
              Update Firm Status
            </h2>
            <p className="text-xs text-stone-400 mb-4">This is the plain-English explanation the client sees on their dashboard.</p>
            <textarea 
              value={firmStatus}
              onChange={e => setFirmStatus(e.target.value)}
              className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-500 text-sm text-stone-200 min-h-[120px]"
            />
            <button 
              onClick={() => addActivity({ description: 'Firm status updated', type: 'note' })}
              className="w-full mt-4 bg-white text-stone-900 py-2.5 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors"
            >
              Save Status
            </button>
          </section>

          {/* Internal Notes */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Internal Notes
            </h2>
            
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="relative">
                <input 
                  type="text" 
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add a case note..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm bg-stone-50"
                />
                <button 
                  type="submit"
                  disabled={!newNote.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-stone-900 text-white rounded-lg disabled:opacity-50 hover:bg-stone-800"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {activities.filter(a => a.type === 'note').map(note => (
                <div key={note.id} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-900">{note.description.replace('Staff Note: ', '')}</p>
                  <p className="text-xs text-amber-700/70 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(note.date), 'MMM d, h:mm a')}
                  </p>
                </div>
              ))}
              {activities.filter(a => a.type === 'note').length === 0 && (
                <p className="text-sm text-stone-500 text-center py-4">No internal notes yet.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
