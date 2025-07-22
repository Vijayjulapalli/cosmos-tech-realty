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
    houseType: "",
    area: "",
    zipCode: "",
    extraInput: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:8081/api/send-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
});


    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || "Server responded with an error");
    }

    toast({
      title: "Thanks for contacting Cosmos Tech Realty LLC!",
      description: "We’ve received your inquiry. Our agent will reach out to you soon.",
    });

    // Reset form only on success
    setFormData({
      name: "",
      email: "",
      phone: "",
      buyOrRent: "",
      houseType: "",
      area: "",
      zipCode: "",
      extraInput: ""
    });
  } catch (error) {
    console.error("Form submission error:", error);
    toast({
      title: "Submission failed",
      description: "Please try again or contact us directly at 86609-13734.",
      variant: "destructive"
    });
  } finally {
    setIsSubmitting(false);
  }
};

  const houseTypes = [
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(XXX) XXX-XXXX"
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
                  <Label htmlFor="houseType" className="text-primary font-medium">House Type</Label>
                  <Select value={formData.houseType} onValueChange={(value) => handleInputChange("houseType", value)}>
                    <SelectTrigger className="border-border focus:ring-accent">
                      <SelectValue placeholder="Select house type" />
                    </SelectTrigger>
                    <SelectContent>
                      {houseTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area" className="text-primary font-medium">Preferred Area</Label>
                  <Input
                    id="area"
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    placeholder="e.g., Charlotte, Raleigh, Durham"
                    className="border-border focus:ring-accent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-primary font-medium">Zip Code</Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="Enter zip code"
                  className="border-border focus:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraInput" className="text-primary font-medium">Additional Requirements</Label>
                <Textarea
                  id="extraInput"
                  value={formData.extraInput}
                  onChange={(e) => handleInputChange("extraInput", e.target.value)}
                  placeholder="Tell us about your specific needs, budget range, timeline, or any other requirements..."
                  rows={4}
                  className="border-border focus:ring-accent resize-none"
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
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