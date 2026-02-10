
import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Check, Leaf, Crown, Calendar, Info, ChevronDown, Globe, Menu, X, Phone, Download, Linkedin, Instagram, Twitter, MessageCircle, ShieldCheck, Building2, CreditCard, Map, BarChart3, FileText, Compass, Plane, GraduationCap, Landmark, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { InvestmentCalculator } from './Calculator';
import { AuthModal } from './AuthModal';
import { LocationModal } from './LocationModal';
import { GeminiAdvisor } from './GeminiAdvisor';
import { FadeIn } from './FadeIn';
import { CookieConsent } from './CookieConsent';

// Constants
const HERO_IMG = "https://iili.io/fQnWtRe.jpg";
const LOGO_URL = "https://iili.io/fQj13Ge.webp";
const GOV_LOGO = "https://raktda.com/wp-content/themes/raktda-corporate/assets/images/raktda-logo.svg";
const RERA_LOGO = "https://dubailand.gov.ae/assets/img/land_department.svg"; 

const APP_VERSION = '1.0.12'; 

interface LandingPageProps {
    onLogin: (role: 'client' | 'agent' | 'admin') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const openAuth = () => setIsAuthModalOpen(true);
  const closeAuth = () => setIsAuthModalOpen(false);
  const openLocation = () => setIsLocationOpen(true);
  const closeLocation = () => setIsLocationOpen(false);

