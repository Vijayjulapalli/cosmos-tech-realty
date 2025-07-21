import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import realEstateBg from "@/assets/real-estate-bg.jpg";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToForm = () => {
    const element = document.getElementById('inquiry-form');
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Real Estate Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${realEstateBg})`,
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90 z-10" />
        
        {/* Animated backdrop elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse z-20" />
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-pulse z-20" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/8 rounded-full blur-xl animate-pulse z-20" style={{ animationDelay: '2s' }} />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-accent/30 rotate-45 animate-bounce z-20" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent/40 rounded-full animate-bounce z-20" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-accent/50 animate-bounce z-20" style={{ animationDelay: '2.5s' }} />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 z-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-scale-in">
            Find Your <span className="text-accent animate-pulse">Perfect Home</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Helping to find a perfect home with trust and care. We are here to give you the best house for your need.
          </p>
          
          <p className="text-lg text-primary-foreground/80 mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Serving North Carolina with personalized real estate solutions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Find Your Perfect Home
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={scrollToContact}
              variant="outline" 
              size="lg"
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6 rounded-full font-semibold transition-all duration-300"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call Now: (866) 091-3734
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
};

export default Hero;