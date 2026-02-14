
import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Play, MapPin, Phone, Mail, Instagram, Linkedin, Globe, DollarSign } from 'lucide-react';
import { Button } from './Button';
import { InvestmentCalculator } from './Calculator';
import { GeminiAdvisor } from './GeminiAdvisor';
import { BookingModal } from './BookingModal';
import { LocationModal } from './LocationModal';
import { AuthModal } from './AuthModal';
import { FadeIn } from './FadeIn';
import { CookieConsent } from './CookieConsent';

interface LandingPageProps {
  onLogin: (role: 'client' | 'agent' | 'admin', customData?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(false);

  const openLocation = () => setIsLocationOpen(true);

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-deepblue-900/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center font-serif font-bold text-deepblue-900 text-xl shadow-lg">R</div>
             <div className="text-white">
                <h1 className="font-serif font-bold text-lg tracking-wide leading-none">RAK OASIS</h1>
                <p className="text-[10px] text-gold-400 uppercase tracking-widest font-medium">Premium Estate</p>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
             <a href="#vision" className="hover:text-gold-400 transition-colors">Vision</a>
             <a href="#location" className="hover:text-gold-400 transition-colors">Location</a>
             <a href="#investment" className="hover:text-gold-400 transition-colors">Investment</a>
             <a href="#advisor" className="hover:text-gold-400 transition-colors">AI Advisor</a>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsAuthOpen(true)} className="text-white hover:text-gold-400 font-bold text-sm transition-colors">Login</button>
             <Button variant="primary" className="!py-2 !px-6 !text-xs" onClick={() => setIsBookingOpen(true)}>Book Now</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 bg-black">
            <img 
              src="https://iili.io/fQnWtRe.jpg" 
              alt="RAK Oasis Hero" 
              className="w-full h-full object-cover opacity-60 animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deepblue-900 via-deepblue-900/40 to-transparent"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10 text-center text-white mt-20">
            <FadeIn>
              <span className="inline-block border border-gold-500/50 text-gold-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 bg-deepblue-900/50 backdrop-blur-sm">
                 Phase 1 Launching Now
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 leading-tight">
                 Build Your Legacy <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 animate-shimmer">In Ras Al Khaimah</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                 Own premium freehold plots in the UAE's fastest-growing tourism hub. 
                 A sanctuary of luxury, nature, and high ROI potential.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                 <Button className="!py-4 !px-8 text-lg shadow-gold-500/20" onClick={() => setIsBookingOpen(true)}>
                    Secure Your Plot <ArrowRight className="ml-2" size={20} />
                 </Button>
                 <button onClick={openLocation} className="group flex items-center gap-3 px-8 py-4 rounded-lg text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-deepblue-900 transition-colors">
                       <Play size={16} fill="currentColor" />
                    </div>
                    <div className="text-left">
                       <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold">Watch Video</span>
                       <span className="block font-serif italic text-lg">The Vision</span>
                    </div>
                 </button>
              </div>
            </FadeIn>
         </div>

         {/* Scroll Indicator */}
         <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
            <ChevronDown size={32} />
         </div>
         
