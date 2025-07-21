import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "(866) 091-3734",
      description: "Available 24/7 for urgent matters",
      action: "tel:8660913734"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "info@cosmostechrealty.com",
      description: "We respond within 2 hours",
      action: "mailto:info@cosmostechrealty.com"
    },
    {
      icon: MapPin,
      title: "Service Area",
      details: "North Carolina",
      description: "Zip Code: 602026",
      action: ""
    }
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://facebook.com/cosmostechrealty",
      color: "hover:text-blue-600"
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/cosmostechrealty",
      color: "hover:text-pink-600"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/company/cosmostechrealty",
      color: "hover:text-blue-700"
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 5:00 PM" }
  ];

  return (
    <section id="contact" className="py-20 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Get In <span className="text-accent">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to start your real estate journey? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <Card 
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <info.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {info.title}
                </h3>
                <p className="text-lg font-medium text-accent mb-2">
                  {info.details}
                </p>
                <p className="text-muted-foreground text-sm mb-6">
                  {info.description}
                </p>
                {info.action && (
                  <Button 
                    asChild
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <a href={info.action}>
                      Contact Now
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Business Hours */}
          <Card className="bg-card shadow-lg border-border animate-scale-in">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6 text-accent" />
                <h3 className="text-2xl font-bold text-primary">Business Hours</h3>
              </div>
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                    <span className="font-medium text-primary">{schedule.day}</span>
                    <span className="text-accent font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-primary">Emergency Contact</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  For urgent real estate matters outside business hours, call our emergency line
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Map */}
          <Card className="bg-card shadow-lg border-border animate-scale-in">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Follow Us</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center p-4 bg-accent/5 rounded-lg hover:bg-accent/10 transition-all duration-300 ${social.color} hover:scale-105`}
                  >
                    <social.icon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>

              <div className="bg-accent/5 rounded-lg p-6">
                <h4 className="font-semibold text-primary mb-3">Service Area</h4>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-primary">North Carolina</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Primary service area: Zip Code 602026 and surrounding communities
                </p>
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">Interactive Map</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 p-6 bg-accent/10 rounded-2xl">
            <div className="text-accent">
              <Phone className="h-8 w-8" />
            </div>
            <div>
              <p className="text-primary font-bold text-lg">
                Ready to get started?
              </p>
              <p className="text-muted-foreground">
                Call us now at{" "}
                <a href="tel:8660913734" className="text-accent font-semibold hover:underline">
                  (866) 091-3734
                </a>{" "}
                for your free consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;