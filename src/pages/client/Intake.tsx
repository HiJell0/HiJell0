import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  User, 
  Home, 
  Car, 
  CreditCard, 
  Briefcase, 
  AlertCircle, 
  X, 
  Send, 
  Paperclip,
  Wallet,
  Building2,
  Users
} from 'lucide-react';

export default function YourInformation() {
  const { assets, debts, incomeSources } = useAppContext();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const personalInfo = {
    name: 'Alex Doe',
    ssn: '***-**-1234',
    dob: '05/12/1985',
    address: '123 Maple Avenue, Springfield, IL 62704',
    maritalStatus: 'Single',
    dependents: '0',
  };

  const expenses = [
    { category: 'Rent/Mortgage', amount: 1200 },
    { category: 'Utilities', amount: 250 },
    { category: 'Food/Groceries', amount: 400 },
    { category: 'Transportation', amount: 150 },
    { category: 'Insurance', amount: 100 },
  ];

  const InfoSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-50 bg-stone-50/50 flex items-center gap-3">
        <Icon className="w-5 h-5 text-stone-400" />
        <h3 className="font-semibold text-stone-900">{title}</h3>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );

  const DataRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between py-2 border-b border-stone-50 last:border-0">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-medium text-stone-900">{value}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <button 
          onClick={() => setIsUpdateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#00668a] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#005573] transition-all shadow-sm"
        >
          <AlertCircle className="w-4 h-4" />
          Update Information
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <InfoSection title="Personal Details" icon={User}>
          <div className="space-y-1">
            <DataRow label="Full Name" value={personalInfo.name} />
            <DataRow label="SSN" value={personalInfo.ssn} />
            <DataRow label="Date of Birth" value={personalInfo.dob} />
            <DataRow label="Marital Status" value={personalInfo.maritalStatus} />
            <DataRow label="Dependents" value={personalInfo.dependents} />
            <div className="py-2">
              <span className="text-sm text-stone-500 block mb-1">Current Address</span>
              <span className="text-sm font-medium text-stone-900">{personalInfo.address}</span>
            </div>
          </div>
        </InfoSection>

        {/* Employment & Income */}
        <InfoSection title="Income & Employment" icon={Briefcase}>
          <div className="space-y-4">
            {incomeSources.map(source => (
              <div key={source.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-stone-900">{source.type}</span>
                  <span className="text-sm font-bold text-emerald-600">${source.amount.toLocaleString()}/mo</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-50">
              <DataRow label="Total Monthly Gross" value={`$${incomeSources.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}`} />
            </div>
          </div>
        </InfoSection>

        {/* Assets & Property */}
        <InfoSection title="Assets & Property" icon={Home}>
          <div className="space-y-3">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {asset.name.toLowerCase().includes('car') || asset.name.toLowerCase().includes('toyota') ? <Car className="w-4 h-4 text-stone-400" /> : <Building2 className="w-4 h-4 text-stone-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-stone-900">{asset.name}</p>
                  <p className="text-xs text-stone-500">Est. Value: ${asset.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </InfoSection>

        {/* Debts & Liabilities */}
        <InfoSection title="Debts & Liabilities" icon={CreditCard}>
          <div className="space-y-3">
            {debts.map(debt => (
              <div key={debt.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-stone-900">{debt.creditor}</span>
                  <span className="text-sm font-bold text-red-600">${debt.amount.toLocaleString()}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${debt.source === 'Credit Report' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {debt.source}
                </span>
              </div>
            ))}
          </div>
        </InfoSection>

        {/* Monthly Expenses */}
        <InfoSection title="Monthly Expenses" icon={Wallet}>
          <div className="space-y-1">
            {expenses.map(exp => (
              <div key={exp.category}>
                <DataRow label={exp.category} value={`$${exp.amount}`} />
              </div>
            ))}
            <div className="pt-2 border-t border-stone-50">
              <DataRow label="Total Monthly Expenses" value={`$${expenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}`} />
            </div>
          </div>
        </InfoSection>

        {/* Household Info */}
        <InfoSection title="Household Information" icon={Users}>
          <div className="space-y-1">
            <DataRow label="Household Size" value="1" />
            <DataRow label="Prior Bankruptcy Filings" value="None" />
            <DataRow label="Lawsuits/Garnishments" value="None Reported" />
            <DataRow label="Tax Filings Current" value="Yes" />
          </div>
        </InfoSection>
      </div>

      {/* Update Request Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h3 className="font-bold text-stone-900">Request Information Update</h3>
              <button 
                onClick={() => setIsUpdateModalOpen(false)}
                className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <textarea 
                value={updateMessage}
                onChange={(e) => setUpdateMessage(e.target.value)}
                placeholder="Describe what needs to be changed..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm resize-none"
              />
              <button className="w-full flex items-center justify-center gap-2 bg-stone-50 text-stone-600 hover:text-stone-900 py-3 rounded-xl text-sm font-medium border border-stone-100 transition-all">
                <Paperclip className="w-4 h-4" />
                Attach Document
              </button>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would send a message to the team
                    setIsUpdateModalOpen(false);
                    setUpdateMessage('');
                    alert('Update request sent to your legal team.');
                  }}
                  className="flex items-center gap-2 bg-[#00668a] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-[#005573] transition-all"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
