import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CaseStage = 'Getting Started' | 'Building Your Case' | 'Protected' | '341 Meeting' | 'Fresh Start';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  type: 'form' | 'document' | 'payment' | 'review';
  link?: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
}

export interface Debt {
  id: string;
  creditor: string;
  amount: number;
  source: 'Credit Report' | 'User Added';
}

export interface IncomeSource {
  id: string;
  type: string;
  amount: number;
}

export interface Document {
  id: string;
  name: string;
  status: 'Approved' | 'Rejected' | 'Needs Resubmission' | 'Pending';
  note?: string;
  uploadedAt: string;
}

export interface Activity {
  id: string;
  description: string;
  date: string;
  type: 'document' | 'payment' | 'task' | 'milestone' | 'note';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface BillingInfo {
  balance: number;
  nextPaymentDue: string;
  nextPaymentAmount: number;
}

interface AppState {
  userRole: 'client' | 'staff';
  setUserRole: (role: 'client' | 'staff') => void;
  caseStage: CaseStage;
  setCaseStage: (stage: CaseStage) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  completeTask: (id: string) => void;
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  updateDocumentStatus: (id: string, status: Document['status'], note?: string) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  billing: BillingInfo;
  makePayment: (amount: number) => void;
  assignedStaff: StaffMember[];
  firmStatus: string;
  setFirmStatus: (status: string) => void;
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  incomeSources: IncomeSource[];
  addIncomeSource: (source: Omit<IncomeSource, 'id'>) => void;
}

const defaultState: AppState = {
  userRole: 'client',
  setUserRole: () => {},
  caseStage: 'Building Your Case',
  setCaseStage: () => {},
  tasks: [],
  setTasks: () => {},
  addTask: () => {},
  completeTask: () => {},
  documents: [],
  setDocuments: () => {},
  updateDocumentStatus: () => {},
  activities: [],
  addActivity: () => {},
  billing: { balance: 0, nextPaymentDue: '', nextPaymentAmount: 0 },
  makePayment: () => {},
  assignedStaff: [],
  firmStatus: '',
  setFirmStatus: () => {},
  assets: [],
  addAsset: () => {},
  debts: [],
  addDebt: () => {},
  incomeSources: [],
  addIncomeSource: () => {},
};

const AppContext = createContext<AppState>(defaultState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<'client' | 'staff'>('client');
  const [caseStage, setCaseStage] = useState<CaseStage>('Building Your Case');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'task-1', title: 'Review Your Information', status: 'pending', type: 'form', link: '/intake', dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
    { id: 'task-2', title: 'Upload Recent Pay Stubs', status: 'pending', type: 'document', link: '/documents', dueDate: new Date(Date.now() + 86400000 * 3).toISOString() },
    { id: 'task-3', title: 'Make Initial Retainer Payment', status: 'pending', type: 'payment', link: '/billing' },
    { id: 'task-4', title: 'Sign Retainer Agreement', status: 'completed', type: 'review' },
  ]);
  const [assets, setAssets] = useState<Asset[]>([
    { id: 'asset-1', name: '2018 Toyota Camry', value: 15000 },
  ]);
  const [debts, setDebts] = useState<Debt[]>([
    { id: 'debt-1', creditor: 'Chase Bank', amount: 5000, source: 'Credit Report' },
    { id: 'debt-2', creditor: 'Capital One', amount: 2500, source: 'Credit Report' },
  ]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: 'income-1', type: 'W-2 Employment', amount: 4500 },
  ]);
  const [documents, setDocuments] = useState<Document[]>([
    { id: 'doc-1', name: "Driver's License", status: 'Approved', uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
    { id: 'doc-2', name: 'Social Security Card', status: 'Approved', uploadedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
    { id: 'doc-3', name: 'Tax Returns', status: 'Approved', uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    { id: 'doc-4', name: 'Bank Statements', status: 'Approved', uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'doc-5', name: 'Vehicle Titles', status: 'Needs Resubmission', note: 'Image is too dark. Please retake in better lighting.', uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'doc-6', name: 'Mortgage Statements', status: 'Needs Resubmission', note: 'Missing page 2 of the statement.', uploadedAt: new Date(Date.now() - 43200000).toISOString() },
    { id: 'doc-7', name: 'Retirement Statements', status: 'Pending', uploadedAt: new Date(Date.now() - 3600000).toISOString() },
  ]);
  const [activities, setActivities] = useState<Activity[]>([
    { id: 'act-1', description: 'Retainer agreement signed', date: new Date(Date.now() - 86400000 * 6).toISOString(), type: 'milestone' },
    { id: 'act-2', description: 'Initial payment of $500 received', date: new Date(Date.now() - 86400000 * 6).toISOString(), type: 'payment' },
    { id: 'act-3', description: 'ID Card approved', date: new Date(Date.now() - 86400000 * 4).toISOString(), type: 'document' },
    { id: 'act-4', description: 'Tax Return needs resubmission', date: new Date(Date.now() - 86400000 * 1).toISOString(), type: 'document' },
  ]);
  const [billing, setBilling] = useState<BillingInfo>({
    balance: 1500,
    nextPaymentDue: new Date(Date.now() + 86400000 * 15).toISOString(),
    nextPaymentAmount: 500,
  });
  const [assignedStaff] = useState<StaffMember[]>([
    { id: '1', name: 'Sarah Jenkins', role: 'Paralegal', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: '2', name: 'David Lincoln', role: 'Lead Attorney', avatar: 'https://i.pravatar.cc/150?u=david' },
  ]);
  const [firmStatus, setFirmStatus] = useState('We are currently reviewing your initial documents and waiting for you to complete the intake forms before we can draft your petition.');

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks((prev) => [newTask, ...prev]);
    addActivity({ description: `New task added: ${task.title}`, type: 'task' });
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed' } : t))
    );
    const task = tasks.find((t) => t.id === id);
    if (task) {
      addActivity({ description: `Task completed: ${task.title}`, type: 'task' });
    }
  };

  const updateDocumentStatus = (id: string, status: Document['status'], note?: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status, note } : d))
    );
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      addActivity({ description: `Document "${doc.name}" marked as ${status}`, type: 'document' });
    }
  };

  const addActivity = (activity: Omit<Activity, 'id' | 'date'>) => {
    const newActivity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const makePayment = (amount: number) => {
    setBilling((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - amount),
      nextPaymentAmount: Math.min(prev.nextPaymentAmount, Math.max(0, prev.balance - amount)),
    }));
    addActivity({ description: `Payment of $${amount} received. Thank you!`, type: 'payment' });
  };

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    setAssets(prev => [...prev, { ...asset, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    setDebts(prev => [...prev, { ...debt, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const addIncomeSource = (source: Omit<IncomeSource, 'id'>) => {
    setIncomeSources(prev => [...prev, { ...source, id: Math.random().toString(36).substr(2, 9) }]);
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        caseStage,
        setCaseStage,
        tasks,
        setTasks,
        addTask,
        completeTask,
        documents,
        setDocuments,
        updateDocumentStatus,
        activities,
        addActivity,
        billing,
        makePayment,
        assignedStaff,
        firmStatus,
        setFirmStatus,
        assets,
        addAsset,
        debts,
        addDebt,
        incomeSources,
        addIncomeSource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