         <div className="absolute bottom-6 right-6 z-20">
             <button onClick={openLocation} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all flex items-center gap-2 hover:border-gold-500/50">
                INTERACTIVE VIEW <ArrowRight size={14} />
             </button>
         </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-20 md:py-32 bg-white relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
               <FadeIn>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-deepblue-900 mb-6 leading-tight">
                     Where Nature Meets <br/>
                     <span className="text-gold-600">Future Investment</span>
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                     RAK Oasis isn't just a development; it's a strategic foothold in the UAE's next big success story. Located minutes from the upcoming Wynn Casino Resort, this 406-acre master community offers the perfect blend of serenity and accessibility.
                  </p>
                  <ul className="space-y-4 mb-8">
                     {[
                        "Freehold Ownership for All Nationalities",
                        "High Capital Appreciation Potential",
                        "Flexible 5-Year Payment Plan",
                        "Zero Interest, Direct from Developer"
                     ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-deepblue-900 font-medium">
                           <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center text-gold-600 shrink-0">
                              <ArrowRight size={12} />
                           </div>
                           {item}
                        </li>
                     ))}
                  </ul>
                  <Button variant="outline" onClick={() => setIsBookingOpen(true)}>Download Brochure</Button>
               </FadeIn>
               
               <FadeIn delay={200}>
                  <div className="relative">
                     <div className="absolute -inset-4 bg-gold-200/50 rounded-2xl transform rotate-3"></div>
                     <img 
                        src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" 
                        alt="RAK Lifestyle" 
                        className="rounded-2xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
                     />
                     <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs border border-gray-100">
                        <div className="flex items-center gap-4 mb-3">
                           <div className="text-4xl font-serif font-bold text-gold-500">45%</div>
                           <div className="text-xs text-gray-500 font-bold uppercase leading-tight">Projected<br/>ROI (3 Years)</div>
                        </div>
                        <p className="text-xs text-gray-400">Based on current market analysis of Ras Al Khaimah real estate trends.</p>
                     </div>
                  </div>
               </FadeIn>
            </div>
         </div>
      </section>

      {/* Calculator Section */}
      <section id="investment" className="py-20 bg-gray-50 border-y border-gray-200">
         <div className="container mx-auto px-6">
            <FadeIn>
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-deepblue-900 mb-4">Calculate Your Investment</h2>
                  <p className="text-gray-500">
                     Plan your future with our transparent and flexible payment structure. No hidden fees, no interest.
                  </p>
               </div>
               <InvestmentCalculator />
            </FadeIn>
         </div>
      </section>

      {/* Gemini AI Advisor Section */}
      <section id="advisor" className="py-20 bg-deepblue-900 text-white relative overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold-500 rounded-full blur-[120px]"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <FadeIn>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                     Meet Your Personal <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI Investment Advisor</span>
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                     Have questions about ROI, location, or payment plans? Our advanced AI consultant, powered by Google Gemini, is available 24/7 to provide instant, accurate answers tailored to your investment goals.
                  </p>
                  <div className="flex flex-col gap-4 text-sm text-gray-400">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gold-400"><MapPin size={16} /></div>
                        <span>Ask about: "Distance to Wynn Casino"</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-blue-400"><DollarSign size={16} /></div>
                        <span>Ask about: "Payment plan for 2 plots"</span>
                     </div>
                  </div>
               </FadeIn>
               
               <FadeIn delay={200}>
                  <GeminiAdvisor />
               </FadeIn>
            </div>
         </div>
      </section>

      {/* Map Section Link */}
      <section id="location" className="py-20 bg-white">
         <div className="container mx-auto px-6">
            <FadeIn>
                <div className="relative rounded-2xl overflow-hidden h-[400px] group cursor-pointer shadow-2xl" onClick={openLocation}>
                  <img 
                     src="https://images.unsplash.com/photo-1599809275372-b7f58fc91378?auto=format&fit=crop&w=1200&q=80" 
                     alt="Map Preview" 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/30 text-white group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={48} />
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                     <h3 className="text-2xl font-serif font-bold mb-1">Prime Location</h3>
                     <p className="text-sm text-gray-300">Al Jazirah Al Hamra, Ras Al Khaimah</p>
                  </div>
                </div>
            </FadeIn>
         </div>
      </section>

      {/* Developer Credit Section */}
      <section className="py-20 bg-white border-t border-gray-200 relative overflow-hidden">
         {/* Subtle background pattern */}
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
         
         <div className="container mx-auto px-6 text-center relative z-10">
            <FadeIn>
              <div className="inline-flex flex-col items-center">
                  <p className="text-gold-600 text-xs font-bold uppercase tracking-[0.3em] mb-4">A Landmark Project By</p>
                  <h2 className="text-3xl md:text-5xl font-serif text-deepblue-900 mb-6 tracking-wide leading-tight">
                    SHAHAB BUILDING<br className="md:hidden" /> CONTRACTING LLC
                  </h2>
                  <div className="flex items-center gap-4 mb-6 opacity-50">
                      <div className="h-px w-12 bg-deepblue-900"></div>
                      <div className="w-3 h-3 bg-gold-500 transform rotate-45"></div>
                      <div className="h-px w-12 bg-deepblue-900"></div>
                  </div>
                  <p className="text-gray-500 max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
                    Setting new standards in construction and development across the UAE. <br className="hidden md:block"/>
                    Committed to delivering enduring value and exceptional quality in every square foot.
                  </p>
              </div>
            </FadeIn>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-deepblue-900 text-white pt-20 border-t border-gray-800">
         <div className="container mx-auto px-6 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
               <div>
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 bg-gold-500 rounded flex items-center justify-center text-deepblue-900 font-bold font-serif">R</div>
                     <span className="font-serif font-bold text-lg tracking-wide">RAK OASIS</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                     Premium freehold plots in the heart of new RAK. Secure your legacy today.
                  </p>
                  <div className="flex gap-4">
                     <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-gold-500 hover:text-deepblue-900 transition-colors"><Instagram size={16} /></a>
                     <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-gold-500 hover:text-deepblue-900 transition-colors"><Linkedin size={16} /></a>
                     <a href="#" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center hover:bg-gold-500 hover:text-deepblue-900 transition-colors"><Globe size={16} /></a>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-gold-400 font-bold uppercase tracking-wider mb-6 text-xs">Quick Links</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                     <li><a href="#investment" className="hover:text-white transition-colors">Investment</a></li>
                     <li><a href="#location" className="hover:text-white transition-colors">Location</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Partner With Us</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-gold-400 font-bold uppercase tracking-wider mb-6 text-xs">Legal</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-gold-400 font-bold uppercase tracking-wider mb-6 text-xs">Contact</h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                     <li className="flex items-center gap-3"><Phone size={16} className="text-gold-500" /> +971 4 000 0000</li>
                     <li className="flex items-center gap-3"><Mail size={16} className="text-gold-500" /> sales@rakoasis.com</li>
                     <li className="flex items-center gap-3"><MapPin size={16} className="text-gold-500" /> Downtown Dubai, UAE</li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="border-t border-white/10 py-6">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
               <p>© 2026 RAK Oasis. All rights reserved.</p>
               <p>Developed by Shahab Building Contracting LLC.</p>
            </div>
         </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={onLogin} />
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      {!cookieAccepted && <CookieConsent onAccept={() => setCookieAccepted(true)} onDecline={() => setCookieAccepted(true)} />}
    </div>
  );
};
