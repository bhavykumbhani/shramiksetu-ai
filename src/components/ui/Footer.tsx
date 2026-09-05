import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B3D91] text-white pt-12 pb-6 border-t-4 border-[#FF9933] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & About */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 text-white hover:text-blue-200 transition">
              <ShieldCheck className="text-[#138808]" size={32} />
              <span className="font-extrabold text-xl tracking-tight">ShramikSetu AI</span>
            </Link>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Empowering India's informal workforce through AI-driven skill mapping, welfare access, and secure job placement.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FF9933]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/worker/dashboard" className="hover:text-white transition">Worker Portal</Link></li>
              <li><Link href="/contractor/dashboard" className="hover:text-white transition">Contractor Portal</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-white transition">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FF9933]">Services</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><Link href="/worker/welfare" className="hover:text-white transition">Welfare Schemes</Link></li>
              <li><Link href="/worker/grievance" className="hover:text-white transition">e-Nyay Grievance</Link></li>
              <li><Link href="/worker/wage-check" className="hover:text-white transition">Minimum Wage Check</Link></li>
              <li><Link href="/worker/passport" className="hover:text-white transition">Digital Passport</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#FF9933]">Contact Us</h4>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-start gap-2">
                <PhoneCall size={16} className="mt-0.5 shrink-0 text-[#138808]" />
                <div>
                  <p>Toll-Free Helpline</p>
                  <a href="tel:155372" className="font-bold text-white hover:underline">155372</a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#138808]" />
                <a href="mailto:support@shramiksetu.gov.in" className="hover:text-white transition">support@shramiksetu.gov.in</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#138808]" />
                <p>Labor Department, Block 5, Gandhinagar, Gujarat</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-blue-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-200">
          <p>© {new Date().getFullYear()} ShramikSetu AI Initiative. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
