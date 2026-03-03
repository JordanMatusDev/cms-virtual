import  { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Bell, Menu, X, Plus } from 'lucide-react';
import NotificationsMenu from './header/NotificationsMenu';
import logoText from '../assets/virtualz.png';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import SearchBar from './header/SearchBar';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';
import { useScroll } from '../hooks/header/useScroll';
import { useAuthSession } from '../hooks/header/useAuthSession';

import { useEffect } from 'react';

const Header = () => {
  const isScrolled = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [registerData,] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useAuthSession();

  // Abrir modal de login si sessionStorage lo indica
  useEffect(() => {
    if (sessionStorage.getItem('openLoginModal') === '1') {
      setIsAuthOpen(true);
      setAuthView('login');
      sessionStorage.removeItem('openLoginModal');
    }
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setIsDropdownOpen(open => !open);
    } else {
      setIsAuthOpen(true);
      setAuthView('login');
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-[#050505]/85 backdrop-blur-xl border-white/10 py-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between gap-4">
            {/* 1. ZONA DE LOGO */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Plus size={24} className="text-white stroke-[4px]" />
              </div>
              <div className="h-10 flex items-center">
                <img
                  src={logoText}
                  alt="Virtual+ Logo Texto"
                  className="h-8 w-auto object-contain brightness-150"
                />
              </div>
            </Link>

            {/* 2. BARRA DE BÚSQUEDA */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto px-8 relative">
              <SearchBar />
            </div>

            {/* 3. PERFIL Y NOTIFICACIONES */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="relative" style={{ display: 'inline-block' }} ref={notificationsContainerRef}>
                <button
                  className="text-gray-400 hover:text-white transition-colors relative p-2 hover:bg-white/5 rounded-full"
                  onClick={() => setIsNotificationsOpen(open => !open)}
                  aria-label="Ver notificaciones"
                >
                  <Bell size={22} />
                  <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-cyan-500 ring-2 ring-black animate-pulse"></span>
                </button>
                <NotificationsMenu isOpen={isNotificationsOpen} setIsOpen={setIsNotificationsOpen} containerRef={notificationsContainerRef} />
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block"></div>
              <div className="relative" ref={profileContainerRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 group outline-none"
                >
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_10px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-shadow">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                        {user && user.avatar ? (
                          <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-200 group-hover:text-white transition-colors">
                            {/* Icono User */}
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                <UserMenu isOpen={isDropdownOpen} setIsOpen={setIsDropdownOpen} containerRef={profileContainerRef} />
              </div>
              <div className="md:hidden flex items-center ml-2">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white p-2"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* MENÚ MÓVIL */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onProfileClick={handleProfileClick}
        />
      </header>
      {/* MODALES DE AUTENTICACIÓN */}
      <LoginModal
        isOpen={isAuthOpen && authView === 'login'}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
        }}
        onSwitchToRegister={() => {
          setAuthView('register');
        }}
        onSwitchToForgot={() => {
          setAuthView('forgot');
        }}
      />
      <RegisterModal
        isOpen={isAuthOpen && authView === 'register'}
        onClose={() => setIsAuthOpen(false)}
        onSwitchToLogin={() => {
          setAuthView('login');
        }}
        initialData={registerData}
      />
      <ForgotPasswordModal
        isOpen={isAuthOpen && authView === 'forgot'}
        onClose={() => setIsAuthOpen(false)}
        onSwitchToLogin={() => {
          setAuthView('login');
        }}
      />
    </>
  );
};

export default Header;