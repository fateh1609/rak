
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  LogOut, User, FileText, Map as MapIcon, Home, CreditCard, 
  Smartphone, Bell, Menu, X, Settings, Shield, CheckCircle, AlertCircle,
  Phone, Mail
} from 'lucide-react';
import { Button } from '../Button';
import { UserProfile, Booking } from '../../types';
import { DashboardHome } from './Home';
import { PurchaseWizard } from './PurchaseWizard';
import { MyPlotView, PaymentsView, ProfileView, SupportView, UpdatesView } from './Views';
import { DocumentsView } from './Documents';
import { usePageAccess } from '../../contexts/PageAccessContext';
import { MaintenanceOverlay } from '../MaintenanceOverlay';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

interface DashboardProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onNavigate: (callback: () => void) => void;
}

export const ClientDashboard: React.FC<DashboardProps> = ({ profile, onLogout, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<any>(null); // Passed to wizard
  const [showNotifications, setShowNotifications] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const { settings } = usePageAccess();
  const navigate = useNavigate();
  const location = useLocation();

  // Mock Notifications Data
  const notifications = [
      { id: 1, type: 'login', text: 'New login from Chrome (Windows)', time: 'Just now', icon: Shield, color: 'text-blue-500' },
      { id: 2, type: 'payment', text: 'Payment of AED 37,875 received', time: '2 hours ago', icon: CheckCircle, color: 'text-green-500' },
      { id: 3, type: 'reminder', text: 'Upcoming EMI due on Mar 01', time: '1 day ago', icon: AlertCircle, color: 'text-yellow-600' },
      { id: 4, type: 'login', text: 'New login from Safari (iPhone)', time: '2 days ago', icon: Shield, color: 'text-gray-400' },
      { id: 5, type: 'payment', text: 'Booking amount verified', time: '3 days ago', icon: CheckCircle, color: 'text-green-500' },
  ];

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
        if (profile) {
             const { data } = await supabase
            .from('bookings')
            .select(`*, plot_details:plots(*)`)
            .eq('user_id', profile.id)
            .in('status', ['CONFIRMED', 'PENDING_VERIFICATION']);
            
            if (data) setBookings(data as Booking[]);
        }
    } catch (e) {
        console.error("Error fetching data:", e);
    } finally {
        setLoading(false);
    }
  };

  const handleNav = (path: string) => {
      onNavigate(() => {
          navigate(path);
          setSidebarOpen(false);
      });
  };

  const startPurchase = (plot?: any) => {
      if(plot) setSelectedPlot(plot);
      handleNav('purchase');
  };

  if (loading) {
      return (
          <div className="min-h-screen bg-deepblue-900 flex items-center justify-center">
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gold-400 text-sm tracking-widest uppercase">Loading Your Portal...</p>
              </div>
          </div>
      );
  }

  // Current view based on path
  const currentPath = location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD';
  const displayTitle = currentPath === 'CLIENT' ? 'Overview' : currentPath.replace('-', ' ');

  // Navigation Items
  const navItems = [
      { id: '', label: 'Dashboard', icon: Home, key: 'DASHBOARD' },
      { id: 'my-plot', label: 'My Plot(s)', icon: MapIcon, key: 'MY_PLOT' },
      { id: 'payments', label: 'Payments', icon: CreditCard, key: 'PAYMENTS' },
      { id: 'documents', label: 'Documents', icon: FileText, key: 'DOCUMENTS' },
      { id: 'updates', label: 'Updates', icon: Settings, key: 'UPDATES' }, // Icon reused as placeholder
      { id: 'support', label: 'Support', icon: Smartphone, key: 'SUPPORT' },
      { id: 'profile', label: 'Profile', icon: Settings, key: 'PROFILE' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
       {/* MOBILE BACKDROP OVERLAY */}
       {sidebarOpen && (
         <div 
           className="fixed inset-0 z-40 bg-deepblue-900/80 backdrop-blur-sm md:hidden transition-opacity"
           onClick={() => setSidebarOpen(false)}
         />
       )}

       {/* SIDEBAR */}
       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-deepblue-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl flex flex-col`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center font-serif font-bold text-deepblue-900 text-xl shadow-lg shadow-gold-500/20">R</div>
                  <div>
                      <h1 className="font-serif font-bold text-lg tracking-wide text-white">RAK Oasis</h1>
                      <p className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">Client Portal</p>
                  </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white"><X size={20} /></button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map(item => {
                  if (settings.client[item.key] === 'HIDDEN') return null;
                  const isActive = item.id === '' 
                    ? location.pathname === '/client' || location.pathname === '/client/'
                    : location.pathname.includes(`/client/${item.id}`);
                  
                  return (
                      <NavItem 
                        key={item.key}
                        icon={item.icon} 
                        label={item.label} 
                        active={isActive} 
                        onClick={() => handleNav(item.id)} 
                      />
                  );
              })}
          </nav>

          <div className="p-4 border-t border-white/10 bg-deepblue-800/50 z-20">
              <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                       <User size={20} className="text-gold-400" />
                  </div>
                  <div>
                      <p className="text-xs text-gold-400 uppercase font-bold">Your Consultant</p>
                      <p className="text-sm font-bold text-white">Rajesh Kumar</p>
                      <p className="text-xs text-gray-400">{profile?.agent_code || 'AGT-10523'}</p>
                  </div>
              </div>
              
              <Button 
                variant="outline-white" 
                fullWidth 
                className="!py-2 !text-xs !border-white/20 hover:!border-gold-500"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact Agent
              </Button>
          </div>
       </aside>

       <div className="flex-1 flex flex-col h-screen overflow-hidden">
           <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
               <div className="flex items-center gap-4">
                   <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-500 hover:text-deepblue-900"><Menu size={24} /></button>
                   <h2 className="text-xl font-serif font-bold text-deepblue-900 hidden md:block capitalize">
                       {displayTitle}
                   </h2>
                   {/* Mobile Title */}
                   <h2 className="text-lg font-serif font-bold text-deepblue-900 md:hidden">RAK Client</h2>
               </div>
               <div className="flex items-center gap-4 md:gap-6">
                   <div className="hidden md:flex flex-col text-right">
                       <span className="text-sm font-bold text-gray-900">Welcome, {profile?.full_name.split(' ')[0]}</span>
                       <span className="text-xs text-gold-600">Verified Client</span>
                   </div>
                   
                   {/* NOTIFICATIONS DROPDOWN */}
                   <div className="relative">
                       <button 
                           onClick={() => setShowNotifications(!showNotifications)}
                           className="relative p-2 text-gray-400 hover:text-gold-600 transition flex items-center gap-2 group"
                       >
                           <Bell size={20} />
                           <span className="hidden lg:inline text-xs font-bold text-gray-500 group-hover:text-gold-600">Notifications</span>
                           <span className="absolute top-1.5 right-1.5 lg:right-auto lg:left-4 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                       </button>

                       {showNotifications && (
                           <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-up origin-top-right">
                               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                   <h3 className="font-bold text-deepblue-900 text-sm">Recent Updates</h3>
                                   <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                               </div>
                               <div className="max-h-80 overflow-y-auto">
                                   {notifications.map(n => (
                                       <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition flex gap-3">
                                           <div className={`mt-1 ${n.color}`}><n.icon size={16} /></div>
                                           <div>
                                               <p className="text-xs font-bold text-gray-800">{n.text}</p>
                                               <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       )}
                   </div>

                   <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 transition" title="Logout">
                       <LogOut size={20} />
                   </button>
               </div>
           </header>

           <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
               <Routes>
                  <Route index element={<DashboardHome profile={profile} bookings={bookings} onBuyNew={() => startPurchase()} onViewChange={(v: string) => handleNav(v.toLowerCase().replace('_', '-'))} />} />
                  <Route path="purchase" element={<PurchaseWizard profile={profile} selectedPlot={selectedPlot} onCancel={() => handleNav('')} onSuccess={() => { fetchData(); handleNav(''); }} />} />
                  <Route path="my-plot" element={settings.client['MY_PLOT'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <MyPlotView bookings={bookings} onBuyNew={() => startPurchase()} profile={profile} />} />
                  <Route path="payments" element={settings.client['PAYMENTS'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <PaymentsView bookings={bookings} />} />
                  <Route path="documents" element={settings.client['DOCUMENTS'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <DocumentsView bookings={bookings} profile={profile} />} />
                  <Route path="updates" element={settings.client['UPDATES'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <UpdatesView />} />
                  <Route path="profile" element={settings.client['PROFILE'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <ProfileView profile={profile} />} />
                  <Route path="support" element={settings.client['SUPPORT'] === 'DISABLED' ? <MaintenanceOverlay onBack={() => handleNav('')} /> : <SupportView />} />
                  <Route path="*" element={<Navigate to="" replace />} />
               </Routes>
           </main>
       </div>

       {/* Contact Agent Modal */}
       {isContactModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-deepblue-900/80 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsContactModalOpen(false)}
                />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                    <div className="bg-deepblue-900 p-6 text-center relative">
                        <button 
                            onClick={() => setIsContactModalOpen(false)} 
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-20 h-20 mx-auto bg-gold-500 rounded-full flex items-center justify-center text-deepblue-900 text-3xl font-serif font-bold mb-3 shadow-lg border-4 border-deepblue-800">
                            R
                        </div>
                        <h3 className="text-xl font-bold text-white">Rajesh Kumar</h3>
                        <p className="text-gold-400 text-xs font-mono uppercase tracking-widest mt-1">Senior Estate Consultant</p>
                        <p className="text-white/50 text-xs mt-1">{profile?.agent_code || 'AGT-10523'}</p>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <a href="tel:+917720001609" className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gold-50 border border-gray-100 hover:border-gold-200 transition group">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Phone size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Mobile Number</p>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-gold-600 transition">+91 7720001609</p>
                            </div>
                        </a>

                        <a href="mailto:Rajeshkumar@email.com" className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gold-50 border border-gray-100 hover:border-gold-200 transition group">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Mail size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500 font-bold uppercase">Email Address</p>
                                <p className="text-sm font-bold text-gray-900 group-hover:text-gold-600 transition truncate">Rajeshkumar@email.com</p>
                            </div>
                        </a>
                    </div>
                    
                    <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">Available Mon-Sat, 9AM - 6PM</p>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            active 
            ? 'bg-gold-500 text-white shadow-lg shadow-gold-500/20 font-bold' 
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
    >
        <Icon size={18} /> {label}
    </button>
);
