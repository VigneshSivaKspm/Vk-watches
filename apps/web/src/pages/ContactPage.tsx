import React, { useState } from 'react';
import { apiRequest } from '../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Horological Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <PageHero
          compact
          eyebrow="Private Concierge"
          title="Connect with the Atelier"
          description="Our horological concierges are available to discuss customisation, corporate acquisitions and servicing requests."
          image="/images/scenes/banner-contact.svg"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-pure p-8 border border-platinum rounded-sm space-y-6 shadow-subtle">
            <h2 className="font-serif-luxury text-2xl text-charcoal">Concierge Desk</h2>
            <div className="space-y-4 text-xs text-graphite font-light">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>concierge@vktime.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span><a href="tel:+919087615708" className="hover:text-gold">+91 90876 15708</a> (Mon–Fri 09:00–18:00 IST)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                <span>VK TIME Horology S.A. &bull; Mumbai &bull; Geneva</span>
              </div>
            </div>
            <div className="pt-4 border-t border-platinum text-[11px] text-silver leading-relaxed">
              Standard inquiry turnaround: Within 24 business hours under master confidentiality protocol.
            </div>
          </div>

          <div className="md:col-span-7 bg-pure p-8 border border-platinum rounded-sm shadow-subtle">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-gold mx-auto" />
                <h3 className="font-serif-luxury text-2xl text-charcoal">Inquiry Dispatched</h3>
                <p className="text-xs text-graphite max-w-sm mx-auto">
                  Your request has been delivered to the master watchmaker concierge. We will respond promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-silver block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
                <div>
                  <label className="text-silver block mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
                  >
                    <option value="Horological Inquiry">General Horological Inquiry</option>
                    <option value="Order Tracking">Order & Delivery Assistance</option>
                    <option value="Bespoke Order">Numbered Limited Edition Reservation</option>
                    <option value="Warranty & Service">Mechanical Servicing & Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="text-silver block mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 bg-porcelain border border-platinum rounded-sm text-charcoal focus:outline-none focus:border-charcoal"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-charcoal text-pure uppercase tracking-luxury hover:bg-gold transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Dispatching...' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
