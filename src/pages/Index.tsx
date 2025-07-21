import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import AgentProfile from "@/components/AgentProfile";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section id="home">
          <Hero />
        </section>
        <About />
        <Services />
        <PropertyInquiryForm />
        <AgentProfile />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
