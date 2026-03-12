import React, { useState, useEffect } from 'react';
import { PlotType, CalculationResult } from '../types';
import { Calculator, CheckCircle2, Minus, Plus } from 'lucide-react';

export const InvestmentCalculator: React.FC = () => {
  const [numPlots, setNumPlots] = useState<number>(1);
  const [plotType, setPlotType] = useState<PlotType>(PlotType.STANDARD);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(10);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [result, setResult] = useState<CalculationResult>({
    totalAed: 0,
    totalInr: 0,
    bookingAmountAed: 0,
    monthlyEmiAed: 0
  });

  const BASE_PRICE_AED = 131;
  const BASE_PRICE_INR = 3275;
  const PLOT_SIZE_SQFT = 1000;

  useEffect(() => {
    let premiumMultiplier = 1;
    if (plotType === PlotType.GARDEN || plotType === PlotType.CORNER) {
      premiumMultiplier = 1.05;
    }

    const totalSqFt = numPlots * PLOT_SIZE_SQFT;
    const totalAed = Math.round(totalSqFt * BASE_PRICE_AED * premiumMultiplier);
    const totalInr = Math.round(totalSqFt * BASE_PRICE_INR * premiumMultiplier);
    const booking = Math.round(totalAed * (downPaymentPct / 100));
    const balance = totalAed - booking;
    const emi = Math.round(balance / (tenureYears * 12));

    setResult({
      totalAed,
      totalInr,
      bookingAmountAed: booking,
      monthlyEmiAed: emi
    });
  }, [numPlots, plotType, downPaymentPct, tenureYears]);

  const handleDecrement = () => {
    if (numPlots > 1) setNumPlots(prev => prev - 1);
  };

  const handleIncrement = () => {
    setNumPlots(prev => prev + 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] p-6 md:p-8 border-t-4 border-gold-500">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-3 bg-gold-50 rounded-full text-gold-600">
          <Calculator size={24} />
        </div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-deepblue-900">Investment Calculator</h3>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Asset Stepper */}
        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Number of Plots (1,000 sq.ft each)</label>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-gold-400 text-gold-600 hover:bg-gold-50 transition-colors disabled:opacity-50 touch-manipulation"
              disabled={numPlots <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="text-3xl md:text-4xl font-serif font-bold text-deepblue-900 min-w-[3ch] text-center">
              {numPlots.toString().padStart(2, '0')}
            </span>
            <button 
               onClick={handleIncrement}
               className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-gold-400 text-gold-600 hover:bg-gold-50 transition-colors touch-manipulation"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Plot Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Plot Preference</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
            {Object.values(PlotType).map((type) => (
              <button
                key={type}
                onClick={() => setPlotType(type)}
                className={`px-3 py-3 rounded-lg text-sm font-semibold border transition-all duration-300 ${
                  plotType === type 
                    ? 'bg-gold-500 text-white border-gold-500 shadow-md' 
                    : 'bg-white text-gray-900 border-gray-200 hover:border-gold-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          {plotType !== PlotType.STANDARD && (
            <p className="text-xs text-gold-600 mt-2 font-medium flex items-center gap-1 animate-fade-in-up">
              <CheckCircle2 size={12} /> Includes 5% Premium
            </p>
          )}
        </div>

        {/* Down Payment & Tenure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Down Payment (%)</label>
            <select 
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all bg-white text-gray-900 font-medium"
            >
              <option value={10}>10%</option>
              <option value={20}>20%</option>
              <option value={30}>30%</option>
              <option value={40}>40%</option>
              <option value={50}>50%</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Tenure (Years)</label>
            <select 
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all bg-white text-gray-900 font-medium"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={4}>4 Years</option>
              <option value={5}>5 Years</option>
            </select>
          </div>
        </div>

        {/* Results Display - Hierarchy Flip */}
        <div className="bg-gray-50/50 rounded-2xl p-6 md:p-8 text-center space-y-6 border border-gray-100">
           {/* Hero EMI */}
           <div>
             <p className="text-gray-500 text-xs md:text-sm font-medium uppercase tracking-wider mb-1">Monthly Installment ({tenureYears} Years)</p>
             <div className="text-4xl sm:text-4xl md:text-5xl font-serif font-bold text-gold-500">
               AED {result.monthlyEmiAed.toLocaleString()}
             </div>
           </div>

           <div className="w-full h-px bg-gray-200"></div>

           {/* Secondary Stats */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div>
                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Asset Value</p>
                 <p className="text-lg font-bold text-deepblue-900">AED {result.totalAed.toLocaleString()}</p>
                 <p className="text-xs text-gray-400">₹ {result.totalInr.toLocaleString()}</p>
              </div>
              <div className="sm:text-right mt-2 sm:mt-0">
                 <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{downPaymentPct}% Down Payment</p>
                 <p className="text-lg font-bold text-deepblue-900">AED {result.bookingAmountAed.toLocaleString()}</p>
              </div>
           </div>
        </div>

        <p className="text-[10px] text-center text-gray-400 italic">
          *Prices are indicative. Currency conversion rates may vary. 0% Interest Plan.
        </p>
      </div>
    </div>
  );
};