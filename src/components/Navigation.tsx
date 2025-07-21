import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Home } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80; // Height of the fixed navigation
      const elementPosition = element.offsetTop - navHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Property Form", id: "inquiry-form" },
    { name: "Agent", id: "agent-profile" },
    { name: "Contact", id: "contact" }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary backdrop-blur-sm shadow-lg border-b border-border">
      <div className="max-w-10xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            
              <img
               src="/logo.jpeg" 
               alt="Cosmos Tech Realty Logo" 
               className="h-10 w-10 rounded-full object-cover"
                />
            
            <div className="leadin-tight whitespace-nowrap">
              <h1 className="text-xl font-bold text-primary-foreground">Cosmos Tech Realty</h1>
              <p className="text-xs text-primary-foreground/70">LLC</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-primary-foreground hover:text-accent transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Call Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button 
              asChild
              className="hidden sm:flex bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a href="tel:8660913734">
                <Phone className="mr-2 h-4 w-4" />
                (01) 86609-13734
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-primary hover:text-accent transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-primary hover:text-accent hover:bg-accent/5 transition-all duration-200 font-medium"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-4 pt-2">
                <Button 
                  asChild
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <a href="tel:8660913734">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now: (866) 091-3734
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;