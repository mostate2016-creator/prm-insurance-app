import { Link } from "wouter";
import { Car, Home, Heart, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

function PRMLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-label="PRM Insurance">
      <rect x="2" y="2" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M12 32V14h6.5a5.5 5.5 0 0 1 0 11H12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 32V20l4 6 4-6v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <PRMLogo />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground leading-tight">PRM Insurance</h1>
              <p className="text-xs text-muted-foreground">Protecting what matters most</p>
            </div>
          </div>
          <a
            href="tel:4177661819"
            className="flex items-center gap-2 text-sm font-medium text-primary"
            data-testid="link-phone"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">(417) 766-1819</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-10 h-10 opacity-80" />
          </div>
          <h2 className="text-xl font-bold mb-3 leading-tight" data-testid="text-hero-title">
            Get Your Free Quote Today
          </h2>
          <p className="text-sm opacity-90 max-w-lg mx-auto leading-relaxed">
            Whether it's your home, your car, or your family's future — PRM Insurance helps Missouri families 
            find coverage that fits their lives and their budget. Get started in just a few minutes.
          </p>
        </div>
      </section>

      {/* Quote Options */}
      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <h3 className="text-lg font-semibold text-center mb-2" data-testid="text-section-title">
            What would you like to insure?
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Select a quote type below to get started
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Auto Insurance Card */}
            <Link href="/auto-quote">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1" data-testid="text-auto-title">Auto Insurance</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Protect your vehicle with the right coverage at the right price.
                    </p>
                  </div>
                  <Button className="w-full mt-auto" data-testid="button-auto-quote">
                    Get Auto Quote
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Home Insurance Card */}
            <Link href="/home-quote">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Home className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1" data-testid="text-home-title">Home Insurance</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Keep your home and belongings safe with comprehensive coverage.
                    </p>
                  </div>
                  <Button className="w-full mt-auto" data-testid="button-home-quote">
                    Get Home Quote
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Life Insurance Card */}
            <Link href="/life-quote">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base mb-1" data-testid="text-life-title">Life Insurance</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Protect your family's future with the right life insurance plan.
                    </p>
                  </div>
                  <Button className="w-full mt-auto" data-testid="button-life-quote">
                    Get Life Quote
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Trust Section */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-medium">
              Why choose PRM Insurance?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4">
                <p className="font-semibold text-sm mb-1">Local Team</p>
                <p className="text-xs text-muted-foreground">Based in Missouri, serving your community</p>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm mb-1">Multiple Carriers</p>
                <p className="text-xs text-muted-foreground">We shop around so you get the best rate</p>
              </div>
              <div className="p-4">
                <p className="font-semibold text-sm mb-1">Personal Service</p>
                <p className="text-xs text-muted-foreground">Real people, not automated phone trees</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-medium text-foreground mb-1">PRM Insurance</p>
          <p className="text-xs text-muted-foreground mb-1">
            <a href="tel:4177661819" className="hover:underline">(417) 766-1819</a>
            {" · "}
            <a href="https://www.facebook.com/pritchettrm/" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            &copy; {new Date().getFullYear()} PRM Insurance. All rights reserved.
          </p>
          <div className="mt-4">
            <PerplexityAttribution />
          </div>
        </div>
      </footer>
    </div>
  );
}
