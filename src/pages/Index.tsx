import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navigation } from '@/components/layout/Navigation';
import { Map, Users, Building, Trophy, Compass, Sparkles } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Compass className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Story-Driven Bar Crawl Adventures
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Embark on immersive treasure hunts across your city's best bars. 
              Solve puzzles, discover clues, and unlock exclusive rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="xl" className="w-full sm:w-auto gap-2">
                  <Users className="h-5 w-5" />
                  I Want to Play
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="accent" size="xl" className="w-full sm:w-auto gap-2">
                  <Building className="h-5 w-5" />
                  I Want to Host
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A new way to experience your city's nightlife through interactive storytelling
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Map className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Choose Your Hunt</h3>
                <p className="text-muted-foreground text-center">
                  Browse themed adventures across different neighborhoods and bars. 
                  Each hunt tells a unique story.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Sparkles className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Solve Puzzles</h3>
                <p className="text-muted-foreground text-center">
                  Scan QR codes, crack riddles, and complete challenges at each location. 
                  Work solo or with friends.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-full bg-accent/10">
                    <Trophy className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Earn Rewards</h3>
                <p className="text-muted-foreground text-center">
                  Unlock exclusive drink deals, collect achievements, and compete 
                  for the fastest completion times.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Players Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">For Players</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Immersive Storytelling</h3>
                    <p className="text-muted-foreground">Each hunt weaves a narrative that transforms a simple bar crawl into an adventure</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Mobile-First Experience</h3>
                    <p className="text-muted-foreground">Everything you need on your phone - no apps to download, works in your browser</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Exclusive Bar Deals</h3>
                    <p className="text-muted-foreground">Unlock special offers and discounts as you progress through the hunt</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-primary-foreground">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">Ready to Play?</h3>
                <p className="mb-6 opacity-90">
                  Sign up as a player and start exploring your city's nightlife in a whole new way
                </p>
                <Link to="/auth">
                  <Button variant="secondary" size="lg" className="w-full">
                    Create Player Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Hosts Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-accent rounded-2xl p-8 md:p-12 text-accent-foreground order-2 md:order-1">
              <div className="text-center">
                <Building className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-3">Become a Host</h3>
                <p className="mb-6 opacity-90">
                  Create and monetize story-driven experiences for players in your city
                </p>
                <Link to="/auth">
                  <Button variant="secondary" size="lg" className="w-full">
                    Create Host Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">For Hosts</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy Hunt Creation</h3>
                    <p className="text-muted-foreground">Build engaging experiences with our intuitive tools - no coding required</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Revenue Opportunities</h3>
                    <p className="text-muted-foreground">Set ticket prices and earn from each player who joins your hunt</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-secondary-foreground text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Analytics & Insights</h3>
                    <p className="text-muted-foreground">Track player engagement, completion rates, and gather valuable feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <Map className="h-8 w-8 mx-auto mb-4 text-primary" />
          <p className="text-sm">
            HuntQuest - Transform your city's nightlife into an adventure
          </p>
        </div>
      </footer>
    </div>
  );
}