  useEffect(() => {
    // Cookie Logic
    if (localStorage.getItem('cookie_consent') === null) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    localStorage.setItem('app_version', APP_VERSION);
    setShowCookieBanner(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookie_consent', 'false');
    localStorage.removeItem('app_version');
    setShowCookieBanner(false);
  };

  const handleMobileLink = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white relative selection:bg-gold-500 selection:text-white">
      
      {/* Cookie Consent */}
      {showCookieBanner && (
        <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />
      )}

      {/* Navigation */}
      <nav className="absolute w-full z-40 top-0 left-0 border-b border-white/10 backdrop-blur-md bg-deepblue-900/30 transition-all duration-300">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <a href="#" className="block relative z-50 group">
            {/* Logo */}
            <img 
              src={LOGO_URL} 
              alt="RAK Oasis" 
              className="h-14 md:h-24 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-8 text-white/90 font-light tracking-wide text-sm items-center">
            <a href="#overview" className="hover:text-gold-400 transition underline-offset-4 hover:underline">Overview</a>
            <a href="#pricing" className="hover:text-gold-400 transition underline-offset-4 hover:underline">Pricing</a>
            <a href="#payment" className="hover:text-gold-400 transition underline-offset-4 hover:underline">Payment Plan</a>
            <button onClick={openLocation} className="hover:text-gold-400 transition flex items-center gap-1">
               <Globe size={14} /> Location
            </button>
            <a href="#ai-advisor" className="hover:text-gold-400 transition flex items-center gap-2">
              <span className="bg-gold-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-normal">AI</span> Advisor
            </a>
            <Button variant="outline-white" onClick={openAuth} className="!px-6 !py-2 !text-xs uppercase tracking-widest hover:!bg-gold-500 hover:!border-gold-500 hover:!text-white">
              Client Portal
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="lg:hidden text-white p-2 relative z-50 hover:text-gold-400 transition-colors duration-300 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible delay-200'
        }`}
      >
        <div className="absolute inset-0 bg-deepblue-900/95 backdrop-blur-md"></div>

        <div 
           className={`relative z-10 h-full w-full flex flex-col items-center justify-center transition-transform duration-500 ease-out ${
             isMobileMenuOpen ? 'translate-y-0' : 'translate-y-8'
           }`}
        >
             <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 p-2 focus:outline-none"
                aria-label="Close Menu"
             >
                <X size={32} />
             </button>

             <div className="absolute top-6 left-6 opacity-100 hover:grayscale-0 transition-all duration-500">
                <img src={LOGO_URL} alt="RAK Oasis" className="h-12 w-auto" />
             </div>

             <div className="flex flex-col gap-8 text-center w-full px-8 max-w-md">
                <nav className="flex flex-col gap-6 text-2xl font-serif text-white">
                  <a href="#overview" onClick={handleMobileLink} className="hover:text-gold-400 transition-colors duration-300 transform hover:scale-105 inline-block">Overview</a>
                  <a href="#pricing" onClick={handleMobileLink} className="hover:text-gold-400 transition-colors duration-300 transform hover:scale-105 inline-block">Pricing</a>
                  <a href="#payment" onClick={handleMobileLink} className="hover:text-gold-400 transition-colors duration-300 transform hover:scale-105 inline-block">Payment Plan</a>
                </nav>
                
                <div className="w-16 h-[1px] bg-white/10 mx-auto my-2"></div>

                <div className="flex flex-col gap-4 text-white/90">
                    <button onClick={() => { openLocation(); handleMobileLink(); }} className="hover:text-gold-400 transition flex items-center justify-center gap-3 text-lg group">
                       <span className="p-2 bg-white/5 rounded-full group-hover:bg-gold-500/20 transition-colors"><Globe size={18} /></span> 
                       Location Map
                    </button>
                    
                    <a href="#ai-advisor" onClick={handleMobileLink} className="hover:text-gold-400 transition flex items-center justify-center gap-3 text-lg group">
                      <span className="p-2 bg-white/5 rounded-full group-hover:bg-gold-500/20 transition-colors"><span className="text-gold-500 font-bold text-xs">AI</span></span>
                      Investment Advisor
                    </a>
                </div>

                <div className="pt-8 w-full">
                  <Button variant="primary" onClick={() => { openAuth(); setIsMobileMenuOpen(false); }} className="w-full justify-center py-4 text-lg shadow-gold-500/20 shadow-2xl">
                    Inquire / Login
                  </Button>
                </div>
             </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={HERO_IMG}
            alt="Ras Al Khaimah Luxury Estate Masterplan" 
            className="w-full h-full object-cover animate-ken-burns origin-center"
            fetchPriority="high"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-deepblue-900/90 via-deepblue-900/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900 via-transparent to-deepblue-900/30"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-6 z-10 relative mt-24 md:mt-10">
          <div className="max-w-4xl">
            <FadeIn delay={100}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-8 md:w-12 bg-gold-400"></div>
                <span className="text-gold-400 tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm font-semibold uppercase">Phase 1 Launching Now</span>
              </div>
            </FadeIn>
            
            <FadeIn delay={300}>
              {/* Responsive Text Sizing */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.05] mb-6">
                Sanctuary in the <br/>
                <span className="text-gold-400 drop-shadow-sm">
                  Dunes of RAK
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={500}>
              <p className="text-base md:text-xl text-gray-200 leading-relaxed max-w-xl md:max-w-2xl font-light mb-8 md:mb-10 border-l-2 border-gold-500 pl-6">
                Secure your legacy with premium freehold plots in Ras Al Khaimah's fastest-growing district. 
                <span className="block mt-2 text-white font-medium">Starting from AED 101/sq.ft with a 5-Year Payment Plan.</span>
              </p>
            </FadeIn>

            <FadeIn delay={700}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <Button variant="primary" onClick={openAuth} className="!px-8 md:!px-10 !py-4 text-base md:text-lg shadow-gold-500/20 shadow-2xl w-full sm:w-auto">
                  Secure Your Plot <ArrowRight size={20} />
                </Button>
                
                <Button 
                  variant="outline-white" 
                  onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="!px-8 md:!px-10 !py-4 text-base md:text-lg backdrop-blur-sm group hover:!bg-white hover:!text-deepblue-900 w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Desktop Cinematic Stats Bar */}
        <div className="absolute bottom-12 left-0 w-full z-20 hidden md:block">
           <div className="container mx-auto px-6">
             <div className="flex items-center justify-between gap-6">
                
                <FadeIn delay={900} className="flex-1">
                   <div className="bg-deepblue-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center hover:bg-deepblue-900/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/10 h-32 flex flex-col justify-center">
                      <div className="text-3xl lg:text-4xl font-serif text-white mb-1">406 ACRES</div>
                      <div className="text-[10px] text-gold-400 uppercase tracking-[0.2em] font-semibold">Project Plan</div>
                   </div>
                </FadeIn>

                <FadeIn delay={1000} className="flex-1">
                   <div className="bg-deepblue-900/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl text-center hover:bg-deepblue-900/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/10 h-32 flex flex-col justify-center items-center">
                      <div className="text-2xl lg:text-3xl font-serif text-white mb-1">PHASE 1</div>
                      <div className="text-[10px] text-gold-400 uppercase tracking-[0.2em] font-semibold">84.7 Acres Launching Now</div>
                   </div>
                </FadeIn>

                <FadeIn delay={1100} className="flex-shrink-0 mx-4">
                   <div 
                     className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 hover:border-gold-500/50 transition-all duration-300 group"
                     onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
                   >
                      <div className="w-[30px] h-[48px] border-2 border-white/60 group-hover:border-gold-400 rounded-full flex justify-center pt-2 transition-all duration-300">
                        <div className="w-1.5 h-2.5 bg-white/80 group-hover:bg-gold-400 rounded-full animate-scroll-down"></div>
                      </div>
                   </div>
                </FadeIn>

                <FadeIn delay={1200} className="flex-1">
                   <div className="bg-deepblue-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center hover:bg-deepblue-900/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/10 h-32 flex flex-col justify-center">
                      <div className="text-[10px] text-gold-400 uppercase tracking-[0.2em] font-bold mb-1">From</div>
                      <div className="text-3xl lg:text-4xl font-serif text-white mb-1 whitespace-nowrap">AED 101</div>
                      <div className="text-[10px] text-gold-400 uppercase tracking-[0.2em] font-semibold">Per sq/ft.</div>
                   </div>
                </FadeIn>

                <FadeIn delay={1300} className="flex-1">
                   <div className="bg-deepblue-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center hover:bg-deepblue-900/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-500/10 h-32 flex flex-col justify-center">
                      <div className="text-3xl lg:text-4xl font-serif text-white mb-1 font-bold whitespace-nowrap">10% DOWN</div>
                      <div className="text-[10px] text-gold-400 uppercase tracking-[0.2em] font-semibold">With 0% Interest</div>
                   </div>
                </FadeIn>

             </div>
           </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-16 md:py-32 bg-[#F9F8F4] scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center mb-12 md:mb-20 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif text-deepblue-900 mb-6">A Legacy in the Making</h2>
              <div className="w-16 md:w-24 h-0.5 bg-gold-500 mx-auto"></div>
              <p className="mt-6 md:mt-8 text-gray-600 text-lg md:text-xl font-light leading-relaxed">
                Situated in the heart of Ras Al Khaimah's expansion corridor, RAK Oasis offers a sanctuary away from the bustle, yet connected to the future.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-0 border-b border-gold-500/20 divide-y md:divide-y-0 md:divide-x divide-gold-500/20">
            {/* Feature 1 */}
            <FadeIn delay={200} className="h-full">
              <div className="p-8 md:p-12 hover:bg-white/40 transition-colors duration-500 h-full flex flex-col items-start text-left group">
                <span className="text-6xl md:text-7xl font-serif text-gold-500/[0.15] font-bold mb-4 md:mb-6 group-hover:text-gold-500/25 transition-colors">01</span>
                <h3 className="text-xl md:text-2xl font-serif text-deepblue-900 mb-4">Strategic Corridor</h3>
                <p className="text-gray-600 leading-relaxed">Strategically located near upcoming resorts and key transport links. High appreciation potential for early investors.</p>
              </div>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn delay={400} className="h-full">
               <div className="p-8 md:p-12 hover:bg-white/40 transition-colors duration-500 h-full flex flex-col items-start text-left group">
                <span className="text-6xl md:text-7xl font-serif text-gold-500/[0.15] font-bold mb-4 md:mb-6 group-hover:text-gold-500/25 transition-colors">02</span>
                <h3 className="text-xl md:text-2xl font-serif text-deepblue-900 mb-4">Biophilic Design</h3>
                <p className="text-gray-600 leading-relaxed">Designed with ample green spaces. Garden facing plots available for a serene lifestyle embedded in nature.</p>
              </div>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn delay={600} className="h-full">
               <div className="p-8 md:p-12 hover:bg-white/40 transition-colors duration-500 h-full flex flex-col items-start text-left group">
                <span className="text-6xl md:text-7xl font-serif text-gold-500/[0.15] font-bold mb-4 md:mb-6 group-hover:text-gold-500/25 transition-colors">03</span>
                <h3 className="text-xl md:text-2xl font-serif text-deepblue-900 mb-4">Smart Capital Structure</h3>
                <p className="text-gray-600 leading-relaxed">Pay just 10% to book, and the rest over 60 comfortable monthly installments directly to the developer.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing & Calculator Section */}
      <section id="pricing" className="py-16 md:py-24 bg-white relative scroll-mt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Content */}
            <div className="space-y-8">
              <FadeIn>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-deepblue-900 leading-tight">
                    Transparent Pricing.<br/>No Hidden Costs.
                  </h2>
                  <p className="mt-4 text-gray-600 text-lg">
                    Phase 1 offers the most competitive rates in the market. Secure your asset before prices appreciate.
                  </p>
                </div>
              </FadeIn>

              {/* Editorial List */}
              <div className="space-y-8 mt-8">
                <FadeIn delay={200}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-gold-500">
                      <Check size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl md:text-2xl text-deepblue-900 mb-2">Base Price</h4>
                      <p className="text-gray-600 font-light text-lg">AED 101 per sq.ft / ₹ 2,520 per sq.ft</p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={300}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-gold-500">
                      <Check size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl md:text-2xl text-deepblue-900 mb-2">Premium Plots</h4>
                      <p className="text-gray-600 font-light text-lg">+5% for Garden Facing or Corner locations.</p>
                    </div>
                  </div>
                </FadeIn>
                <FadeIn delay={400}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-gold-500">
                       <Check size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif text-xl md:text-2xl text-deepblue-900 mb-2">Standard Size</h4>
                      <p className="text-gray-600 font-light text-lg">Optimized 1,000 sq.ft plots perfect for villas.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={500}>
                <div id="payment" className="p-6 bg-deepblue-900 rounded-xl text-white scroll-mt-32">
                  <h4 className="font-bold text-lg mb-2">Payment Plan Structure</h4>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-1/3 border-r border-white/20">
                      <div className="text-2xl font-bold text-gold-400">10%</div>
                      <div className="text-xs opacity-70">Booking</div>
                    </div>
                    <div className="w-2/3">
                      <div className="text-2xl font-bold text-gold-400">90%</div>
                      <div className="text-xs opacity-70">Over 5 Years (60 Monthly Installments)</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-80 italic">
                    *Interest-free payment plan direct from developer.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Right Content - Calculator */}
            <div className="relative">
              <FadeIn delay={300}>
                <InvestmentCalculator />
                {/* Decorative circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-100 rounded-full blur-3xl -z-10 opacity-50"></div>
              </FadeIn>
            </div>

          </div>
        </div>
      </section>

      {/* AI Advisor Section */}
      <section id="ai-advisor" className="py-16 md:py-24 bg-gray-900 text-white relative overflow-hidden scroll-mt-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="md:w-1/2 space-y-6">
                <FadeIn>
                  <div className="inline-block px-3 py-1 border border-gold-500 text-gold-400 rounded-full text-xs font-bold tracking-widest uppercase mb-2">
                    Powered by AI
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                    Have Questions? <br/>
                    <span className="text-gold-400">Just Ask.</span>
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Not sure about the ROI? Curious about Ras Al Khaimah's future tourism boom? Our AI advisor is trained on market data to give you instant answers.
                  </p>
                </FadeIn>
                <FadeIn delay={200}>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2"><Info size={16} className="text-gold-500" /> "Is RAK a good investment for 2026?"</li>
                    <li className="flex items-center gap-2"><Info size={16} className="text-gold-500" /> "What is the capital appreciation expected?"</li>
                    <li className="flex items-center gap-2"><Info size={16} className="text-gold-500" /> "Compare 5-year payment plan vs bank loan."</li>
                  </ul>
                </FadeIn>
             </div>
             <div className="md:w-1/2 w-full">
                <FadeIn delay={400}>
                  <GeminiAdvisor />
                </FadeIn>
             </div>
          </div>
        </div>
      </section>

      {/* Strategic Location Section */}
      <section className="pt-16 md:pt-24 pb-32 md:pb-48 bg-gray-50 scroll-mt-20">
         <div className="container mx-auto px-4 md:px-6">
            <FadeIn>
               <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-deepblue-900">Strategic Location</h3>
                  <p className="text-gray-500 mt-2">At the center of growth, connecting you to key landmarks.</p>
               </div>
               
               {/* Distance Strip */}
               <div className="flex flex-wrap justify-center gap-3 md:gap-8 mb-10">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <Plane size={18} className="text-gold-500" />
                    <span className="text-xs md:text-base text-gray-600"><span className="font-bold text-deepblue-900">Int'l Airport:</span> 15 Mins</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <Landmark size={18} className="text-gold-500" />
                    <span className="text-xs md:text-base text-gray-600"><span className="font-bold text-deepblue-900">Wynn Resort:</span> 20 Mins</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow">
                    <GraduationCap size={18} className="text-gold-500" />
                    <span className="text-xs md:text-base text-gray-600"><span className="font-bold text-deepblue-900">Schools:</span> 10 Mins</span>
                  </div>
               </div>
            </FadeIn>
            
            <FadeIn delay={200}>
                {/* Static Map Container */}
                <div className="relative w-full h-[300px] md:h-[500px] bg-deepblue-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  {/* Map Iframe with Dark Filters */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=25.743611,56.002222&t=k&z=14&ie=UTF8&iwloc=near&output=embed`}
                    className="w-full h-full opacity-60 hover:opacity-70 transition-opacity duration-700 pointer-events-none grayscale-[0.3]"
                    title="RAK Oasis Location"
                    allowFullScreen
                  ></iframe>
                  
