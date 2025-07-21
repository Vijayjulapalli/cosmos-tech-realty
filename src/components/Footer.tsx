import { Home, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/cosmostechrealty"
    },
    {
      name: "Instagram", 
      icon: Instagram,
      url: "https://instagram.com/cosmostechrealty"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/cosmostechrealty"
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-accent p-2 rounded-lg">
                <Home className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Cosmos Tech Realty LLC</h3>
                <p className="text-primary-foreground/80 text-sm">Your Trusted Real Estate Partner</p>
              </div>
            </div>
            
            <p className="text-primary-foreground/90 mb-6 leading-relaxed">
              Helping to find a perfect home with trust and care. We are here to give you the best house for your need. 
              Serving North Carolina with personalized real estate solutions.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <a href="tel:8660913734" className="text-primary-foreground/90 hover:text-accent transition-colors">
                  (866) 091-3734
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <a href="mailto:info@cosmostechrealty.com" className="text-primary-foreground/90 hover:text-accent transition-colors">
                  info@cosmostechrealty.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-primary-foreground/90">North Carolina, Zip Code: 602026</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('agent-profile')}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  Our Agent
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-primary-foreground/90 hover:text-accent transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Our Services</h4>
            <ul className="space-y-3">
              <li className="text-primary-foreground/90">Home Buying Support</li>
              <li className="text-primary-foreground/90">Home Selling Guidance</li>
              <li className="text-primary-foreground/90">Custom Property Matching</li>
              <li className="text-primary-foreground/90">Market Analysis</li>
              <li className="text-primary-foreground/90">Investment Consultation</li>
            </ul>
          </div>
        </div>

        <hr className="border-primary-foreground/20 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-primary-foreground/80 text-sm">
            © {currentYear} Cosmos Tech Realty LLC. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-primary-foreground/80 text-sm">Follow Us:</span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-primary-foreground/60 text-xs">
            Licensed Real Estate Broker | Equal Housing Opportunity | MLS Participant
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;