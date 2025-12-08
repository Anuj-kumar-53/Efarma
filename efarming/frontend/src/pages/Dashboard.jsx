// Farmer Home (formerly Dashboard)
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Sprout, CloudSun, BookOpen, Award, Sparkles, ShieldCheck, MapPin, Leaf, ArrowRight } from 'lucide-react';
import QuickActions from '../components/Dashboard/QuickActions';

const highlights = [
  { title: 'Smart Weather Insights', desc: 'Hyper-local forecasts to plan sowing and irrigation.', icon: CloudSun },
  { title: 'Crop & Soil Guidance', desc: 'AI-backed tips for seeds, soil health, and protection.', icon: Leaf },
  { title: 'Verified Schemes', desc: 'Government benefits in one place, simplified for farmers.', icon: Award },
  { title: 'Knowledge Stories', desc: 'Videos and articles from experts and progressive farmers.', icon: BookOpen },
];

const facilities = [
  { title: 'AI Agriculture Advisor', detail: 'Instant crop recommendations powered by live weather and agronomy rules.' },
  { title: 'Weather Watch', detail: 'Current conditions plus actionable alerts for the next 7 days.' },
  { title: 'Scheme Matcher', detail: 'Find schemes you’re eligible for with clear steps and links.' },
  { title: 'Knowledge Hub', detail: 'Curated guides, checklists, and demos to upskill quickly.' },
  { title: 'Community Ready', detail: 'Share learnings (coming soon) and learn from nearby farmers.' },
  { title: 'Offline Friendly', detail: 'Lightweight UI that stays usable on slow connections.' },
];

const tips = [
  'Check Weather before spraying or irrigation to avoid wastage.',
  'Use AI Advisor after setting your exact location for precise crops.',
  'Bookmark schemes you qualify for and set reminders before deadlines.',
  'Save favourite guides in Knowledge Hub for quick offline reference.',
  'Revisit dashboards weekly to spot new tips and seasonal alerts.',
];

const heroImages = [
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=60',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60',
];

const Dashboard = () => {
  const { user, userType } = useAuth();

  // Redirect admins to their dedicated dashboard
  if (userType === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="animate-fade-in space-y-12">
      {/* Hero / Introduction */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-500 via-primary-600 to-emerald-500 text-white p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#fff_0,_transparent_45%)]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-sm">
              <Sparkles className="h-4 w-4" />
              Fresh for you, {user?.name || 'farmer'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome to your eFarmer Home
            </h1>
            <p className="text-white/80 text-lg">
              One place for live weather, crop-ready advice, government schemes, and practical
              know-how. Built to save your time and boost your harvests.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/agriculture"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-primary-700 font-semibold shadow-lg hover:-translate-y-0.5 transition"
              >
                Open AI Agriculture Advisor
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/schemes"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/60 text-white hover:bg-white/10 transition"
              >
                Explore Schemes
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {heroImages.map((src, idx) => (
              <div
                key={src}
                className={`rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-1 transition duration-300 ${
                  idx === 1 ? 'translate-y-6' : ''
                }`}
              >
                <img src={src} alt="Farming" className="h-36 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-primary-600 font-semibold">What you get</p>
            <h2 className="text-3xl font-bold text-gray-900">Facilities at a glance</h2>
            <p className="text-gray-600 mt-1">Everything is ready to support your next season.</p>
          </div>
          <QuickActions isAdmin={false} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="card h-full border border-gray-100 hover:border-primary-100 transition hover:-translate-y-1"
              >
                <div className="p-5 space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 flex items-center justify-center text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facilities grid */}
      <section className="space-y-4">
        <div>
          <p className="text-primary-600 font-semibold">Built for farmers</p>
          <h2 className="text-3xl font-bold text-gray-900">What’s inside your Home</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facilities.map((facility, idx) => (
            <div
              key={facility.title}
              className="card border border-gray-100 hover:border-emerald-200 transition hover:-translate-y-1"
            >
              <div className="p-5 space-y-2">
                <div className="text-sm text-primary-600 font-semibold">0{idx + 1}</div>
                <h3 className="text-xl font-semibold text-gray-900">{facility.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{facility.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits with imagery */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-primary-600 font-semibold">Why it matters</p>
          <h2 className="text-3xl font-bold text-gray-900">Benefits you feel in the field</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-1" />
              Weather-aware advice reduces input waste and protects yield.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-1" />
              Transparent scheme info saves hours of paperwork chasing.
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-1" />
              Short videos and guides help you try new practices faster.
            </li>
          </ul>
          <div className="flex gap-3">
            <Link
              to="/knowledge"
              className="btn-primary px-5 py-3 flex items-center gap-2"
            >
              Open Knowledge Hub <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/weather"
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-800 hover:border-primary-200 hover:text-primary-700 transition"
            >
              Check Weather
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=60"
            alt="Farmer in field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 bg-white/85 backdrop-blur rounded-2xl px-4 py-3 shadow-lg">
            <p className="text-sm text-gray-600">eFarmer helps you decide:</p>
            <p className="font-semibold text-gray-900">When to water, what to sow, how to benefit.</p>
          </div>
        </div>
      </section>

      {/* Tips & Tricks */}
      <section className="space-y-4">
        <p className="text-primary-600 font-semibold">Tips & Tricks</p>
        <h2 className="text-3xl font-bold text-gray-900">Make the most of eFarmer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div
              key={tip}
              className="card border border-gray-100 hover:border-primary-200 transition flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-semibold">
                {idx + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Location CTA */}
      <section className="bg-gradient-to-r from-emerald-50 to-primary-50 border border-primary-100 rounded-3xl p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white shadow-md">
              <MapPin className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Set your farm location</h3>
              <p className="text-gray-600">Get precise weather and crop picks tailored to your village.</p>
            </div>
          </div>
          <Link
            to="/agriculture"
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            Update location <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;