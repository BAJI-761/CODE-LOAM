import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code2, Users, Zap, Globe, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About CodeLoom | Our Mission',
  description: 'Learn about CodeLoom, the AI-powered learning platform designed to help you master programming.',
};

export default function AboutPage() {
  const values = [
    {
      icon: <Code2 className="w-6 h-6 text-accent" />,
      title: 'Interactive Learning',
      description: 'We believe in learning by doing. Our platform offers hands-on coding challenges right in your browser.',
    },
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: 'AI-Powered Assistance',
      description: 'Stuck on a problem? Our advanced AI assistant is available 24/7 to provide hints, explanations, and guidance.',
    },
    {
      icon: <Users className="w-6 h-6 text-accent" />,
      title: 'Community Driven',
      description: 'Join a vibrant community of learners and educators. Collaborate, share knowledge, and grow together.',
    },
    {
      icon: <Globe className="w-6 h-6 text-accent" />,
      title: 'Accessible Everywhere',
      description: 'Learn from anywhere, at any time. CodeLoom is designed to be fully responsive and accessible on all devices.',
    },
  ];

  const team = [
    {
      name: 'Sarah Connor',
      role: 'Founder & CEO',
      image: '/images/default-avatar.png',
    },
    {
      name: 'John Doe',
      role: 'Lead AI Engineer',
      image: '/images/default-avatar.png',
    },
    {
      name: 'Jane Smith',
      role: 'Head of Curriculum',
      image: '/images/default-avatar.png',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accent-secondary/10 -z-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-accent/5 to-transparent -z-10 blur-3xl" />
        
        <Container>
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground">
              Empowering the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-secondary">Developers</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              CodeLoom is an AI-powered learning platform that makes mastering programming engaging, interactive, and accessible to everyone. We combine intelligent tutoring with hands-on practice.
            </p>
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-display">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We started CodeLoom with a simple idea: learning to code shouldn't be a solitary, frustrating experience. Traditional education often leaves students stuck on syntax errors for hours without help.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                By integrating state-of-the-art AI directly into the coding environment, we provide instant, personalized feedback. Our mission is to democratize technical education and help anyone, anywhere, turn their ideas into reality through code.
              </p>
              <Button size="lg" className="mt-4">Join Our Journey</Button>
            </div>
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-extruded border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent-secondary/20 z-10 mix-blend-overlay"></div>
                {/* Fallback pattern if image is missing */}
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Code2 className="w-32 h-32 text-muted-foreground/20" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent-secondary/20 rounded-full blur-2xl -z-10"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-muted/30">
        <Container>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The principles that guide how we build CodeLoom and support our community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} variant="extruded" className="p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-background shadow-inset-sm flex items-center justify-center shrink-0">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <Container>
          <Card variant="extruded" className="p-12 md:p-16 text-center bg-gradient-to-br from-background to-muted/30 border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent-secondary/5 blur-3xl -z-10"></div>
            
            <div className="max-w-2xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Ready to Start Learning?</h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students mastering programming with CodeLoom. Create your free account today and start coding.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg">Get Started for Free</Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg">Explore Courses</Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </main>
  );
}
