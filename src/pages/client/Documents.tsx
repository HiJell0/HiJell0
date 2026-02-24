import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UploadCloud, 
  ChevronRight, 
  X,
  Eye,
  ArrowUpCircle,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DocState = 'not_uploaded' | 'needs_resubmission' | 'under_review' | 'approved';

interface RequiredDoc {
  id: string;
  name: string;
  description: string;
  category: string;
}

const REQUIRED_DOCS: RequiredDoc[] = [
  { id: 'id-card', name: 'Driver\'s License or ID', description: 'A clear photo of the front and back of your current, unexpired government-issued ID.', category: 'Identification' },
  { id: 'ss-card', name: 'Social Security Card', description: 'A clear photo of your original Social Security card. We need this to verify your SSN for the court filing.', category: 'Identification' },
  { id: 'pay-stubs', name: 'Last 6 Months of Pay Stubs', description: 'All pay stubs received in the last 180 days. This is critical for the "Means Test" calculation.', category: 'Income' },
  { id: 'tax-returns', name: 'Tax Returns (Last 2 Years)', description: 'Complete copies of your federal tax returns for the two most recent filing years.', category: 'Income' },
  { id: 'bank-statements', name: 'Bank Statements (3 Months)', description: 'Full statements for all checking, savings, and money market accounts for the last 90 days.', category: 'Financial' },
  { id: 'retirement', name: 'Retirement Statements', description: 'Most recent statements for 401(k), IRA, or pension accounts to document your exempt assets.', category: 'Financial' },
  { id: 'titles', name: 'Vehicle Titles', description: 'Copies of titles for any vehicles you own, even if they are currently being financed.', category: 'Assets' },
  { id: 'mortgage', name: 'Mortgage Statements', description: 'Your most recent statement showing the balance, interest rate, and escrow details for your home.', category: 'Assets' },
  { id: 'credit-cards', name: 'Credit Card Statements', description: 'The most recent statement for every credit card account, even those with zero balances.', category: 'Debt' },
];

