import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, Link, useLocation, BrowserRouter } from 'react-router-dom';
import { 
  Eye, EyeOff, Check, LayoutDashboard, TrendingUp, Store, 
  Truck, CloudSun, Database, Search, Bell, Settings, 
  ArrowUpRight, AlertCircle, Package, Sun, MoreVertical, 
  ChevronRight, User, LogOut, Menu, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const NotificationDrawer = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAllAsRead 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: any[]; 
  onMarkAllAsRead: () => void;
}) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] z-[101] flex flex-col transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#0056d2] rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {unreadCount} unread messages
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={cn(
                "p-6 rounded-2xl transition-all border flex gap-4 relative group cursor-pointer",
                notif.unread ? "bg-[#f8fbff] border-blue-50" : "bg-white border-transparent hover:bg-gray-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                notif.unread ? "bg-white shadow-sm" : "bg-gray-50"
              )}>
                <div className={notif.color}>{notif.icon}</div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-900">{notif.title}</h3>
                  {notif.unread && (
                    <div className="w-2 h-2 bg-[#0056d2] rounded-full mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pr-4">
                  {notif.description}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-2">
                  {notif.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50">
          <button 
            onClick={onMarkAllAsRead}
            className="w-full py-4 bg-[#0056d2] text-white rounded-xl font-bold text-sm hover:bg-[#0044a8] transition-all shadow-xl shadow-blue-100 uppercase tracking-widest"
          >
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </>
  );
};

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative w-12 h-12 flex items-center justify-center">
       <svg viewBox="0 0 100 100" className="w-full h-full">
         <path d="M20,80 C10,60 30,30 50,20 C70,30 90,60 80,80 C70,90 30,90 20,80" fill="#0056d2" className="opacity-20" />
         <path d="M25,75 C15,55 35,25 55,15 C75,25 95,55 85,75" fill="none" stroke="#0056d2" strokeWidth="8" strokeLinecap="round" />
         <path d="M40,60 C35,50 45,40 55,40 C65,40 75,50 70,60" fill="none" stroke="black" strokeWidth="10" strokeLinecap="round" />
       </svg>
    </div>
    <span className="text-2xl font-black tracking-tight text-gray-900 uppercase">Smart Retail</span>
  </div>
);

// --- Layout Components ---

const SidebarContext = createContext<{ toggleSidebar: () => void }>({ toggleSidebar: () => {} });

const useSidebar = () => useContext(SidebarContext);

const Sidebar = ({ isOpen, onClose, activeLabel }: { isOpen: boolean, onClose: () => void, activeLabel: string }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard-main' },
    { icon: <TrendingUp size={20} />, label: 'Forecasting Unit', path: '#' },
    { icon: <Store size={20} />, label: 'Store Allocation', path: '/store-allocation' },
    { icon: <Truck size={20} />, label: 'Supplier Connect', path: '#' },
    { icon: <CloudSun size={20} />, label: 'Weather Hub', path: '#' },
    { icon: <Database size={20} />, label: 'External Data', path: '#' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-gray-100 transition-transform duration-300 transform lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0056d2] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase">Smart Retail</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.path !== '#') navigate(item.path);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeLabel === item.label 
                  ? "bg-[#f0f7ff] text-[#0056d2] border-r-4 border-[#0056d2] rounded-r-none" 
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

const MainLayout = ({ children, activeLabel }: { children: React.ReactNode, activeLabel: string }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <SidebarContext.Provider value={{ toggleSidebar }}>
      <div className="min-h-screen bg-[#f4f7fa] flex font-sans text-gray-900 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          activeLabel={activeLabel} 
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

const HamburgerButton = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button 
      onClick={toggleSidebar} 
      className="lg:hidden p-2 -ml-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <Menu size={24} />
    </button>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  useEffect(() => {
    const saved = localStorage.getItem('rememberMe');
    if (saved === 'true') {
      setRememberMe(true);
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) setEmail(savedEmail);
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'E-mail obligatoire.';
    else if (!validateEmail(email)) newErrors.email = 'E-mail invalide.';
    
    if (!password) newErrors.password = 'Mot de passe obligatoire.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('savedEmail');
    }

    // Mock redirection
    navigate('/initial-config');
  };

  const isFormValid = email && validateEmail(email) && password;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Left Section */}
      <div className="hidden md:flex md:w-5/12 bg-[#f0f7ff] p-16 flex-col justify-end relative overflow-hidden">
        <div className="z-10">
          <Logo />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-[#003399]">Bienvenue</h1>
            <p className="text-gray-500 text-sm">Connectez-vous pour commencer l’onboarding.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">E-mail</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0056d2] rounded-l" />
                <input
                  type="email"
                  placeholder="Votre@email.com"
                  className={cn(
                    "w-full bg-[#f8fbff] border-none p-4 pl-5 focus:ring-2 focus:ring-[#0056d2] outline-none transition-all",
                    errors.email && touched.email && "ring-1 ring-red-500"
                  )}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) {
                      const err = !e.target.value ? 'E-mail obligatoire.' : !validateEmail(e.target.value) ? 'E-mail invalide.' : undefined;
                      setErrors(prev => ({ ...prev, email: err }));
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                />
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0056d2] rounded-l" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="........."
                  className={cn(
                    "w-full bg-[#f8fbff] border-none p-4 pl-5 focus:ring-2 focus:ring-[#0056d2] outline-none transition-all",
                    errors.password && touched.password && "ring-1 ring-red-500"
                  )}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) {
                      setErrors(prev => ({ ...prev, password: !e.target.value ? 'Mot de passe obligatoire.' : undefined }));
                    }
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <div className={cn(
                    "w-4 h-4 border border-gray-300 rounded transition-colors",
                    rememberMe ? "bg-[#0056d2] border-[#0056d2]" : "bg-white"
                  )}>
                    {rememberMe && <Check size={12} className="text-white mx-auto" />}
                  </div>
                </div>
                <span className="text-gray-500 group-hover:text-gray-700">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" title="Mot de passe oublié ?" className="text-[#0056d2] font-semibold hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={cn(
                "w-full py-4 rounded-md font-bold text-white transition-all",
                isFormValid 
                  ? "bg-[#0056d2] hover:bg-[#0044a8] shadow-lg shadow-blue-200" 
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              Se connecter
            </button>

            <div className="text-center text-sm text-gray-500">
              Vous n’avez pas de compte?{' '}
              <Link to="/register" className="text-[#0056d2] font-bold hover:underline">
                Inscrivez-vous
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="md:hidden p-6 bg-[#f0f7ff] flex justify-center">
        <Logo />
      </div>
    </div>
  );
};

