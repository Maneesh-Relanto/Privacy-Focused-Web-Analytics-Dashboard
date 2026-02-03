import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Zap,
  BarChart3,
  Database,
  Code2,
  ArrowRight,
  Github,
} from "lucide-react";
import { AnimatedDashboardPreview } from "@/components/hero/AnimatedDashboardPreview";
import { AnimatedChartVisualization } from "@/components/hero/AnimatedChartVisualization";
import { FloatingMetricCards } from "@/components/hero/FloatingMetricCards";
import { InteractiveAnalyticsVisual } from "@/components/hero/InteractiveAnalyticsVisual";

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">
              PrivacyMetrics
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Privacy-focused analytics
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {" "}
                dashboard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A self-hosted analytics dashboard designed with privacy in mind.
              View metrics, dive into data, and stay in control of your
              analytics infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  View Demo Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </a>
            </div>
          </div>
          <div className="w-full">
            <AnimatedDashboardPreview />
          </div>
        </div>
      </section>

      {/* Visualization Section 1: Animated Dashboard Preview */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Dashboard Preview
            </h2>
            <p className="text-lg text-muted-foreground">
              See your analytics metrics in real-time with an intuitive, clean
              interface
            </p>
          </div>
          <AnimatedDashboardPreview />
        </div>
      </section>

      {/* Visualization Section 2: Animated Chart */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Visual Analytics
            </h2>
            <p className="text-lg text-muted-foreground">
              Track trends and patterns with interactive, animated charts
            </p>
          </div>
          <AnimatedChartVisualization />
        </div>
      </section>

      {/* Visualization Section 3: Floating Metric Cards */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Key Metrics at a Glance
            </h2>
            <p className="text-lg text-muted-foreground">
              Floating cards showcase your most important analytics data
            </p>
          </div>
          <FloatingMetricCards />
        </div>
      </section>

      {/* Visualization Section 4: Interactive Analytics */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Multi-View Analytics
            </h2>
            <p className="text-lg text-muted-foreground">
              Combine multiple chart types to understand your data
              comprehensively
            </p>
          </div>
          <InteractiveAnalyticsVisual />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Built for developers and privacy
            </h2>
            <p className="text-xl text-muted-foreground">
              Modern dashboard with secure authentication, clean design, and
              full source code transparency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Self-Hosted",
                description:
                  "Deploy on your own infrastructure. Complete control over your data.",
              },
              {
                icon: BarChart3,
                title: "Clean Dashboard",
                description:
                  "Beautiful, responsive interface for viewing analytics metrics.",
              },
              {
                icon: Code2,
                title: "Developer Friendly",
                description:
                  "Built with TypeScript and modern web technologies. Easy to customize.",
              },
              {
                icon: Database,
                title: "SQLite Database",
                description:
                  "Simple setup with SQLite. Ready for PostgreSQL/MySQL later.",
              },
              {
                icon: Shield,
                title: "Secure Auth",
                description:
                  "User authentication with JWT tokens and password hashing.",
              },
              {
                icon: Zap,
                title: "Open Source",
                description:
                  "MIT licensed. Full transparency and community-driven development.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-lg p-6 hover:border-primary transition"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Explore our demo dashboard to see how PrivacyMetrics works
          </p>
          <Link to="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary-foreground"
            >
              Launch Demo Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PrivacyMetrics. Open source under MIT license.</p>
        </div>
      </footer>
    </div>
  );
}