export default function Documents() {
  const { documents } = useAppContext();
  const [selectedDoc, setSelectedDoc] = useState<RequiredDoc | null>(null);
  const [viewingDoc, setViewingDoc] = useState<RequiredDoc | null>(null);

  // Map existing documents to required checklist
  const checklist = useMemo(() => {
    return REQUIRED_DOCS.map(req => {
      // This is a simplified mapping for the mockup. 
      // In a real app, we'd have a mapping table or IDs would match.
      const uploaded = documents.find(d => d.name.toLowerCase().includes(req.name.toLowerCase().split(' ')[0].toLowerCase()));
      
      let state: DocState = 'not_uploaded';
      let note = '';
      
      if (uploaded) {
        if (uploaded.status === 'Approved') state = 'approved';
        else if (uploaded.status === 'Pending') state = 'under_review';
        else if (uploaded.status === 'Needs Resubmission' || uploaded.status === 'Rejected') {
          state = 'needs_resubmission';
          note = uploaded.note || '';
        }
      }

      return {
        ...req,
        state,
        note,
        uploadedId: uploaded?.id
      };
    }).sort((a, b) => {
      const priority = {
        'not_uploaded': 0,
        'needs_resubmission': 0,
        'under_review': 1,
        'approved': 2
      };
      return priority[a.state] - priority[b.state];
    });
  }, [documents]);

  const approvedCount = checklist.filter(d => d.state === 'approved').length;
  const totalCount = checklist.length;
  const progressPercent = (approvedCount / totalCount) * 100;

  const getStateStyles = (state: DocState) => {
    switch (state) {
      case 'not_uploaded': return { border: 'border-l-[#b91c1c]', text: 'Not Uploaded', icon: <ArrowUpCircle className="w-5 h-5 text-[#b91c1c]" /> };
      case 'needs_resubmission': return { border: 'border-l-[#ff8f00]', text: 'Needs Resubmission', icon: <AlertCircle className="w-5 h-5 text-[#ff8f00]" /> };
      case 'under_review': return { border: 'border-l-blue-500', text: 'Under Review', icon: <Clock className="w-5 h-5 text-blue-500" /> };
      case 'approved': return { border: 'border-l-emerald-500', text: 'Approved', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> };
    }
  };

  // Full Screen PDF Viewer
  if (viewingDoc) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-900 flex flex-col animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-stone-900 text-white border-b border-stone-800 pb-safe">
          <button 
            onClick={() => setViewingDoc(null)} 
            className="p-2 hover:bg-stone-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="font-medium text-lg truncate flex-1">{viewingDoc.name}</h2>
        </div>
        
        {/* PDF Placeholder */}
        <div className="flex-1 bg-stone-800 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl aspect-[8.5/11] shadow-2xl rounded-sm flex flex-col items-center justify-center text-stone-300 relative">
            <div className="absolute inset-0 border-[16px] border-stone-100 pointer-events-none"></div>
            <FileText className="w-24 h-24 mb-4 opacity-20" />
            <p className="font-mono text-sm opacity-40 uppercase tracking-widest">PDF Preview</p>
            <p className="font-mono text-xs opacity-30 mt-2">{viewingDoc.id}.pdf</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-in fade-in duration-500">
      {/* Progress Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
        <span className="text-sm font-medium text-stone-600 whitespace-nowrap">
          {approvedCount} of {totalCount} Approved
        </span>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {checklist.map((doc) => {
          const styles = getStateStyles(doc.state);
          return (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 border-l-4 ${styles.border} shadow-sm active:scale-[0.98] transition-all text-left`}
            >
              <div>
                <h3 className="font-medium text-stone-900">{doc.name}</h3>
                {/* Subtext removed as requested */}
              </div>
              <div className="flex items-center gap-2">
                {styles.icon}
                <ChevronRight className="w-4 h-4 text-stone-300" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Secondary Action */}
      <div className="mt-8 text-center">
        <button className="w-full sm:w-auto bg-white border border-stone-200 text-stone-600 font-medium px-6 py-3 rounded-xl hover:bg-stone-50 hover:text-stone-900 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <UploadCloud className="w-5 h-5" />
          Upload Additional Documents
        </button>
      </div>

      {/* Status Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 pb-4 border-t border-stone-100 pt-4">
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="w-4 h-4 text-[#b91c1c]" />
          <span className="text-xs text-stone-500 font-medium">Not Uploaded</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#ff8f00]" />
          <span className="text-xs text-stone-500 font-medium">Needs Resubmission</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-stone-500 font-medium">Under Review</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-stone-500 font-medium">Approved</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedDoc && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 p-8 shadow-2xl max-h-[90vh] overflow-y-auto pb-safe"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-stone-900 leading-tight pr-8">
                  {selectedDoc.name}
                </h2>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 bg-stone-100 rounded-full text-stone-500 hover:text-stone-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-stone-600 leading-relaxed mb-8">
                {selectedDoc.description}
              </p>

              <div className="space-y-6">
                {selectedDoc.state === 'not_uploaded' && (
                  <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all active:scale-[0.98]">
                    <UploadCloud className="w-6 h-6" />
                    Upload Document
                  </button>
                )}

                {selectedDoc.state === 'needs_resubmission' && (
                  <div className="space-y-4">
                    {selectedDoc.note && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Rejection Reason</p>
                        <p className="text-sm text-yellow-700 italic">"{selectedDoc.note}"</p>
                      </div>
                    )}
                    <button className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all active:scale-[0.98]">
                      <UploadCloud className="w-6 h-6" />
                      Upload Replacement
                    </button>
                    <button 
                      onClick={() => {
                        setViewingDoc(selectedDoc);
                        setSelectedDoc(null);
                      }}
                      className="w-full bg-white border border-stone-200 text-stone-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-50 transition-all active:scale-[0.98]"
                    >
                      <Eye className="w-6 h-6" />
                      View Submitted Document
                    </button>
                  </div>
                )}

                {selectedDoc.state === 'under_review' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                      <Clock className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                      <p className="text-blue-900 font-medium">Under Review</p>
                      <p className="text-blue-700 text-sm mt-1">Our team is currently verifying this document.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setViewingDoc(selectedDoc);
                        setSelectedDoc(null);
                      }}
                      className="w-full bg-white border border-stone-200 text-stone-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-50 transition-all active:scale-[0.98]"
                    >
                      <Eye className="w-6 h-6" />
                      View Document
                    </button>
                  </div>
                )}

                {selectedDoc.state === 'approved' && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                      <p className="text-emerald-900 font-medium">Approved</p>
                      <p className="text-emerald-700 text-sm mt-1">This document has been verified.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setViewingDoc(selectedDoc);
                        setSelectedDoc(null);
                      }}
                      className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-stone-800 transition-all active:scale-[0.98]"
                    >
                      <Eye className="w-6 h-6" />
                      View Document
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
