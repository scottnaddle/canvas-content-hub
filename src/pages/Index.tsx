
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileText, Video, Headphones, PanelRight, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  // Animate elements on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));
    
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/30 -z-10"></div>
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold animate-fade-in">
              {t("home.welcome")}
            </h1>
            <p className="mt-6 text-xl text-muted-foreground animate-fade-in animation-delay-200">
              {t("home.subtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("home.getStarted")}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t("home.learnMore")}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hero graphic */}
        <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl border border-border shadow-xl animate-fade-in animation-delay-500">
            <div className="aspect-[16/9] bg-card relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-xs flex items-center justify-center">
                  <div className="p-8 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Canvas Hub</h3>
                    <p className="text-muted-foreground">Content Management Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 -left-4 md:left-8 w-16 h-16 bg-primary/10 rounded-lg border border-primary/20 animate-float"></div>
          <div className="absolute bottom-1/4 -right-4 md:right-8 w-24 h-24 bg-secondary/20 rounded-lg border border-border animate-float animation-delay-1000"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={featuresRef} className="py-16 md:py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold reveal">
              Seamless Learning Content Management
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto reveal">
              Organize, share, and analyze your educational content with powerful tools designed for Canvas LMS
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <PanelRight size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">LTI Integration</h3>
                <p className="text-muted-foreground">
                  Seamlessly connect with Canvas LMS using LTI 1.3 standards for a unified learning experience
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Single Sign-On</h3>
                <p className="text-muted-foreground">
                  Streamline authentication with SSO support and social login options for easy access
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Content Management</h3>
                <p className="text-muted-foreground">
                  Organize and categorize various content formats with rich metadata and tagging
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 4 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Video size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Integrated Previews</h3>
                <p className="text-muted-foreground">
                  Preview videos, audio, documents and more directly in the browser without downloading
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 5 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <BarChart size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Learning Analytics</h3>
                <p className="text-muted-foreground">
                  Track content usage statistics and generate insightful reports on learning activities
                </p>
              </CardContent>
            </Card>
            
            {/* Feature 6 */}
            <Card className="border border-border hover-elevate reveal">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                  <Headphones size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
                <p className="text-muted-foreground">
                  Experience the interface in multiple languages including English, Korean, Russian, and Uzbek
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center reveal">
            <Link to="/dashboard">
              <Button className="group">
                Explore Features
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-secondary/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent -z-10"></div>
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-2xl mx-auto reveal">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Enhance Your Learning Experience?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Start managing your educational content with Canvas Hub today
            </p>
            <div className="mt-10">
              <Link to="/login">
                <Button size="lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