const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
      <h2 className="text-2xl font-bold text-[#003399]">Inscrivez-vous</h2>
      <p className="text-gray-500">Créez votre compte Smart Retail pour commencer.</p>
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
        Formulaire d'inscription (Démo)
      </div>
      <Link to="/" className="block text-[#0056d2] font-semibold hover:underline">
        Retour à la connexion
      </Link>
    </div>
  </div>
);

const ForgotPassword = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-6">
      <h2 className="text-2xl font-bold text-[#003399]">Récupération</h2>
      <p className="text-gray-500">Entrez votre e-mail pour réinitialiser votre mot de passe.</p>
      <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
        Modal de récupération (Démo)
      </div>
      <Link to="/" className="block text-[#0056d2] font-semibold hover:underline">
        Retour à la connexion
      </Link>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('smartRetailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  return (
    <MainLayout activeLabel="Initial Config">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <HamburgerButton />
            <Logo />
          </div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Configuration initiale</span>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-gray-50 w-full max-w-5xl flex flex-col items-center space-y-12">
          
          {/* Success Icon */}
          <div className="w-24 h-24 bg-[#0056d2] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <Check size={48} strokeWidth={3} />
          </div>

          {/* Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Tout est prêt !</h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Votre plateforme Smart Retail est configurée et prête à transformer vos données en décisions stratégiques.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {[
              { title: "Prévisions IA activées", desc: "Modèles prédictifs calibrés sur vos données historiques." },
              { title: "Alertes stock configurées", desc: "Notifications automatiques en cas de risque de rupture." },
              { title: "Impact météo synchronisé", desc: "Ajustement des stocks selon les prévisions locales." },
              { title: "Rapports automatisés", desc: "Tableaux de bord mis à jour en temps réel." }
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-[#f8fbff] rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0056d2] flex items-center justify-center shrink-0">
                  <Check size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{benefit.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button 
            onClick={() => navigate('/dashboard-main')}
            className="group relative bg-[#0056d2] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-[#0044a8] transition-all shadow-2xl shadow-blue-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Accéder à mon tableau de bord
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          {/* Footer Status */}
          <div className="pt-8 border-t border-gray-100 w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Système opérationnel</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Dernière synchronisation : à l'instant</p>
          </div>

        </div>
      </main>
    </div>
  </MainLayout>
  );
};

const MainDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('7 Jour');
  const [config, setConfig] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'stock',
      title: 'Alerte de stock critique',
      description: 'Jimmy Veste en laine et toile de soie (859163YCUA21000) est en rupture de stock dans le...',
      time: '5 min ago',
      unread: true,
      color: 'text-red-500',
      icon: <AlertCircle size={18} />
    },
    {
      id: '2',
      type: 'weather',
      title: 'Impact météo détecté',
      description: 'Températures élevées prévues. La catégorie Lin d’été devrait bondir de +22 %.',
      time: '15 min ago',
      unread: true,
      color: 'text-orange-500',
      icon: <Sun size={18} />
    },
    {
      id: '3',
      type: 'erp',
      title: 'Transmission ERP Confirmée',
      description: 'La commande MIP-2025-091 a été transmise avec succès à l’ERP',
      time: '1 hour ago',
      unread: false,
      color: 'text-green-500',
      icon: <Check size={18} />
    },
    {
      id: '4',
      type: 'event',
      title: 'Début de la Fashion Week de Paris',
      description: 'Événement détecté : Préparez-vous à une hausse de la demande pour les collections de créateurs.',
      time: '4 hour ago',
      unread: false,
      color: 'text-blue-500',
      icon: <Package size={18} />
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('smartRetailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const chartData = [
    { name: '01-01', N: 35, N1: 45, FORECAST: 10 },
    { name: '02-01', N: 42, N1: 52, FORECAST: 15 },
    { name: '03-01', N: 48, N1: 58, FORECAST: 25 },
    { name: '04-01', N: 45, N1: 55, FORECAST: 35 },
    { name: '05-01', N: 52, N1: 62, FORECAST: 42 },
    { name: '06-01', N: 58, N1: 68, FORECAST: 48 },
    { name: '07-01', N: 62, N1: 72, FORECAST: 52 },
  ];

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <TrendingUp size={20} />, label: 'Forecasting Unit' },
    { icon: <Store size={20} />, label: 'Store Allocation' },
    { icon: <Truck size={20} />, label: 'Supplier Connect' },
    { icon: <CloudSun size={20} />, label: 'Weather Hub' },
    { icon: <Database size={20} />, label: 'External Data' },
  ];

  const kpis = [
    { title: 'FORECAST SALES', value: '€42,850', sub: 'NEXT 7 DAYS', trend: '+14%', trendLabel: 'vs last period', icon: <TrendingUp className="text-orange-400" size={18} /> },
    { title: 'ALERTE STOCK FAIBLE', value: '12', sub: 'SKUs', trend: 'Urgent SKUs', trendColor: 'text-red-500', icon: <AlertCircle className="text-red-500" size={18} /> },
    { title: 'SUR STOCKAGGE', value: '57', sub: 'SKUs', icon: <Package className="text-blue-500" size={18} /> },
    { title: 'IMPACT METEO', value: '+22%', sub: 'CAT: VESTE', trend: '+5%', trendLabel: 'vs période précédente', icon: <Sun className="text-yellow-500" size={18} /> },
  ];

  const outOfStock = [
    { name: 'Linen Summer Dress', stock: 'Reste 3 unités', sales: '12/wk', status: 'bg-yellow-400', img: 'https://picsum.photos/seed/dress1/40/40' },
    { name: 'Veste en cuir Slim', stock: 'Reste 1 unité', sales: '5/wk', status: 'bg-red-500', img: 'https://picsum.photos/seed/jacket1/40/40' },
    { name: 'Leather Boots Pro', stock: 'Reste 2 unités', sales: '4/wk', status: 'bg-yellow-400', img: 'https://picsum.photos/seed/boots1/40/40' },
    { name: 'Cotton T-Shirt', stock: 'Reste 0 unité', sales: '15/wk', status: 'bg-red-600', img: 'https://picsum.photos/seed/shirt1/40/40' },
  ];

  const bestSellers = [
    { name: 'Linen Summer Dress', stock: 'Stock Optimal', sales: '42/wk', status: 'bg-green-500', img: 'https://picsum.photos/seed/dress2/40/40' },
    { name: 'Floral Maxi Dress', stock: 'Stock Optimal', sales: '38/wk', status: 'bg-green-500', img: 'https://picsum.photos/seed/floral2/40/40' },
    { name: 'Leather Boots Pro', stock: 'Stock Optimal', sales: '34/wk', status: 'bg-green-500', img: 'https://picsum.photos/seed/boots2/40/40' },
    { name: 'Silk Scarf Blue', stock: 'Stock Optimal', sales: '29/wk', status: 'bg-green-500', img: 'https://picsum.photos/seed/scarf1/40/40' },
  ];

  const recommendations = [
    { product: 'Veste Blazer', sku: '859163YCUA2100D', ai: '+45%', img: 'https://picsum.photos/seed/blazer/40/40' },
    { product: 'Pantalon Chino', sku: '859163YCUA2100D', ai: '+45%', img: 'https://picsum.photos/seed/chino/40/40' },
    { product: 'Veste Cuir', sku: '859163YCUA2100D', ai: '+45%', img: 'https://picsum.photos/seed/leather2/40/40' },
  ];

  return (
    <MainLayout activeLabel="Dashboard">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <HamburgerButton />
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">Système de Prévision des Ventes</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Recherche SKU"
                className="bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="text-gray-400 hover:text-gray-600 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <Settings size={20} />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 pl-4 border-l border-gray-100"
                >
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-gray-900">{config?.companyName || 'Emily'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{config?.sector || 'Retailer'}</p>
                  </div>
                  <img src="https://picsum.photos/seed/emily/32/32" alt="Profile" className="w-8 h-8 rounded-full border border-gray-100" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                      <User size={16} /> Profil
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                      <Settings size={16} /> Paramètres
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button onClick={() => navigate('/')} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 font-bold">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm space-y-4 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{kpi.title}</span>
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    {kpi.icon}
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-gray-900">{kpi.value}</span>
                  <span className="text-[10px] font-bold text-gray-400">{kpi.sub}</span>
                </div>
                {kpi.trend && (
                  <div className="flex items-center gap-1">
                    <span className={cn("text-[10px] font-bold", kpi.trendColor || "text-green-500")}>{kpi.trend}</span>
                    {kpi.trendLabel && <span className="text-[10px] text-gray-400 font-medium">{kpi.trendLabel}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Middle Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Chart */}
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-gray-800">Chiffre d’affaire Global</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100">
                    <input type="text" readOnly value="1, JAN 2026 - 7, JAN 2026" className="bg-transparent text-[10px] font-bold text-gray-600 px-2 outline-none w-40" />
                    <ChevronRight size={14} className="text-gray-400 rotate-90" />
                  </div>
                  <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                    {['7 Jour', '30 Jour'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={cn(
                          "px-4 py-1.5 rounded-md text-[10px] font-bold transition-all",
                          period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                      tickFormatter={(val) => `${val}€`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }}
                    />
                    <Line type="monotone" dataKey="N" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="N1" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="FORECAST" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SKU en rupture */}
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-gray-50 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-gray-800">SKU en rupture</h2>
                <span className="bg-red-50 text-red-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">12 Indisponible</span>
              </div>

              <div className="flex-1 space-y-6">
                {outOfStock.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate('/product-detail', { state: { product: item } })}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0056d2] transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", item.status)} />
                          <p className="text-[10px] text-gray-400 font-medium">{item.stock}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{item.sales}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">AVG SALES</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-3 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors border-t border-gray-50">
                Voir plus de produits
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recommandation de reassort */}
            <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-8">
              <h2 className="text-lg font-bold text-gray-800">Recommandation de reassort</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4 font-bold">PRODUIT</th>
                      <th className="pb-4 font-bold">SKU</th>
                      <th className="pb-4 font-bold">AI PREVISION</th>
                      <th className="pb-4 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recommendations.map((item, idx) => (
                      <tr 
                        key={idx} 
                        className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => navigate('/product-detail', { state: { product: item } })}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <img src={item.img} alt={item.product} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                            <span className="text-sm font-bold text-gray-900">{item.product}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-[10px] font-mono font-bold text-gray-400">{item.sku}</span>
                        </td>
                        <td className="py-4">
                          <span className="text-sm font-black text-green-500">{item.ai}</span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/product-detail', { state: { product: item } });
                            }}
                            className="bg-[#0056d2] text-white px-6 py-2 rounded-lg text-[10px] font-black hover:bg-[#0044a8] transition-all shadow-lg shadow-blue-100 uppercase tracking-widest"
                          >
                            ANALYSE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button className="w-full py-3 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors border-t border-gray-50">
                Voir plus de produits
              </button>
            </div>

            {/* SKU en Bestseller */}
            <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-gray-50 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 mb-8">SKU en Bestseller</h2>

              <div className="flex-1 space-y-6">
                {bestSellers.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => navigate('/product-detail', { state: { product: item } })}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50" />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0056d2] transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", item.status)} />
                          <p className="text-[10px] text-gray-400 font-medium">{item.stock}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{item.sales}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">AVG SALES</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-3 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors border-t border-gray-50">
                Voir plus de produits
              </button>
            </div>
          </div>
        </main>
      </div>

      <NotificationDrawer 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
      />
    </MainLayout>
  );
};

const AnalysisScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Step 2 in progress, 2: Step 3 in progress, 3: All done
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('smartRetailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }

    // Step 2 simulation
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 3000);

    // Step 3 simulation
    const timer2 = setTimeout(() => {
      setStep(3);
    }, 6000);

    // Final redirection
    const timer3 = setTimeout(() => {
      navigate('/dashboard');
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate]);

  return (
    <MainLayout activeLabel="Initial Config">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <HamburgerButton />
            <Logo />
          </div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Configuration initiale</span>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-gray-50 w-full max-w-5xl flex flex-col items-center space-y-10">
          
          {/* Main Icon */}
          <div className="w-24 h-24 bg-[#0056d2] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 9v6M9 12h6" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Analyse en cours...</h1>
            <p className="text-gray-400 text-base md:text-lg">Notre intelligence artificielle traite vos données</p>
          </div>

          {/* Steps Section */}
          <div className="w-full max-w-xl bg-[#f8fbff] rounded-[32px] border border-gray-100 p-4 space-y-3">
            {/* Step 1: Completed */}
            <div className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                  <Check size={24} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Données importées avec succès</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Tous vos fichiers ont été transférés en toute sécurité</p>
                </div>
              </div>
              <div className="text-green-500">
                <Check size={20} strokeWidth={3} />
              </div>
            </div>

            {/* Step 2: Calibrage */}
            <div className={cn(
              "flex items-center justify-between p-5 rounded-2xl transition-all border",
              step === 1 ? "bg-white shadow-md border-blue-100 scale-[1.02]" : step > 1 ? "bg-white shadow-sm border-green-100" : "bg-transparent border-transparent opacity-40"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  step === 1 ? "bg-blue-50 text-[#0056d2]" : step > 1 ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"
                )}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Calibrage des modèles prédictifs</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Analyse des patterns et création des prévisions</p>
                </div>
              </div>
              <div>
                {step === 1 ? (
                  <div className="w-6 h-6 border-2 border-[#0056d2] border-t-transparent rounded-full animate-spin" />
                ) : step > 1 ? (
                  <Check size={20} strokeWidth={3} className="text-green-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>

            {/* Step 3: Finalisation */}
            <div className={cn(
              "flex items-center justify-between p-5 rounded-2xl transition-all border",
              step === 2 ? "bg-white shadow-md border-blue-100 scale-[1.02]" : step > 2 ? "bg-white shadow-sm border-green-100" : "bg-transparent border-transparent opacity-40"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  step === 2 ? "bg-blue-50 text-[#0056d2]" : step > 2 ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"
                )}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Finalisation du tableau de bord</h3>
                  <p className="text-[11px] text-gray-400 font-medium">Préparation de votre interface personnalisée</p>
                </div>
              </div>
              <div>
                {step === 2 ? (
                  <div className="w-6 h-6 border-2 border-[#0056d2] border-t-transparent rounded-full animate-spin" />
                ) : step > 2 ? (
                  <Check size={20} strokeWidth={3} className="text-green-500" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="w-5 h-5 border-2 border-[#0056d2] border-t-transparent rounded-full animate-spin" />
            <span>Traitement presque terminé...</span>
          </div>

        </div>
      </main>
    </div>
  </MainLayout>
  );
};

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [stepStatus, setStepStatus] = useState({
    1: 'completed',
    2: 'loading',
    3: 'waiting'
  });
  const [error, setError] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('smartRetailConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/analysis'), 1500);
          return 100;
        }

        // Milestones logic
        // 10% -> 25% (Step 1 already done)
        // 25% -> 70% (Step 2 in progress)
        // 70% -> 100% (Step 3 in progress)
        
        let increment = 0.8;
        if (prev < 25) increment = 1.2;
        else if (prev < 70) increment = 0.6;
        else increment = 1.5;

        const next = prev + increment;
        
        if (next >= 70 && next < 100) {
          setStepStatus({ 1: 'completed', 2: 'completed', 3: 'loading' });
        } else if (next >= 100) {
          setStepStatus({ 1: 'completed', 2: 'completed', 3: 'completed' });
        }

        return Math.min(next, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate, error]);

  if (error) {
    return (
      <MainLayout activeLabel="Initial Config">
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <HamburgerButton />
              <Logo />
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Configuration initiale</span>
          </header>
          <main className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white p-12 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Une erreur est survenue lors de l’import des données.</h2>
            <p className="text-gray-500">Nous n'avons pas pu finaliser la synchronisation de vos données. Veuillez vérifier votre connexion ou le format de vos fichiers.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => setError(false)} className="bg-[#0056d2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0044a8]">Réessayer</button>
              <button onClick={() => navigate('/initial-config')} className="bg-gray-100 text-gray-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-200">Retour à la configuration</button>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
    );
  }

  return (
    <MainLayout activeLabel="Initial Config">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <HamburgerButton />
            <Logo />
          </div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Configuration initiale</span>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-gray-50 w-full max-w-5xl flex flex-col items-center space-y-12">
          
          {/* Main Icon */}
          <div className="w-20 h-20 bg-[#0056d2] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Téléchargement en cours...</h1>
            <p className="text-gray-400 text-base md:text-lg">Nous importons et sécurisons vos données</p>
          </div>

          {/* Progress Bar Section */}
          <div className="w-full max-w-2xl space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Progression du téléchargement</span>
              <span className="text-xl font-black text-[#0056d2]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
              <motion.div 
                className="bg-[#0056d2] h-full rounded-full"
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          {/* Steps Section */}
          <div className="w-full max-w-xl bg-[#f0f7ff] rounded-[32px] border border-blue-50 p-3 space-y-2">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Objectifs stratégiques</h3>
                  <p className="text-[10px] text-gray-400 font-medium">4 paramètres configurés</p>
                </div>
              </div>
              <div className="text-green-500">
                <Check size={20} strokeWidth={3} />
              </div>
            </div>

            {/* Step 2 */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all",
              stepStatus[2] === 'loading' ? "bg-white shadow-md scale-[1.01]" : stepStatus[2] === 'completed' ? "bg-white shadow-sm" : "opacity-40"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  stepStatus[2] === 'loading' ? "bg-blue-50 text-[#0056d2]" : stepStatus[2] === 'completed' ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"
                )}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Données produits</h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {stepStatus[2] === 'loading' ? "Transfert sécurisé en cours..." : stepStatus[2] === 'completed' ? "Données synchronisées" : "En attente..."}
                  </p>
                </div>
              </div>
              <div>
                {stepStatus[2] === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-[#0056d2] border-t-transparent rounded-full animate-spin" />
                ) : stepStatus[2] === 'completed' ? (
                  <Check size={20} strokeWidth={3} className="text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>

            {/* Step 3 */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all",
              stepStatus[3] === 'loading' ? "bg-white shadow-md scale-[1.01]" : stepStatus[3] === 'completed' ? "bg-white shadow-sm" : "opacity-40"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  stepStatus[3] === 'loading' ? "bg-blue-50 text-[#0056d2]" : stepStatus[3] === 'completed' ? "bg-green-50 text-green-500" : "bg-gray-100 text-gray-400"
                )}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Configuration IA</h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {stepStatus[3] === 'loading' ? "Optimisation des modèles..." : stepStatus[3] === 'completed' ? "IA configurée" : "En attente..."}
                  </p>
                </div>
              </div>
              <div>
                {stepStatus[3] === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-[#0056d2] border-t-transparent rounded-full animate-spin" />
                ) : stepStatus[3] === 'completed' ? (
                  <Check size={20} strokeWidth={3} className="text-green-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-[#0056d2] rounded-full animate-pulse" />
            <span>Veuillez ne pas fermer cette fenêtre</span>
          </div>

        </div>
      </main>
    </div>
  </MainLayout>
  );
};

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'stock',
      title: 'Alerte de stock critique',
      description: 'Jimmy Veste en laine et toile de soie (859163YCUA21000) est en rupture de stock dans le...',
      time: '5 min ago',
      unread: true,
      color: 'text-red-500',
      icon: <AlertCircle size={18} />
    },
    {
      id: '2',
      type: 'weather',
      title: 'Impact météo détecté',
      description: 'Températures élevées prévues. La catégorie Lin d’été devrait bondir de +22 %.',
      time: '15 min ago',
      unread: true,
      color: 'text-orange-500',
      icon: <Sun size={18} />
    },
    {
      id: '3',
      type: 'erp',
      title: 'Transmission ERP Confirmée',
      description: 'La commande MIP-2025-091 a été transmise avec succès à l’ERP',
      time: '1 hour ago',
      unread: false,
      color: 'text-green-500',
      icon: <Check size={18} />
    },
    {
      id: '4',
      type: 'event',
      title: 'Début de la Fashion Week de Paris',
      description: 'Événement détecté : Préparez-vous à une hausse de la demande pour les collections de créateurs.',
      time: '4 hour ago',
      unread: false,
      color: 'text-blue-500',
      icon: <Package size={18} />
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const product = state?.product || {
    name: "Jimmy Veste en laine et toile de soie",
    sku: "859163YCUA21000",
    category: "Summer 25 Veste",
    stock: "45 unités",
    sales: "32 unités/sem",
    img: "https://picsum.photos/seed/jacket_detail/120/120"
  };

  const [decisionValue, setDecisionValue] = useState("120");
  const [error, setError] = useState("");

  const handleDecisionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setDecisionValue(val);
      setError("");
    }
  };

  const handleValidate = () => {
    if (!decisionValue || parseInt(decisionValue) <= 0) {
      setError("Veuillez saisir une quantité valide.");
      return;
    }
    navigate('/store-allocation', { state: { product, quantity: parseInt(decisionValue) } });
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <TrendingUp size={20} />, label: 'Forecasting Unit' },
    { icon: <Store size={20} />, label: 'Store Allocation' },
    { icon: <Truck size={20} />, label: 'Supplier Connect' },
    { icon: <CloudSun size={20} />, label: 'Weather Hub' },
    { icon: <Database size={20} />, label: 'External Data' },
  ];

  const historicalData = [
    { date: "Juil 2025", context: "Météo", ai: "165 unités", initial: "140 unités", real: "162 unités", diff: "IA (-3)" },
    { date: "Juin 2025", context: "Promo", ai: "142 unités", initial: "120 unités", real: "145 unités", diff: "IA (-3)" },
    { date: "Mai 2025", context: "Normal", ai: "110 unités", initial: "100 unités", real: "108 unités", diff: "IA (+2)" },
  ];

  return (
    <MainLayout activeLabel="Dashboard">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <HamburgerButton />
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-4">
              <img src={product.img || "https://picsum.photos/seed/jacket_detail/80/80"} alt={product.name || product.product} className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{product.name || product.product}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category: {product.category || "Summer 25 Veste"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Actuel</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-gray-900">{product.stock?.split(' ')[0] || "45"}</span>
                <span className="text-[10px] font-bold text-gray-400">unités</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ventes Moy. Hebdo</p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-2xl font-black text-gray-900">{product.sales?.split('/')[0].split(' ')[0] || "32"}</span>
                <span className="text-[10px] font-bold text-gray-400">unités/sem</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-blue-500">
                    <User size={18} />
                    <h2 className="text-[11px] font-bold uppercase tracking-widest">Prévision initiale</h2>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-500 text-[10px] font-black rounded-full flex items-center gap-1">
                    <AlertCircle size={12} /> Moyenne
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-gray-900">95</span>
                  <span className="text-sm font-bold text-gray-400">Unités</span>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Ventes prévues</p>
                    <p className="text-lg font-black text-gray-900">140</p>
                    <p className="text-[9px] font-bold text-green-500">+14% vs moy</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Couverture</p>
                    <p className="text-lg font-black text-gray-900">5J</p>
                    <p className="text-[9px] font-bold text-gray-400">avec commande</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Risque</p>
                    <p className="text-lg font-black text-gray-900">65%</p>
                    <p className="text-[9px] font-bold text-red-500">Sans commande</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[#0056d2]">
                    <TrendingUp size={18} />
                    <h2 className="text-[11px] font-bold uppercase tracking-widest">Prévision IA</h2>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black rounded-full flex items-center gap-1">
                    <Check size={12} /> Haute
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-gray-900">120</span>
                  <span className="text-sm font-bold text-gray-400">Unités recommandées</span>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Ventes prévues</p>
                    <p className="text-lg font-black text-gray-900">165</p>
                    <p className="text-[9px] font-bold text-green-500">+7J vs moy</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Couverture</p>
                    <p className="text-lg font-black text-gray-900">7J</p>
                    <p className="text-[9px] font-bold text-gray-400">avec commande</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Risque</p>
                    <p className="text-lg font-black text-gray-900">92%</p>
                    <p className="text-[9px] font-bold text-red-500">Sans commande</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8">
              <h2 className="text-lg font-bold text-gray-800">Données Historiques de Référence</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-4">DATE</th>
                      <th className="pb-4">CONTEXTE MÉTÉO</th>
                      <th className="pb-4">PRÉVISIONS IA</th>
                      <th className="pb-4">PRÉVISIONS INITIALES</th>
                      <th className="pb-4">VENTES RÉALISÉES</th>
                      <th className="pb-4 text-right">ÉCART DE PRÉCISION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historicalData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-6 text-sm font-bold text-gray-900">{row.date}</td>
                        <td className="py-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <CloudSun size={16} />
                            <span className="text-sm font-medium">{row.context}</span>
                          </div>
                        </td>
                        <td className="py-6 text-sm font-bold text-gray-900">{row.ai}</td>
                        <td className="py-6 text-sm font-medium text-gray-500">{row.initial}</td>
                        <td className="py-6 text-sm font-bold text-gray-900">{row.real}</td>
                        <td className="py-6 text-right">
                          <span className="text-sm font-black text-[#0056d2]">{row.diff}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <p className="text-sm text-blue-900 leading-relaxed">
                  L’IA a été plus précise dans <span className="font-black">3/3 cas similaires</span>, avec une marge d’erreur moyenne de <span className="font-black">5 unités</span> vs 20 unités pour les prévisions manuelles.
                </p>
              </div>
              <div className="flex justify-center">
                <button className="px-8 py-3 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-400 hover:bg-gray-50 transition-all">Voir plus détail</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8 sticky top-32">
              <h2 className="text-lg font-bold text-gray-800">Votre Décision Finale</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-[#0056d2]">{decisionValue || "0"}</span>
                <span className="text-sm font-bold text-gray-400">unités</span>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Modifier les quantités Manuellement</label>
                  <input type="text" value={decisionValue} onChange={handleDecisionChange} className={cn("w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-lg font-bold transition-all", error && "border-red-500 ring-1 ring-red-100")} />
                  <p className="text-[10px] text-gray-400 font-medium italic">Modify the AI recommendation if needed</p>
                  {error && <p className="text-red-500 text-[10px] font-bold">{error}</p>}
                </div>
                <button onClick={handleValidate} className="w-full py-5 bg-[#0056d2] text-white rounded-2xl font-bold text-sm hover:bg-[#0044a8] transition-all shadow-xl shadow-blue-100 uppercase tracking-widest">Valider et Répartir</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} onMarkAllAsRead={markAllAsRead} />
    </MainLayout>
  );
};

const StoreAllocationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, quantity } = location.state || { 
    product: { 
      name: "Jimmy Veste en laine et toile de soie", 
      sku: "859163YCUA21000", 
      category: "Summer 25 Veste",
      img: "https://picsum.photos/seed/jacket_detail/80/80"
    }, 
    quantity: 120 
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Tout les boutiques');

  const boutiques = [
    { id: 1, name: "Paris Champs-Élysées", city: "Paris", type: "Flagship store", allocation: 50, insight: "Fashion Week proximity, highest foot traffic.", sales: 120, traffic: "2,800", performance: 95, img: "https://picsum.photos/seed/store1/80/80" },
    { id: 2, name: "Lyon Part-Dieu", city: "Lyon", type: "Boutique", allocation: 25, insight: "Strong summer category performance, regional hub.", sales: 120, traffic: "2,800", performance: 78, img: "https://picsum.photos/seed/store2/80/80" },
    { id: 3, name: "Paris Champs-Élysées", city: "Paris", type: "Flagship store", allocation: 20, insight: "Fashion Week proximity, highest foot traffic.", sales: 120, traffic: "2,800", performance: 72, img: "https://picsum.photos/seed/store3/80/80" },
    { id: 4, name: "Nice Promenade", city: "Nice", type: "Flagship store", allocation: 15, insight: "Fashion Week proximity, highest foot traffic.", sales: 120, traffic: "2,800", performance: 65, img: "https://picsum.photos/seed/store4/80/80" },
    { id: 5, name: "Bordeaux Centre", city: "Bordeaux", type: "Flagship store", allocation: 10, insight: "Tourist hotspot, but smaller store size.", sales: 120, traffic: "2,800", performance: 52, img: "https://picsum.photos/seed/store5/80/80" },
    { id: 6, name: "Paris Champs-Élysées", city: "Paris", type: "Departement de Boutique", allocation: 50, insight: "Fashion Week proximity, highest foot traffic.", sales: 120, traffic: "2,800", performance: 95, img: "https://picsum.photos/seed/store6/80/80" },
  ];

  const filteredBoutiques = boutiques.filter(b => 
    (activeTab === 'Tout les boutiques' || b.city === activeTab) &&
    (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <TrendingUp size={20} />, label: 'Forecasting Unit' },
    { icon: <Store size={20} />, label: 'Store Allocation', active: true },
    { icon: <Truck size={20} />, label: 'Supplier Connect' },
    { icon: <CloudSun size={20} />, label: 'Weather Hub' },
    { icon: <Database size={20} />, label: 'External Data' },
  ];

  return (
    <MainLayout activeLabel="Store Allocation">
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <HamburgerButton />
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-4">
              <img src={product.img} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Boutique Distribution</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU: {product.sku}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Allocation Total</p>
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-black text-[#0056d2]">{quantity}</span>
              <span className="text-[10px] font-bold text-gray-400">unités</span>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Recherche la boutique"
                      className="bg-white border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 w-64 shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {['Tout les boutiques', 'Paris', 'Lille', 'Nice', 'Lyon'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          activeTab === tab ? "text-[#0056d2] border-b-2 border-[#0056d2] rounded-b-none" : "text-gray-400 hover:text-gray-600"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                    <button className="text-[10px] font-bold text-gray-400 hover:text-gray-600 ml-2">+ Ajouter plus Tag</button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50">
                    <Settings size={14} /> Filter
                  </button>
                  <div className="flex bg-white border border-gray-100 rounded-lg p-1 shadow-sm">
                    <button className="p-1.5 bg-gray-50 rounded text-gray-600"><Menu size={16} /></button>
                    <button className="p-1.5 text-gray-400"><LayoutDashboard size={16} /></button>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBoutiques.map((boutique) => (
                  <div key={boutique.id} className="bg-white p-6 rounded-[24px] border border-gray-50 shadow-sm space-y-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <img src={boutique.img} alt={boutique.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{boutique.name}</h3>
                          <p className="text-xs text-gray-400 font-medium">{boutique.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-[#0056d2]">{boutique.allocation}</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">unités</p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <p className="text-xs text-blue-800 font-medium leading-relaxed">{boutique.insight}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Avg Weekly Sales</p>
                        <p className="text-sm font-black text-gray-900">{boutique.sales}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">unités</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Daily Foot Traffic</p>
                        <p className="text-sm font-black text-gray-900">{boutique.traffic}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">perso</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Performance</p>
                        <p className="text-sm font-black text-gray-900">{boutique.performance}</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">sur 100</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Allocation %</span>
                        <span className="text-[10px] font-black text-gray-900">{((boutique.allocation / quantity) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0056d2] rounded-full" style={{ width: `${(boutique.allocation / quantity) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold">Page Total :</span>
                  <select className="bg-white border border-gray-100 rounded px-2 py-1 text-xs font-bold text-gray-600 outline-none">
                    <option>6</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight size={16} className="rotate-180" /></button>
                  {[1, 2, 3, '...', 10].map((p, i) => (
                    <button key={i} className={cn("w-8 h-8 rounded-lg text-xs font-bold transition-all", p === 1 ? "bg-white border border-blue-100 text-[#0056d2] shadow-sm" : "text-gray-400 hover:text-gray-600")}>{p}</button>
                  ))}
                  <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
                </div>
                <div className="flex items-center gap-2">
                  <select className="bg-white border border-gray-100 rounded px-2 py-1 text-xs font-bold text-gray-600 outline-none">
                    <option>10 /20 Page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-80 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8">
                <h2 className="text-lg font-bold text-gray-800">Finalisation et Export</h2>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-[#0056d2] text-white rounded-xl font-bold text-xs hover:bg-[#0044a8] transition-all shadow-lg shadow-blue-100 uppercase tracking-widest">Envoyer vers l’ERP</button>
                  <button className="w-full py-4 bg-white text-gray-400 border border-gray-100 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all uppercase tracking-widest">Exporter en CSV</button>
                  <button className="w-full py-4 bg-white text-gray-400 border border-gray-100 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all uppercase tracking-widest">Envoyer à l’email</button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm space-y-8">
                <h2 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4">Bilan prévisionnel</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">CA Prévu</span>
                    <span className="text-lg font-black text-gray-900">€19,800</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Marge Bénéficiaire</span>
                    <span className="text-lg font-black text-green-500">+38%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Fiabilité Stock</span>
                    <span className="text-lg font-black text-green-500">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Période de couverture</span>
                    <span className="text-lg font-black text-gray-900">7 Jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

const InitialConfig = () => {
  const navigate = useNavigate();
  
  // Form State
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [salesGoal, setSalesGoal] = useState('');
  const [growthRate, setGrowthRate] = useState('');
  const [optimalStock, setOptimalStock] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [activeObjective, setActiveObjective] = useState('Réduire les ruptures');
  
  // Data Source State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [erpStatus, setErpStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  // Touched/Errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validateCompanyName = (name: string) => {
    if (!name) return false;
    const hasLetters = /[a-zA-ZÀ-ÿ]/.test(name);
    const validChars = /^[a-zA-ZÀ-ÿ\s\-\'&]+$/.test(name);
    return hasLetters && validChars;
  };

  const isNumeric = (val: string) => {
    if (val === '') return true;
    return /^\d*\.?\d*$/.test(val);
  };

  const errors = {
    companyName: touched.companyName && !validateCompanyName(companyName) ? "Le nom de l'entreprise doit contenir des lettres." : "",
    sector: touched.sector && !sector ? "Veuillez sélectionner un secteur d'activité lié à la mode." : "",
    salesGoal: touched.salesGoal && (!salesGoal || isNaN(Number(salesGoal)) || Number(salesGoal) < 0) ? "L'objectif de ventes doit être un nombre valide." : "",
    growthRate: touched.growthRate && (!growthRate || isNaN(Number(growthRate))) ? "Le taux de croissance doit être un nombre valide." : "",
    optimalStock: touched.optimalStock && (!optimalStock || isNaN(Number(optimalStock))) ? "Le niveau de stock optimal doit être un nombre valide." : "",
    alertThreshold: touched.alertThreshold && (!alertThreshold || isNaN(Number(alertThreshold))) ? "Le seuil d'alerte doit être un nombre valide." : "",
  };

  const isFormValid = 
    validateCompanyName(companyName) && 
    sector !== '' && 
    salesGoal !== '' && !isNaN(Number(salesGoal)) && Number(salesGoal) >= 0 &&
    growthRate !== '' && !isNaN(Number(growthRate)) &&
    optimalStock !== '' && !isNaN(Number(optimalStock)) &&
    alertThreshold !== '' && !isNaN(Number(alertThreshold)) &&
    (csvFile !== null || erpStatus === 'connected');

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        setCsvFile(file);
      } else {
        alert('Veuillez importer un fichier CSV valide.');
      }
    }
  };

  const handleConnectErp = () => {
    setErpStatus('connecting');
    setTimeout(() => {
      setErpStatus('connected');
    }, 2000);
  };

  const handleFinalSubmit = () => {
    if (isFormValid) {
      // Save config for later use
      const config = {
        companyName,
        sector,
        salesGoal,
        growthRate,
        optimalStock,
        alertThreshold,
        activeObjective,
        dataSource: csvFile ? 'csv' : 'erp'
      };
      localStorage.setItem('smartRetailConfig', JSON.stringify(config));
      navigate('/loading');
    }
  };

  return (
    <MainLayout activeLabel="Initial Config">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <HamburgerButton />
            <Logo />
          </div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Configuration initiale</span>
        </header>

        <main className="flex-1 p-4 md:p-10 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-y-auto">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Intro Block */}
          <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#003399]">Bienvenue sur Smart Retail</h1>
              <p className="text-gray-500 text-sm">Configurez votre système intelligent de prévision des ventes</p>
            </div>

            {/* Profil de l'enseigne */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-gray-800">Profil de l'enseigne</h2>
                <p className="text-sm text-gray-400 leading-relaxed">Remplissez les informations ci-dessous pour personnaliser votre expérience et optimiser la gestion de votre commerce.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom de entreprise</label>
                  <input 
                    type="text"
                    placeholder="Ex: Mode & Co"
                    className={cn(
                      "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all placeholder:text-gray-300",
                      errors.companyName && "border-red-500 ring-1 ring-red-100"
                    )}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, companyName: true }))}
                  />
                  {errors.companyName && <p className="text-red-500 text-[10px] mt-1">{errors.companyName}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secteur d'activité</label>
                  <div className="relative">
                    <select 
                      className={cn(
                        "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all appearance-none cursor-pointer",
                        !sector && "text-gray-300",
                        errors.sector && "border-red-500 ring-1 ring-red-100"
                      )}
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, sector: true }))}
                    >
                      <option value="" disabled>Sélectionnez</option>
                      <option value="pret-a-porter-lingerie">Prêt-à-porter + Lingerie</option>
                      <option value="pret-a-porter-accessoires">Prêt-à-porter + Accessoires</option>
                      <option value="chaussures-maroquinerie">Chaussures + Maroquinerie</option>
                      <option value="multimarques-luxe">Boutique multimarques + Luxe / Premium</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  {errors.sector && <p className="text-red-500 text-[10px] mt-1">{errors.sector}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Objectifs Block */}
          <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-10">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800">Définissez vos objectifs</h2>
              <p className="text-sm text-gray-500">Ces informations personnaliseront vos prévisions</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {['Réduire les ruptures', 'Optimiser le sur-stockage', 'Impact Météo', 'Précision des ventes'].map(obj => (
                <button
                  key={obj}
                  onClick={() => setActiveObjective(obj)}
                  className={cn(
                    "px-6 py-3 rounded-lg text-xs font-medium transition-all",
                    activeObjective === obj 
                      ? "bg-[#f0f7ff] text-[#0056d2] border border-blue-100" 
                      : "bg-[#f8fbff] text-gray-500 border border-transparent hover:bg-gray-100"
                  )}
                >
                  {obj}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Sales Goal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#0056d2]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  <label className="text-[10px] font-bold uppercase tracking-widest">Objectif de ventes (7 jours)</label>
                </div>
                <input 
                  type="text"
                  placeholder="EX: € 42850"
                  className={cn(
                    "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all placeholder:text-gray-300",
                    errors.salesGoal && "border-red-500 ring-1 ring-red-100"
                  )}
                  value={salesGoal}
                  onChange={(e) => isNumeric(e.target.value) && setSalesGoal(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, salesGoal: true }))}
                />
                <p className="text-[9px] text-gray-400 font-medium">CA souhaité pour la semaine prochaine</p>
                {errors.salesGoal && <p className="text-red-500 text-[10px] mt-1">{errors.salesGoal}</p>}
              </div>

              {/* Growth Rate */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
                  <label className="text-[10px] font-bold uppercase tracking-widest">Taux de croissance cible</label>
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="14"
                    className={cn(
                      "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all placeholder:text-gray-300 pr-10",
                      errors.growthRate && "border-red-500 ring-1 ring-red-100"
                    )}
                    value={growthRate}
                    onChange={(e) => isNumeric(e.target.value) && setGrowthRate(e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, growthRate: true }))}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                </div>
                <p className="text-[9px] text-gray-400 font-medium">Croissance vs période précédente</p>
                {errors.growthRate && <p className="text-red-500 text-[10px] mt-1">{errors.growthRate}</p>}
              </div>

              {/* Optimal Stock */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  <label className="text-[10px] font-bold uppercase tracking-widest">Niveau de stock optimal</label>
                </div>
                <input 
                  type="text"
                  placeholder="57"
                  className={cn(
                    "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all placeholder:text-gray-300",
                    errors.optimalStock && "border-red-500 ring-1 ring-red-100"
                  )}
                  value={optimalStock}
                  onChange={(e) => isNumeric(e.target.value) && setOptimalStock(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, optimalStock: true }))}
                />
                <p className="text-[9px] text-gray-400 font-medium">Nombre de SKUs à maintenir en stock</p>
                {errors.optimalStock && <p className="text-red-500 text-[10px] mt-1">{errors.optimalStock}</p>}
              </div>

              {/* Alert Threshold */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <label className="text-[10px] font-bold uppercase tracking-widest">Seuil d'alerte stock faible</label>
                </div>
                <input 
                  type="text"
                  placeholder="12"
                  className={cn(
                    "w-full p-4 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0056d2] outline-none transition-all placeholder:text-gray-300",
                    errors.alertThreshold && "border-red-500 ring-1 ring-red-100"
                  )}
                  value={alertThreshold}
                  onChange={(e) => isNumeric(e.target.value) && setAlertThreshold(e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, alertThreshold: true }))}
                />
                <p className="text-[9px] text-gray-400 font-medium">SKUs en dessous duquel être alerté</p>
                {errors.alertThreshold && <p className="text-red-500 text-[10px] mt-1">{errors.alertThreshold}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Ajoutez vos données */}
          <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-800">Ajoutez vos données</h2>
              <p className="text-sm text-gray-500">Importez ou saisissez vos produits</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* CSV Card */}
              <label className={cn(
                "p-8 border border-gray-100 rounded-2xl flex flex-col items-center text-center space-y-4 cursor-pointer transition-all",
                csvFile ? "bg-green-50 border-green-100" : "hover:border-blue-200 hover:bg-blue-50"
              )}>
                <input type="file" accept=".csv" className="sr-only" onChange={handleCsvUpload} />
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  csvFile ? "bg-green-100 text-green-600" : "bg-[#f0f7ff] text-[#0056d2]"
                )}>
                  {csvFile ? <Check size={28} /> : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">{csvFile ? csvFile.name : "Importer un CSV"}</h3>
                  <p className="text-[10px] text-gray-400 mt-1">{csvFile ? "Fichier importé avec succès" : "Téléchargez votre fichier produits"}</p>
                </div>
                {csvFile && <span className="text-[10px] text-[#0056d2] font-bold underline mt-2">Remplacer le fichier</span>}
              </label>

              {/* ERP Card */}
              <div 
                onClick={erpStatus === 'disconnected' ? handleConnectErp : undefined}
                className={cn(
                  "p-8 border border-gray-100 rounded-2xl flex flex-col items-center text-center space-y-4 transition-all cursor-pointer",
                  erpStatus === 'connected' ? "bg-purple-50 border-purple-100" : "hover:border-purple-200 hover:bg-purple-50"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center",
                  erpStatus === 'connected' ? "bg-purple-100 text-purple-600" : "bg-purple-50 text-purple-600"
                )}>
                  {erpStatus === 'connecting' ? (
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : erpStatus === 'connected' ? (
                    <Check size={28} />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">
                    {erpStatus === 'connected' ? "ERP connecté" : erpStatus === 'connecting' ? "Connexion..." : "Connecter ERP"}
                  </h3>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {erpStatus === 'connected' ? "Votre système est synchronisé" : "Synchronisez votre système"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prochaines étapes */}
          <div className="bg-[#f4f9ff] p-10 rounded-2xl space-y-8">
            <div className="flex items-center gap-3 text-[#0056d2]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
              <h3 className="font-bold text-sm">Prochaines étapes</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-[11px] text-gray-600 font-medium">
                <Check size={16} className="text-green-500 shrink-0" />
                <span>Accédez à votre tableau de bord personnalisé</span>
              </li>
              <li className="flex items-center gap-3 text-[11px] text-gray-600 font-medium">
                <Check size={16} className="text-green-500 shrink-0" />
                <span>Consultez vos premières prévisions de ventes</span>
              </li>
            </ul>
          </div>

          {/* Final Button */}
          <button
            onClick={handleFinalSubmit}
            disabled={!isFormValid}
            className={cn(
              "w-full py-5 rounded-xl font-bold text-sm transition-all",
              isFormValid 
                ? "bg-[#0056d2] text-white hover:bg-[#0044a8] shadow-xl shadow-blue-100" 
                : "bg-[#cbd5e1] text-white cursor-not-allowed"
            )}
          >
            Commencer à utiliser Smart Retail
          </button>

        </div>
      </main>
    </div>
  </MainLayout>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/initial-config" element={<InitialConfig />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/analysis" element={<AnalysisScreen />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard-main" element={<MainDashboard />} />
      <Route path="/product-detail" element={<ProductDetailPage />} />
      <Route path="/store-allocation" element={<StoreAllocationPage />} />
    </Routes>
  );
}
