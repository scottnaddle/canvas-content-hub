
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.dashboard"), href: "/dashboard" },
    { name: t("nav.library"), href: "/content-library" },
    { name: t("nav.admin"), href: "/admin" },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center"
          >
            <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Canvas Hub
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`animated-underline text-sm font-medium transition-colors ${
                  isActive(link.href) 
                    ? "text-primary" 
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/login">
              <Button variant="outline" size="sm" className="ml-4 animate-fade-in">
                {t("nav.login")}
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector />
            <button
              className="ml-4 p-2 rounded-md focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} glass animate-slide-down`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive(link.href) 
                  ? "text-primary bg-primary/5" 
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm" className="w-full mt-4">
              {t("nav.login")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
