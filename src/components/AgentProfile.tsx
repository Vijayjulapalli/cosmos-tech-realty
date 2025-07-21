import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Phone, Mail, MapPin } from "lucide-react";
import agentPhoto from "@/assets/agent-photo.jpeg";
const AgentProfile = () => {
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
  const reviews = [{
    name: "Sarah Johnson",
    rating: 5,
    comment: "vijay helped us find our dream home in Charlotte. Professional, knowledgeable, and truly cared about our needs."
  }, {
    name: "Michael Chen",
    rating: 5,
    comment: "Excellent service from start to finish. Made the home buying process smooth and stress-free."
  }, {
    name: "Emily Rodriguez",
    rating: 5,
    comment: "Outstanding agent! Great communication and went above and beyond to help us sell our home quickly. thankyou vijay"
  }];
  const renderStars = (rating: number) => {
    return Array.from({
      length: 5
    }, (_, i) => <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-accent fill-accent' : 'text-muted'}`} />);
  };
  return <section id="agent-profile" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Meet Your <span className="text-accent">Local Expert</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to providing exceptional real estate service in North Carolina
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Agent Profile */}
          <Card className="bg-card shadow-xl border-border animate-scale-in">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <img src={agentPhoto} alt="Vijay Julapalli - Real Estate Agent" className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
                  <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full p-2">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-primary mb-2">VIJAY JULAPALLI</h3>
                <p className="text-accent font-semibold mb-4">
                  Licensed Real Estate Agent
                </p>
                <div className="flex justify-center mb-4">
                  {renderStars(5)}
                  <span className="ml-2 text-muted-foreground">(4.9/5.0)</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  With over 10 years of experience in the North Carolina real estate market, 
                  Vijay specializes in helping families find their perfect homes. Known for 
                  exceptional communication and personalized service.
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">150+</div>
                    <div className="text-xs text-muted-foreground">Homes Sold</div>
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold text-accent">15</div>
                    <div className="text-xs text-muted-foreground">Days Average</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="text-primary">(91)86609-13734</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="text-primary">julapallivijay66@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-primary">North Carolina, 602026</span>
                </div>
              </div>

              <Button onClick={scrollToForm} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div className="space-y-6 animate-slide-up">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold text-primary mb-4">
                Client Reviews
              </h3>
              <p className="text-muted-foreground">
                See what our satisfied clients have to say
              </p>
            </div>

            <div className="space-y-4">
              {reviews.map((review, index) => <Card key={index} className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in" style={{
              animationDelay: `${index * 0.2}s`
            }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-accent font-semibold">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-primary">{review.name}</span>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            <div className="text-center lg:text-left">
              <p className="text-accent font-semibold">
                ⭐ Average Rating: 4.9/5.0 based on 50+ reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default AgentProfile;