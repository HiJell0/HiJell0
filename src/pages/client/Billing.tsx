import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CreditCard, DollarSign, Calendar, CheckCircle2, ShieldCheck, ArrowRight, Lock, Filter, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const RadialDial = ({ value, onChange, max }: { value: number, onChange: (val: number) => void, max: number }) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const calculateValue = (clientX: number, clientY: number) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    let normalizedAngle = angle + Math.PI / 2;
    if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;
    
    const percentage = normalizedAngle / (2 * Math.PI);
    const newValue = Math.round(percentage * max);
    
    // Prevent jumping between 0 and max
    const threshold = max * 0.2; // 20% threshold
    if (value > max - threshold && newValue < threshold) {
      onChange(max);
      return;
    }
    if (value < threshold && newValue > max - threshold) {
      onChange(0);
      return;
    }

    onChange(Math.min(max, Math.max(0, newValue)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    calculateValue(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      calculateValue(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const radius = 85;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;
  
  // Planned payment marker
  const plannedPayment = 500; // Hardcoded as per user's "planned payment" context
  const plannedPercentage = plannedPayment / max;
  const plannedAngle = plannedPercentage * 2 * Math.PI - Math.PI / 2;
  const plannedX = 100 + radius * Math.cos(plannedAngle);
  const plannedY = 100 + radius * Math.sin(plannedAngle);

  const percentage = value / max;
  const strokeDashoffset = circumference - percentage * circumference;
  const angle = percentage * 2 * Math.PI - Math.PI / 2;
  const handleX = 100 + radius * Math.cos(angle);
  const handleY = 100 + radius * Math.sin(angle);

  return (
    <div className="relative w-72 h-72 mx-auto select-none">
      <svg 
        ref={dialRef}
        viewBox="0 0 200 200" 
        className="w-full h-full cursor-pointer touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={(e) => {
          setIsDragging(true);
          calculateValue(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (isDragging) calculateValue(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Background Track */}
        <circle 
          cx="100" cy="100" r={radius} 
          className="stroke-stone-100 fill-none" 
          strokeWidth={strokeWidth} 
        />
        {/* Active Track (Red/Orange segment) */}
        <circle 
          cx="100" cy="100" r={radius} 
          className="stroke-red-500 fill-none transition-all duration-75" 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
        {/* Planned Payment Dot */}
        <circle 
          cx={plannedX} cy={plannedY} r="4" 
          className="fill-stone-400 stroke-white" 
          strokeWidth="2" 
        />
        {/* Handle */}
        <circle 
          cx={handleX} cy={handleY} r="12" 
          className="fill-red-500 stroke-white shadow-xl" 
          strokeWidth="3" 
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Remaining Balance</span>
        <div className="text-4xl font-bold text-stone-900 tracking-tight">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
      </div>
    </div>
  );
};

export default function Billing() {
  const { billing, makePayment } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(billing.nextPaymentAmount);

  const handlePayment = () => {
    makePayment(paymentAmount);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto pb-12">
      {/* Section 1 — Main Balance Card */}
      <div className="bg-[#00668a] rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-stone-200 font-bold tracking-widest uppercase text-[10px] mb-1">Remaining Balance</h2>
          <div className="text-5xl font-bold tracking-tight mb-8">
            $1,000.00
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${(500 / 1500) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              <span>Paid: $500</span>
              <span>Total: $1,500</span>
            </div>
          </div>

          <button 
            onClick={() => setShowModal(true)}
            className="w-full text-left bg-stone-950/40 rounded-2xl p-5 border border-white/5 backdrop-blur-sm hover:bg-stone-950/60 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-stone-100">
                <Calendar className="w-4 h-4 text-[#ff8f00]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-[#ff8f00] transition-colors">Make a payment</span>
              </div>
              <span className="text-[#ff8f00] font-bold text-lg">
                ${billing.nextPaymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[11px] text-stone-200 font-medium tracking-wide">
              planned payment date: March 10, 2026
            </p>
          </button>
        </div>
      </div>

      {/* Bottom Box: Payment History */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden divide-y divide-stone-100">
        <div>
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Payment History</h3>
          </div>
          <div className="divide-y divide-stone-50">
            {/* Installment 1: Paid */}
            <div className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Installment 1 of 3</p>
                  <p className="text-[11px] text-stone-500 font-medium tracking-tight">Paid on {format(new Date(Date.now() - 86400000 * 30), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">$500.00</p>
                <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold uppercase tracking-wider rounded-full mt-1">
                  PAID
                </span>
              </div>
            </div>

            {/* Installment 2: Upcoming */}
            <div className="p-6 flex items-center justify-between bg-[#ff8f00]/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#ff8f00]/20 rounded-xl flex items-center justify-center text-[#ff8f00]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Installment 2 of 3</p>
                  <p className="text-[11px] text-stone-500 font-medium tracking-tight">Due on {format(new Date(billing.nextPaymentDue), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">$500.00</p>
                <span className="inline-block px-2 py-0.5 bg-[#ff8f00]/20 text-[#ff8f00] text-[9px] font-bold uppercase tracking-wider rounded-full mt-1">
                  UPCOMING
                </span>
              </div>
            </div>

            {/* Installment 3: Scheduled */}
            <div className="p-6 flex items-center justify-between opacity-50 grayscale">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">Installment 3 of 3</p>
                  <p className="text-[11px] text-stone-500 font-medium tracking-tight">Scheduled</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-stone-900">$500.00</p>
                <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-400 text-[9px] font-bold uppercase tracking-wider rounded-full mt-1">
                  SCHEDULED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full sm:max-w-[66vw] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between">
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-blue-500 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>

              <div className="px-8 pb-12 text-center space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-stone-900">Choose Amount</h3>
                  <p className="text-stone-500 text-sm mt-1">Make payments by March 31.</p>
                </div>

                <RadialDial 
                  value={paymentAmount} 
                  onChange={setPaymentAmount} 
                  max={1000} 
                />

                <div className="space-y-4">
                  <button 
                    onClick={handlePayment}
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-colors"
                  >
                    Pay Now
                  </button>
                  <button className="text-blue-500 font-bold text-sm">
                    Show Keypad
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
