import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Home } from "lucide-react";

const PropertyInquiryForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    buyOrRent: "",
    propertyType: "",
    location: "",
    zipCode: "",
    budget: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    
    const parts = [];
    if (match[1]) parts.push(`(${match[1]}`);
    if (match[2]) parts.push(`) ${match[2]}`);
    if (match[3]) parts.push(`-${match[3]}`);
    
    return parts.join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.buyOrRent) {
      toast({
        title: "Missing required fields",
        description: "Please fill in Name, Email, Phone, and Buy/Rent selection",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 5000
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://cosmos-tech-realty.onrender.com/api/submit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone.replace(/\D/g, '') // Store only digits
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to submit form try again");
      }

      toast({
        title: "Thank you for your inquiry!",
        description: "We've received your details and our agent will contact you within 24 hours.",
        duration: 10000
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        buyOrRent: "",
        propertyType: "",
        location: "",
        zipCode: "",
        budget: "",
        message: ""
      });

    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: error instanceof Error 
          ? error.message 
          : "Please try again or contact us directly at (866) 091-3734",
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const propertyTypes = [
    "Single Family Home",
    "Townhouse",
    "Condominium",
    "Duplex",
    "Apartment",
    "Commercial Property",
    "Land/Lot"
  ];

  return (
    <section id="inquiry-form" className="py-20 bg-muted">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Start Your <span className="text-accent">Property Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your property needs and we'll match you with the perfect home
          </p>
        </div>

        <Card className="bg-card shadow-xl border-border animate-scale-in">
          <CardHeader className="text-center pb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4 mx-auto">
              <Home className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-2xl text-primary">Property Inquiry Form</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="border-border focus:ring-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="border-border focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", formatPhoneNumber(e.target.value))}
                    placeholder="(123) 456-7890"
                    maxLength={14}
                    required
                    className="border-border focus:ring-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-primary font-medium">Buy or Rent *</Label>
                  <RadioGroup 
                    value={formData.buyOrRent} 
                    onValueChange={(value) => handleInputChange("buyOrRent", value)}
                    className="flex gap-6 pt-2"
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="buy" className="border-accent text-accent" />
                      <Label htmlFor="buy" className="text-muted-foreground">Buy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" className="border-accent text-accent" />
                      <Label htmlFor="rent" className="text-muted-foreground">Rent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="text-primary font-medium">Property Type</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => handleInputChange("propertyType", value)}
                  >
                    <SelectTrigger className="border-border focus:ring-accent">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-primary font-medium">Preferred Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Charlotte, Raleigh, Durham"
                    className="border-border focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-primary font-medium">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Enter 5-digit ZIP"
                    maxLength={5}
                    className="border-border focus:ring-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-primary font-medium">Budget Range</Label>
                  <Input
                    id="budget"
                    type="text"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="e.g., $300,000 - $400,000"
                    className="border-border focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-primary font-medium">Additional Requirements</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your specific needs, must-haves, timeline, or other requirements..."
                  rows={4}
                  className="border-border focus:ring-accent resize-none"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-foreground mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Property Inquiry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Or call us directly at{" "}
            <a href="tel:8660913734" className="text-accent font-semibold hover:underline">
              (866) 091-3734
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PropertyInquiryForm;