                  {/* Overlay Gradient for blending edges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900/50 via-transparent to-deepblue-900/20 pointer-events-none"></div>

                  {/* Pin 1: RAK Oasis (Center) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                      <div className="relative flex flex-col items-center">
                          <div className="w-6 h-6 bg-gold-500 rounded-full animate-ping absolute opacity-75"></div>
                          <div className="w-6 h-6 bg-gold-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                          <div className="mt-3 bg-deepblue-900/90 backdrop-blur text-white text-sm px-4 py-1.5 rounded-full shadow-xl border border-gold-500 font-bold tracking-wide whitespace-nowrap">
                              RAK OASIS
                          </div>
                      </div>
                  </div>
                  
                  {/* Decorative Compass */}
                  <div className="absolute top-8 right-8 text-white/20 pointer-events-none">
                      <Compass size={64} strokeWidth={1} />
                  </div>

                  {/* View on Map Button */}
                  <div className="absolute bottom-6 right-6 z-20">
                       <button onClick={openLocation} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all flex items-center gap-2 hover:border-gold-500/50">
                          INTERACTIVE VIEW <ArrowRight size={14} />
                       </button>
                  </div>
                </div>
            </FadeIn>
         </div>
      </section>

      {/* Footer - The Trust Anchor with "Discovery Deck" */}
      <footer className="bg-deepblue-900 text-white relative pt-0 border-t border-gray-800">
        
