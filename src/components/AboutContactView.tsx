import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Award,
  Sparkles,
  Heart,
  ChefHat
} from 'lucide-react';
import { FoodImage } from './FoodImage';

interface AboutContactViewProps {
  mode: 'about' | 'contact';
  onNavigate: (view: string) => void;
}

export const AboutContactView: React.FC<AboutContactViewProps> = ({ mode, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. ABOUT SECTION */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Our Culinary Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif-luxury text-stone-100">
            The Zestora Story
          </h1>
          <p className="text-sm text-stone-400 leading-relaxed">
            Founded with a passion for slow-cooked culinary traditions and contemporary gastronomy, Zestora brings together the finest spices, royal recipes, and warm hospitality.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] bg-stone-900">
            <FoodImage
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
              alt="Zestora Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 text-stone-100">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Authentic Craftsmanship
              </span>
              <h3 className="text-xl font-bold font-serif-luxury">
                Every Dish Tells a Story
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/100/10 text-amber-600 flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
                Master Chefs with Decades of Expertise
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Our kitchen brigade is led by culinary artisans who have mastered the art of Dum cooking, charcoal tandoor grilling, and stone-fired Italian dough fermentations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/100/10 text-amber-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
                Pure, Farm-Direct Ingredients
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                We grind whole spices fresh every morning, source dairy directly from organic farms, and use cold-pressed oils. No artificial colorings or shortcuts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-stone-900/40 backdrop-blur-md border border-white/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/100/10 text-amber-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif-luxury text-stone-100">
                Royal Hospitality for Every Diner
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Whether you reserve our private candlelight booths or order delivery directly to your home, our dedication to pristine taste and service never wavers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT US SECTION */}
      <section className="pt-8 border-t border-white/10 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            Connect With Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-luxury text-stone-100">
            Get in Touch with Zestora
          </h2>
          <p className="text-xs text-stone-400">
            Have questions regarding table bookings, private party catering, or feedback? Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-stone-900 text-stone-100 p-8 rounded-3xl border border-stone-800 shadow-xl space-y-6">
            <h3 className="text-xl font-bold font-serif-luxury text-amber-400">
              Restaurant Information
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-100 block text-sm">Our Address</span>
                  <span className="text-stone-300">
                    #42, 100ft Road, Opposite Metro Pillar 84, Indiranagar, Bengaluru – 560038
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-100 block text-sm">Direct Phone</span>
                  <span className="text-stone-300">+91 98765 43210 / +91 80 4123 9999</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-100 block text-sm">Email Inquiries</span>
                  <span className="text-stone-300">contact@zestorarestaurant.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-100 block text-sm">Dining Hours</span>
                  <span className="text-stone-300">
                    Mon - Sun: 11:00 AM – 11:30 PM (Kitchen closes 11:00 PM)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
              <button
                onClick={() => onNavigate('reservation')}
                className="w-full py-3 rounded-2xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md"
              >
                Reserve a Table Right Now
              </button>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-stone-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10/80 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-stone-100">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you for reaching out. Our guest relations team will review your inquiry and get back to you within 2-4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ananya Sharma"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@example.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-400 mb-1">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Table Reservation">Table Reservation</option>
                      <option value="Private Event / Catering">Private Event / Catering</option>
                      <option value="Chef Feedback">Chef Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you'd like to ask or request..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-white/10 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500/100 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
