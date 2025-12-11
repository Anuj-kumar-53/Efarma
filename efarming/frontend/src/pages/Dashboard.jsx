// Farmer Home - Premium Animated Dashboard
import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  CloudSun, BookOpen, Award, Sparkles, ShieldCheck, MapPin, 
  ArrowRight, Brain, Droplets, Zap, BarChart, TrendingUp,
  Clock
} from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const Dashboard = () => {
  const { user, userType } = useAuth();
  const container = useRef();
  
  // Use GSAP hook BEFORE any conditional returns
  useGSAP(() => {
    // Hero section animations
    gsap.from('.hero-content > *', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Hero image animation
    gsap.from('.hero-image', {
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Scroll animations for sections
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.1
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: container }); // Added scope option

  // Redirect admins to their dedicated dashboard
  if (userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Features
  const features = [
    {
      title: 'AI Agriculture Advisor',
      desc: 'Get intelligent crop recommendations based on soil, weather, and market trends',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      stat: '95% Accuracy',
      link: '/agriculture'
    },
    {
      title: 'Smart Weather Insights',
      desc: 'Hyper-local 7-day forecasts with actionable farming alerts',
      icon: CloudSun,
      gradient: 'from-blue-500 to-cyan-400',
      stat: 'Live Updates',
      link: '/weather'
    },
    {
      title: 'Government Schemes',
      desc: 'Personalized scheme matching with automated application tracking',
      icon: Award,
      gradient: 'from-amber-500 to-orange-500',
      stat: '₹50K+ Benefits',
      link: '/schemes'
    },
    {
      title: 'Knowledge Hub',
      desc: 'Expert videos, articles, and interactive learning modules',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-green-400',
      stat: '500+ Resources',
      link: '/knowledge'
    }
  ];

  // Quick tips
  const quickTips = [
    { icon: Droplets, text: 'Water crops before 10 AM for optimal absorption' },
    { icon: ShieldCheck, text: 'Check scheme deadlines - 3 days remaining' },
    { icon: Zap, text: 'High pest alert in your region - take preventive measures' },
    { icon: BarChart, text: 'Market prices trending up for tomatoes' }
  ];

  return (
    <div ref={container} className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-primary-50 to-teal-50">
      <div className="relative z-10 space-y-16 pb-32">
        {/* Hero Section - Left Content, Right Image */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="hero-content">
                {/* Welcome Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-200 mb-8 shadow-lg">
                  <Sparkles className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">
                    Welcome back, {user?.name || 'Farmer'}! 🌱
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="block bg-gradient-to-r from-primary-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Smart Farming
                  </span>
                  <span className="block text-gray-900 mt-2">
                    Meets Digital Intelligence
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Your all-in-one platform for AI-powered agriculture, real-time weather insights, 
                  government schemes, and expert knowledge—designed to maximize your harvest.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link
                    to="/agriculture"
                    className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="relative flex items-center gap-3 justify-center">
                      <Brain className="h-5 w-5" />
                      Launch AI Advisor
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>

                  <Link
                    to="/schemes"
                    className="group px-8 py-4 rounded-2xl border-2 border-primary-200 bg-white/80 backdrop-blur-sm text-primary-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300 hover:bg-white text-center"
                  >
                    <span className="flex items-center gap-3 justify-center">
                      <Award className="h-5 w-5" />
                      Explore Schemes
                      <TrendingUp className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                </div>

                {/* Feature Icons */}
                <div className="flex gap-6 flex-wrap">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{feature.stat}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Image */}
              <div className="hero-image hidden lg:block">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                    alt="Smart Farming"
                    className="rounded-3xl shadow-2xl w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent rounded-3xl" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-400 rounded-full opacity-20 blur-3xl" />
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-400 rounded-full opacity-20 blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="animate-section container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">
                Digital Farming Toolkit
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for modern, profitable farming in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={idx}
                  to={feature.link}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      {feature.stat}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{feature.desc}</p>
                  
                  <div className="flex items-center text-primary-600 font-semibold text-sm">
                    <span>Explore Now</span>
                    <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="animate-section container mx-auto px-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-7 w-7 text-emerald-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">Quick Farming Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-emerald-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{tip.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-300 text-xs">Just updated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Location CTA */}
        <section className="animate-section container mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Farm landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/60" />
            </div>
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Precision Farming Starts With Your Location
                </h2>
                <p className="text-white/90 text-lg mb-6">
                  Get hyper-accurate weather forecasts and crop recommendations tailored to your exact farm location
                </p>
                
                <Link
                  to="/agriculture"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <MapPin className="h-5 w-5" />
                  Update Farm Location
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;