        {/* Watermark */}
        <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none z-0">
           <h1 className="text-[15vw] md:text-[250px] font-serif font-bold text-white opacity-[0.03] tracking-widest select-none">
             SANCTUARY
           </h1>
        </div>

        {/* Discovery Deck - The Floating Cards */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 -mt-24 mb-20">
          <FadeIn delay={300}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Vision */}
              <div 
                onClick={openLocation}
                className="bg-deepblue-900/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[20px] shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                    <div className="mb-6 text-gold-400 group-hover:text-white transition-colors">
                        <Map size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-1">Masterplan</h3>
                    <p className="text-gray-400 text-sm">Explore the 406-acre layout.</p>
                </div>
                <div className="flex items-center text-gold-400 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all mt-6">
                    View Map <ArrowRight size={14} className="ml-1" />
                </div>
              </div>

              {/* Card 2: Numbers */}
              <div 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-deepblue-900/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[20px] shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                    <div className="mb-6 text-gold-400 group-hover:text-white transition-colors">
                        <BarChart3 size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-1">Pricing</h3>
                    <p className="text-gray-400 text-sm">Starts AED 101/sq.ft.</p>
                </div>
                <div className="flex items-center text-gold-400 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all mt-6">
                    Payment Plan <ArrowRight size={14} className="ml-1" />
                </div>
              </div>

