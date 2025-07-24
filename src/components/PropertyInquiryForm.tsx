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

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    const parts = [];
    if (match[1]) parts.push(match[1]);
    if (match[2]) parts.push(match[2]);
    if (match[3]) parts.push(match[3]);
    return parts.join('-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
          name: formData.name,
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          buyOrRent: formData.buyOrRent,
          propertyType: formData.propertyType,
          location: formData.location,
          zipCode: formData.zipCode,
          budget: formData.budget.replace(/[^0-9]/g, ''),
          message: formData.message
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      toast({
        title: "Thank you for your inquiry!",
        description: "We've received your details and our agent will contact you within 24 hours.",
        duration: 10000
      });

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
      console.error("Submission error:", error);
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
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: formatPhoneNumber(e.target.value)})} maxLength={12} required />
                </div>
                <div className="space-y-2">
                  <Label>Buy or Rent *</Label>
                  <RadioGroup value={formData.buyOrRent} onValueChange={(value) => setFormData({...formData, buyOrRent: value})} className="flex gap-6 pt-2" required>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="buy" />
                      <Label htmlFor="buy">Buy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rent" id="rent" />
                      <Label htmlFor="rent">Rent</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({...formData, propertyType: value})}>
                    <SelectTrigger>
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
                  <Label htmlFor="location">Preferred Location</Label>
                  <Input id="location" type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" type="text" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value.replace(/\D/g, '').slice(0, 5)})} maxLength={5} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input id="budget" type="text" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value.replace(/[^0-9,]/g, '')})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Requirements</Label>
                <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} />
              </div>

              <Button type="submit" disabled={isSubmitting} className={`w-full ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}>
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
            Or call us directly at <a href="tel:8660913734" className="text-accent font-semibold hover:underline">(866) 091-3734</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PropertyInquiryForm;
