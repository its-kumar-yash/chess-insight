import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle,
  ChevronRight,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 pt-12 pb-16 md:pt-24 md:pb-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container px-10 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                <Zap className="mr-1 h-4 w-4 text-primary" />
                <span>Free Chess Analysis for Everyone</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Analyze Your Chess Game{" "}
                <span className="text-primary">Without Limits</span>
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl/relaxed">
                Get professional-level analysis of your chess games without a
                premium subscription. Identify mistakes, find brilliancies, and
                improve your game.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/">
                  <Button className="w-full min-[400px]:w-auto" size="lg">
                    Analyze a Game
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    className="w-full min-[400px]:w-auto"
                    size="lg"
                    variant={"outline"}
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Unlimited Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                  <span>Advanced Insights</span>
                </div>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 lg:flex lg:justify-center relative">
              <div className="w-full max-w-[500px] aspect-square rounded-lg overflow-hidden border shadow-xl">
                <Image
                  src="/interfaceBg.png"
                  alt="Chess analysis interface"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
                <div className="absolute w-[500px] inset-0 left-0 md:left-24 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-lg rounded-lg px-6 py-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-medium">
                    JD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs font-medium">
                    TS
                  </div>
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-medium">
                    RK
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">2,500+</span> users analyzing
                  games
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                <Trophy className="mr-1 h-4 w-4 text-primary" />
                <span>Powerful Features</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Analyze your chess games in three simple steps
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-b from-background to-muted/30">
              <div className="absolute top-0 right-0 p-3 text-4xl font-bold text-primary/10">
                01
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold">Upload Your Game</h3>
                <p className="text-muted-foreground">
                  Enter PGN notation or import directly from Chess.com or
                  Lichess. You can also upload a PGN file.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-b from-background to-muted/30">
              <div className="absolute top-0 right-0 p-3 text-4xl font-bold text-primary/10">
                02
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Get Analysis</h3>
                <p className="text-muted-foreground">
                  Our engine analyzes every move to find mistakes, brilliancies,
                  and opportunities for improvement.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-b from-background to-muted/30">
              <div className="absolute top-0 right-0 p-3 text-4xl font-bold text-primary/10">
                03
              </div>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Improve Your Game</h3>
                <p className="text-muted-foreground">
                  Review analysis, save games to your profile, and track your
                  progress over time to become a better player.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Improve Your Chess?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Start analyzing your games today and take your chess skills to
                the next level
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row pt-4">
              <Link href="/analyze">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Analyze a Game
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full min-[400px]:w-auto"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
