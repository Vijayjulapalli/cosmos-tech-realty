import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Search, ArrowRight } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Search,
      title: "Home Buying Support",
      description: "Expert guidance through every step of the home buying process. From property search to closing, we're with you.",
      features: ["Property Search", "Market Analysis", "Negotiation", "Closing Support"]
    },
    {
      icon: DollarSign,
      title: "Home Selling Guidance",
      description: "Maximize your property value with our proven selling strategies and market expertise.",
      features: ["Market Valuation", "Professional Marketing", "Buyer Screening", "Quick Sales"]
    },
    {
      icon: Home,
      title: "Custom Property Matching",
      description: "Personalized property matching based on your specific needs, budget, and lifestyle preferences.",
      features: ["Custom Search", "Lifestyle Matching", "Investment Analysis", "Future Planning"]
    }
  ];

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
    <section id="services" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Our <span className="text-accent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive real estate services designed to make your property journey smooth and successful
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6 group-hover:bg-accent/20 transition-all duration-300">
                  <service.icon className="h-8 w-8 text-accent" />
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={scrollToForm}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 group-hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-accent/5 rounded-2xl">
            <div className="text-accent">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-primary font-semibold">
                Free consultation for all new clients
              </p>
              <p className="text-muted-foreground text-sm">
                No obligation, just expert advice
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;