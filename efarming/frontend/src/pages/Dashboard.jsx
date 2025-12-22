// Farmer Home - Premium Animated Dashboard
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  CloudSun, BookOpen, Award, Sparkles, ShieldCheck, MapPin, 
  ArrowRight, Brain, Droplets, Zap, BarChart, TrendingUp,
  Clock, Users, Heart, Leaf, Sprout, Tractor
} from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const Dashboard = () => {
  const { user, userType } = useAuth();
  const container = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
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
  }, { scope: container });
  
  // Redirect admins to their dedicated dashboard
  if (userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  // Features with enhanced content
  const features = [
    {
      title: "AI Agriculture Advisor",
      desc: "Get intelligent crop recommendations based on soil analysis, weather patterns, and real-time market trends",
      icon: Brain,
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      stat: "95% Accuracy",
      link: '/agriculture',
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Smart Weather Insights",
      desc: "Hyper-local 7-day forecasts with actionable farming alerts and precision rainfall predictions",
      icon: CloudSun,
      gradient: "from-blue-500 via-cyan-500 to-teal-400",
      stat: "Live Updates",
      link: "/weather",
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Government Schemes",
      desc: "Personalized scheme matching with automated application tracking and benefit calculators",
      icon: Award,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      stat: "₹50K+ Benefits",
      link: "/schemes",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Knowledge Hub",
      desc: "Expert videos, articles, and interactive learning modules from agricultural specialists",
      icon: BookOpen,
      gradient: "from-emerald-500 via-green-500 to-teal-400",
      stat: "500+ Resources",
      link: "/knowledge",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    },
  ]

  // Stats section
  const stats = [
    { label: "Active Farmers", value: "10K+", icon: Users, color: "emerald" },
    { label: "Schemes Accessed", value: "₹2Cr+", icon: Award, color: "amber" },
    { label: "AI Consultations", value: "50K+", icon: Brain, color: "purple" },
    { label: "Success Rate", value: "94%", icon: TrendingUp, color: "blue" },
  ]

  // Enhanced quick tips
  const quickTips = [
    {
      icon: Droplets,
      text: "Optimal irrigation timing: Water crops before 10 AM for maximum absorption",
      category: "Water Management",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShieldCheck,
      text: "PM-KISAN scheme deadline approaching - Complete verification within 3 days",
      category: "Government Schemes",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      text: "High pest alert: Bollworm activity detected in your region - Apply preventive measures",
      category: "Pest Control",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      text: "Market opportunity: Tomato prices up 40% this week - Consider early harvest",
      category: "Market Insights",
      color: "from-emerald-500 to-green-500",
    },
  ]

  // Success stories
  const benefits = [
    {
      title: "Higher Crop Yield",
      benefit: "Farmers increased crop productivity by up to 60% using AI-based crop recommendations and soil insights.",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
      
    tag: "AI Advisory",
  },
  {
    title: "Water & Cost Savings",
    benefit: "Smart irrigation and weather-based alerts helped reduce water usage and farming costs by 40%.",
    image: "https://organicagcentre.ca/wp-content/uploads/2025/03/smart-water-recovery-agriculture.jpeg",
    
    tag: "Smart Irrigation",
  },
  {
    title: "Easy Government Benefits",
    benefit: "Farmers accessed subsidies, insurance, and schemes worth lakhs without paperwork confusion.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeaKjz8dE51sC8SKe4tVleHrW-m91Hi1N1MA&s",
    tag: "Govt Schemes",
  },
];


  return (
    <div ref={container} className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 space-y-24 pb-32">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div
                className={`space-y-8 hero-content ${mounted ? "animate-in fade-in slide-in-from-left-8 duration-1000" : "opacity-0"}`}
              >
                {/* Welcome Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/90 backdrop-blur-md border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-bold text-emerald-800">
                    Welcome back, {user?.name || 'Farmer'}! 🌱
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Transform Your
                  </span>
                  <span
                    className="block text-gray-900 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: "100ms" }}
                  >
                    Farming Journey
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Empowering <span className="font-bold text-emerald-700">rural India</span> with AI-powered
                  agriculture, real-time insights, and government schemes—all in your language.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    to="/agriculture"
                    className="group relative overflow-hidden px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <span className="relative flex items-center gap-3 justify-center">
                      <Brain className="h-6 w-6 animate-pulse" />
                      Start AI Consultation
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </Link>

                  <Link
                    to="/schemes"
                    className="group px-10 py-5 rounded-2xl border-2 border-emerald-300 bg-white/90 backdrop-blur-sm text-emerald-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-white transition-all duration-300 hover:border-emerald-400 text-center"
                  >
                    <span className="flex items-center gap-3 justify-center">
                      <Award className="h-6 w-6" />
                      Find Your Benefits
                      <TrendingUp className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </span>
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="flex gap-6 flex-wrap pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Government Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">10,000+ Farmers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">100% Free</span>
                  </div>
                </div>
              </div>

              {/* Right Image with Floating Cards */}
               <div
                className={`hidden lg:block relative ${mounted ? "animate-in fade-in slide-in-from-right-8 duration-1000" : "opacity-0"}`}
              >
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl hero-image ">
                    <img
                      src="https://thumbs.dreamstime.com/b/demonstration-modern-agricultural-efficiency-innovation-indian-farmer-employs-drone-to-distribute-fertilizer-355595431.jpg"
                      alt="Modern Farming in India"
                      className="w-full h-[700px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 via-transparent to-teal-900/20" />
                  </div>

                  {/* Floating Stat Cards */}
                  <div
                    className="absolute -left-6 top-20 bg-white rounded-2xl shadow-2xl p-6 w-48 animate-in fade-in slide-in-from-left-4 duration-1000 hover:scale-105 transition-transform"
                    style={{ animationDelay: "400ms" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-gray-900">94%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute -right-6 bottom-32 bg-white rounded-2xl shadow-2xl p-6 w-52 animate-in fade-in slide-in-from-right-4 duration-1000 hover:scale-105 transition-transform"
                    style={{ animationDelay: "600ms" }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Droplets className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-gray-900">40%</div>
                        <div className="text-xs text-gray-600">Water Savings</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-20 blur-3xl animate-pulse" />
                  <div
                    className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="animate-section container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              const colorClasses = {
                emerald: "border-emerald-100 hover:border-emerald-300 from-emerald-500 to-emerald-600 from-emerald-50",
                amber: "border-amber-100 hover:border-amber-300 from-amber-500 to-amber-600 from-amber-50",
                purple: "border-purple-100 hover:border-purple-300 from-purple-500 to-purple-600 from-purple-50",
                blue: "border-blue-100 hover:border-blue-300 from-blue-500 to-blue-600 from-blue-50"
              };
              
              return (
                <div
                  key={idx}
                  className={`relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 ${colorClasses[stat.color]} hover:-translate-y-2 ${mounted ? "animate-in fade-in zoom-in-95 duration-700" : "opacity-0"}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[stat.color].split(' ')[0]} ${colorClasses[stat.color].split(' ')[1]} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClasses[stat.color].split(' ')[4]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm mb-4">
              <Leaf className="h-4 w-4" />
              Complete Farming Ecosystem
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Digital Agriculture
              </span>{" "}
              Partner
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need for modern, profitable, and sustainable farming in one powerful platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Link
                  key={idx}
                  to={feature.link}
                  className={`group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-300 ${mounted ? "animate-in fade-in slide-in-from-bottom-8 duration-700" : "opacity-0"}`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Feature Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}
                    />

                    {/* Icon Badge */}
                    <div className="absolute top-6 left-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-white shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        <Icon
                          className={`h-8 w-8 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}
                        />
                      </div>
                    </div>

                    {/* Stat Badge */}
                    <div className="absolute top-6 right-6">
                      <span className="px-4 py-2 rounded-xl bg-white shadow-lg text-sm font-black text-gray-900">
                        {feature.stat}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">{feature.desc}</p>

                    <div className="flex items-center text-emerald-600 font-bold text-lg">
                      <span>Explore Now</span>
                      <ArrowRight className="h-5 w-5 ml-2 transform group-hover:translate-x-3 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  />
                </Link>
              )
            })}
          </div>
        </section>

        {/* Quick Tips */}
        <section className="animate-section container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80" 
                alt="Farm tips background" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-emerald-900/90 to-gray-800/95" />
            </div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl">
                  <Zap className="h-8 w-8 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white">Today's Farming Insights</h2>
                  <p className="text-emerald-200 text-lg">Actionable tips for your success</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickTips.map((tip, idx) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={idx}
                      className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/20 hover:border-emerald-400 hover:bg-white/20 transition-all duration-500 hover:scale-105"
                    >
                      <div className="flex items-start gap-5">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-emerald-300 mb-2">{tip.category}</div>
                          <p className="text-white font-medium leading-relaxed mb-3">{tip.text}</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-400" />
                            <span className="text-emerald-300 text-sm font-semibold">Updated 5 mins ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
         <section className="container mx-auto px-6">
  <div className="text-center mb-16 space-y-4">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-bold text-sm mb-4">
      <Sparkles className="h-4 w-4" />
      How eFarmer Helps Farmers
    </div>

    <h2 className="text-4xl md:text-5xl font-black text-gray-900">
      Real{" "}
      <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
        Impact & Benefits
      </span>
    </h2>

    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      See how eFarmer is empowering farmers with technology, savings, and smarter decisions
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {benefits.map((item, idx) => (
      <div
        key={idx}
        className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-200 hover:border-emerald-300 ${
          mounted ? "animate-in fade-in zoom-in-95 duration-700" : "opacity-0"
        }`}
        style={{ animationDelay: `${idx * 200}ms` }}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

          {/* Benefit Tag */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg">
              <Sparkles className="h-4 w-4" />
              {item.tag}
            </div>
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-black text-white">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed text-lg font-medium">
            {item.benefit}
          </p>
        </div>

        {/* Decorative Element */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500" />
      </div>
    ))}
  </div>
</section>


        {/* Location CTA */}
        <section className="animate-section container mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" 
                alt="Farm landscape" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-green-900/85 to-teal-900/90" />
            </div>

            <div className="relative z-10 p-10 md:p-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-sm mb-6">
                  <Tractor className="h-4 w-4 animate-pulse" />
                  Precision Agriculture Technology
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Your Farm Deserves
                  <span className="block text-emerald-300">Precision Intelligence</span>
                </h2>

                <p className="text-white/90 text-xl mb-8 leading-relaxed">
                  Get hyper-accurate weather forecasts, soil analysis, and crop recommendations tailored to your exact
                  farm coordinates—in your local language.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/agriculture"
                    className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white text-emerald-700 font-black text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <MapPin className="h-6 w-6" />
                    Set Farm Location
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>

                  <Link
                    to="/weather"
                    className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-emerald-700 transition-all duration-300"
                  >
                    <CloudSun className="h-6 w-6" />
                    Check Weather
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="animate-section container mx-auto px-6">
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <Sparkles className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Join 10,000+ Farmers Growing Smarter</h2>
              <p className="text-xl text-white/90 mb-10">
                Start your digital farming journey today—completely free, in your language
              </p>

              <Link
                to="/weather"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-emerald-700 font-black text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105"
              >
                <Brain className="h-6 w-6" />
                Explore Now
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;