import { Card, CardContent } from "@/components/ui/card";
import { Award, MapPin, Users, Shield } from "lucide-react";

const About = () => {
  const trustPoints = [
    {
      icon: Award,
      title: "10+ Years of Local Expertise",
      description: "Deep knowledge of North Carolina real estate market"
    },
    {
      icon: Users,
      title: "Personalized Matchmaking",
      description: "Tailored property matching for your unique needs"
    },
    {
      icon: Shield,
      title: "Hassle-Free Process",
      description: "Smooth transactions with complete transparency"
    },
    {
      icon: MapPin,
      title: "Local Market Leader",
      description: "Specialized in North Carolina properties"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            About <span className="text-accent">Cosmos Tech Realty</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            At Cosmos Tech Realty LLC, we believe that finding the perfect home should be an exciting journey, not a stressful experience. Our mission is to provide exceptional real estate services throughout North Carolina, with a special focus on the 602026 area.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustPoints.map((point, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <point.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {point.title}
                </h3>
                <p className="text-muted-foreground">
                  {point.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-6">
                Our Mission
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We're committed to making your real estate dreams a reality. Whether you're buying your first home, selling your current property, or looking for the perfect investment opportunity, our team provides personalized service that puts your needs first.
              </p>
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-accent" />
                <span className="text-primary font-semibold">
                  Serving North Carolina, Zip Code: 602026
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-accent/5 rounded-xl">
                <div className="text-3xl font-bold text-accent mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Homes Sold</div>
              </div>
              <div className="text-center p-6 bg-accent/5 rounded-xl">
                <div className="text-3xl font-bold text-accent mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div className="text-center p-6 bg-accent/5 rounded-xl">
                <div className="text-3xl font-bold text-accent mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center p-6 bg-accent/5 rounded-xl">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;