              {/* Card 3: Context */}
              <div 
                onClick={openLocation}
                className="bg-deepblue-900/95 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[20px] shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
              >
                <div>
                    <div className="mb-6 text-gold-400 group-hover:text-white transition-colors">
                        <Compass size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-1">Location</h3>
                    <p className="text-gray-400 text-sm">RAK’s fastest-growing district.</p>
                </div>
                <div className="flex items-center text-gold-400 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all mt-6">
                    See Map <ArrowRight size={14} className="ml-1" />
                </div>
              </div>

              {/* Card 4: Lead Magnet */}
              <div 
                onClick={openAuth}
                className="bg-gold-500/95 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-[20px] shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between relative overflow-hidden"
              >
                <div className="relative z-10">
                    <div className="mb-6 text-deepblue-900 group-hover:text-white transition-colors">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif font-bold mb-1 text-deepblue-900">Investment Guide</h3>
                    <p className="text-deepblue-900/80 text-sm font-medium">Download Phase 1 Brochure.</p>
                </div>
                <div className="flex items-center text-deepblue-900 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all mt-6 relative z-10">
                    Download PDF <ArrowRight size={14} className="ml-1" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Minimalist Columns */}
        <div className="container mx-auto px-6 relative z-10 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-sm text-gray-400">
              {/* Col 1 */}
              <div>
                 <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Project</h4>
                 <ul className="space-y-4">
                    <li><a href="#" className="hover:text-gold-400 transition-colors">The Vision</a></li>
                    <li><a href="#" className="hover:text-gold-400 transition-colors">Masterplan</a></li>
                    <li><a href="#" className="hover:text-gold-400 transition-colors">Photo Gallery</a></li>
                 </ul>
              </div>

              {/* Col 2 */}
              <div>
                 <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Ownership</h4>
                 <ul className="space-y-4">
                    <li><a href="#" className="hover:text-gold-400 transition-colors">Why RAK?</a></li>
                    <li><a href="#payment" className="hover:text-gold-400 transition-colors">Payment Plan</a></li>
                    <li><a href="#pricing" className="hover:text-gold-400 transition-colors">ROI Calculator</a></li>
                 </ul>
              </div>

              {/* Col 3 */}
              <div>
                 <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Legal</h4>
                 <ul className="space-y-4">
                    <li><a href="#" className="hover:text-gold-400 transition-colors">Escrow Details</a></li>
                    <li><a href="#" className="hover:text-gold-400 transition-colors">RERA Certificate</a></li>
                    <li><a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a></li>
                 </ul>
              </div>

              {/* Col 4 */}
              <div>
                 <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-xs">Connect</h4>
                 <div className="flex flex-col gap-4">
                    <a href="tel:+97140000000" className="text-xl font-bold text-gold-400 hover:text-white transition-colors">+971 4 000 0000</a>
                    <a href="mailto:sales@rakoasis.com" className="hover:text-white transition-colors">sales@rakoasis.com</a>
                    <a href="https://wa.me/97140000000" className="flex items-center gap-2 hover:text-white transition-colors text-green-400">
                        <MessageCircle size={16} /> Chat on WhatsApp
                    </a>
                 </div>
              </div>
          </div>
        </div>

        {/* Trust Bar (Bottom) */}
        <div className="border-t border-white/5 relative z-10 bg-black/20">
          <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="text-xs text-gray-500 order-3 md:order-1 text-center md:text-left">
               &copy; {new Date().getFullYear()} RAK Oasis. All rights reserved.
             </div>

             <div className="flex items-center gap-8 md:gap-12 opacity-60 grayscale brightness-0 invert order-1 md:order-2">
                 <img src={LOGO_URL} alt="RAK Oasis" className="h-8 md:h-10 w-auto" />
                 <div className="w-[1px] h-6 md:h-8 bg-white/20"></div>
                 <img src={GOV_LOGO} alt="RAK Government" className="h-8 md:h-10 w-auto" />
                 <div className="w-[1px] h-6 md:h-8 bg-white/20"></div>
                 <img src={RERA_LOGO} alt="RERA Approved" className="h-8 md:h-10 w-auto" />
             </div>

             <div className="flex gap-6 order-2 md:order-3">
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors transform hover:-translate-y-1 duration-300">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors transform hover:-translate-y-1 duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gold-500 transition-colors transform hover:-translate-y-1 duration-300">
                  <Twitter size={18} />
                </a>
             </div>
          </div>
        </div>

      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuth} onLogin={onLogin} />
      <LocationModal isOpen={isLocationOpen} onClose={closeLocation} />
    </div>
  );
};
