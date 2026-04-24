"use client";

import React, { useState, useRef } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function OnboardingFlow() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: any = {};
    
    // Extract basic fields
    formData.forEach((value, key) => {
      if (key === 'features' || key === 'assets') {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setError(err.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="h-20 w-20 bg-[#00b894] rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="text-white h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Submission Received!</h2>
          <p className="text-gray-600">
            Thank you for your onboarding details. Our team at GrowX Labs will review your information and get back to you within 24 hours via WhatsApp or Email.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-[#00b894] text-white rounded-lg font-bold hover:opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container">
      <style jsx>{`
        .onboarding-container {
          background: #f9fafb;
          min-height: 100vh;
          padding: 40px 20px;
          color: #222;
          font-family: 'Inter', Arial, sans-serif;
        }
        .paper {
          background: #fff;
          max-width: 900px;
          margin: auto;
          padding: 60px;
          box-shadow: 0 10px 50px rgba(0,0,0,0.05);
          border-radius: 8px;
          position: relative;
        }
        .header { text-align: center; border-bottom: 4px solid #00b894; padding-bottom: 24px; margin-bottom: 30px; }
        .header h1 { font-size: 32px; color: #00b894; letter-spacing: 0.2em; font-weight: 900; text-transform: uppercase; }
        .header p { font-size: 10px; color: #888; margin-top: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .doc-title { text-align: center; font-size: 18px; font-weight: 800; margin-bottom: 6px; color: #111; }
        .doc-sub { text-align: center; font-size: 12px; color: #888; margin-bottom: 30px; }
        
        h2 { 
          font-size: 13px; color: #fff; background: #00b894; padding: 10px 16px; margin: 32px 0 16px; 
          border-radius: 4px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800;
        }
        
        .field-row { display: flex; gap: 24px; margin-bottom: 18px; }
        .field { flex: 1; display: flex; flex-col; gap: 4px; }
        .field label { font-size: 11px; color: #555; display: block; margin-bottom: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        
        input[type="text"], input[type="email"], input[type="tel"], textarea, select {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: inherit;
          background: #fafafa;
          transition: all 0.2s;
          color: #222;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #00b894;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
        }
        
        textarea { resize: vertical; min-height: 80px; }
        
        .checkbox-group { display: flex; flex-wrap: wrap; gap: 10px; margin: 8px 0; }
        .checkbox-item { 
          display: flex; align-items: center; gap: 8px; font-size: 12px; 
          background: #f3f4f6; padding: 8px 14px; border-radius: 8px; 
          border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;
          font-weight: 500;
        }
        .checkbox-item:hover { background: #e5e7eb; }
        .checkbox-item input { margin: 0; accent-color: #00b894; }
        
        table { width: 100%; border-collapse: collapse; margin: 15px 0; border-radius: 8px; overflow: hidden; }
        th { background: #f0faf8; color: #00b894; padding: 12px; text-align: left; font-size: 11px; border: 1px solid #e0f2f1; text-transform: uppercase; font-weight: 800; }
        td { padding: 12px; border: 1px solid #eee; font-size: 12px; color: #444; }
        
        .submit-btn {
          width: 100%;
          background: #00b894;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          margin-top: 40px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .submit-btn:hover { background: #00a383; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0, 184, 148, 0.2); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        
        .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #aaa; border-top: 1px solid #eee; padding-top: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        
        @media print {
          .onboarding-container { background: white; padding: 0; }
          .paper { box-shadow: none; padding: 0; margin: 0; max-width: 100%; }
          .submit-btn { display: none; }
          input, textarea, select { border: 1px solid transparent !important; background: transparent !important; padding-left: 0 !important; }
          .checkbox-item { background: transparent !important; border: none !important; padding-left: 0 !important; }
          input[type="radio"], input[type="checkbox"] { print-color-adjust: exact; }
          h2 { background: #f5f5f5 !important; color: #222 !important; border: 1px solid #eee; }
        }
      `}</style>

      <form ref={formRef} onSubmit={handleSubmit} className="paper">
        <div className="header">
          <h1>✕ GROWX LABS</h1>
          <p>AI-Native Digital Agency | growxlabs.tech | hello@growxlabs.tech</p>
        </div>

        <div className="doc-title">CLIENT ONBOARDING FORM</div>
        <div className="doc-sub">Help us understand your business so we can build something amazing for you.</div>

        {/* SECTION 1 */}
        <h2>Section 1: Business Information</h2>
        <div className="field-row">
          <div className="field">
            <label>Full Name *</label>
            <input type="text" name="full_name" placeholder="Enter your full name" required />
          </div>
          <div className="field">
            <label>Business / Brand Name *</label>
            <input type="text" name="business_name" placeholder="Your business legal or brand name" required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Email Address *</label>
            <input type="email" name="email" placeholder="example@email.com" required />
          </div>
          <div className="field">
            <label>WhatsApp Number *</label>
            <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Business Type</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="business_type" value="E-Commerce" /> E-Commerce</label>
              <label className="checkbox-item"><input type="radio" name="business_type" value="Service Business" /> Service Business</label>
              <label className="checkbox-item"><input type="radio" name="business_type" value="SaaS / App" /> SaaS / App</label>
              <label className="checkbox-item"><input type="radio" name="business_type" value="Personal Brand" /> Personal Brand</label>
              <label className="checkbox-item"><input type="radio" name="business_type" value="Local Shop" /> Local Shop</label>
              <label className="checkbox-item"><input type="radio" name="business_type" value="Other" /> Other</label>
            </div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Business Description (What do you sell/offer?)</label>
            <textarea name="description" placeholder="Briefly describe your products or services..."></textarea>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Target Audience (Who are your customers?)</label>
            <input type="text" name="target_audience" placeholder="e.g. Small business owners, Teens, Tech professionals" />
          </div>
          <div className="field">
            <label>Location / City of Business</label>
            <input type="text" name="city" placeholder="Guntur, AP, etc." />
          </div>
        </div>

        {/* SECTION 2 */}
        <h2>Section 2: Project Requirements</h2>
        <div className="field-row">
          <div className="field">
            <label>Selected Plan</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="plan" value="Starter" /> Starter (₹10,000)</label>
              <label className="checkbox-item"><input type="radio" name="plan" value="Growth" /> Growth (₹20,000)</label>
              <label className="checkbox-item"><input type="radio" name="plan" value="Enterprise Next.js" /> Enterprise Next.js (₹40,000+)</label>
              <label className="checkbox-item"><input type="radio" name="plan" value="Enterprise Microservices" /> Enterprise Microservices (₹1L+)</label>
              <label className="checkbox-item"><input type="radio" name="plan" value="Custom Quote" /> Custom Quote</label>
            </div>
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Do you have an existing website?</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="has_website" value="Yes" /> Yes – Redesign it</label>
              <label className="checkbox-item"><input type="radio" name="has_website" value="No" /> No – Build from scratch</label>
            </div>
          </div>
          <div className="field">
            <label>Existing Website URL (if any)</label>
            <input type="text" name="website_url" placeholder="https://..." />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Features Needed</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="checkbox" name="features" value="Contact Form" /> Contact Form</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="WhatsApp Button" /> WhatsApp Button</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Product Catalog" /> Product Catalog</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Online Payments" /> Online Payments</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Blog / News" /> Blog / News</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Booking System" /> Booking System</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Admin Dashboard" /> Admin Dashboard</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="AI Chatbot" /> AI Chatbot</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="Multi-language" /> Multi-language</label>
              <label className="checkbox-item"><input type="checkbox" name="features" value="User Accounts" /> User Accounts</label>
            </div>
          </div>
        </div>

        {/* SECTION 3: ASSETS */}
        <h2>Section 3: Content & Assets</h2>
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>I Will Provide</th>
              <th>Need Help</th>
              <th>Not Needed</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Logo / Brand Identity",
              "Product / Service Photos",
              "Website Text / Copy",
              "Banner / Hero Images",
              "Social Media Links",
              "Video Content"
            ].map(asset => (
              <tr key={asset}>
                <td>{asset}</td>
                <td style={{textAlign: 'center'}}><input type="radio" name={`asset_${asset.replace(/[^a-zA-Z]/g, '')}`} value="Provide" /></td>
                <td style={{textAlign: 'center'}}><input type="radio" name={`asset_${asset.replace(/[^a-zA-Z]/g, '')}`} value="Help" /></td>
                <td style={{textAlign: 'center'}}><input type="radio" name={`asset_${asset.replace(/[^a-zA-Z]/g, '')}`} value="None" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* SECTION 4: TECHNICAL */}
        <h2>Section 4: Technical Details</h2>
        <div className="field-row">
          <div className="field">
            <label>Do you have a domain name?</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="has_domain" value="Yes" /> Yes</label>
              <label className="checkbox-item"><input type="radio" name="has_domain" value="No" /> No – Need one</label>
            </div>
          </div>
          <div className="field">
            <label>Domain Name (if any)</label>
            <input type="text" name="domain" placeholder="example.com" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Payment Gateway Needed?</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="payment_gateway" value="Razorpay" /> Razorpay</label>
              <label className="checkbox-item"><input type="radio" name="payment_gateway" value="Stripe" /> Stripe</label>
              <label className="checkbox-item"><input type="radio" name="payment_gateway" value="UPI/Manual" /> UPI/Manual</label>
              <label className="checkbox-item"><input type="radio" name="payment_gateway" value="Not needed" /> Not needed</label>
            </div>
          </div>
        </div>

        {/* SECTION 5: BUDGET */}
        <h2>Section 5: Budget & Timeline</h2>
        <div className="field-row">
          <div className="field">
            <label>Total Budget (One-time Build)</label>
            <input type="text" name="budget" placeholder="₹XXXXX" />
          </div>
          <div className="field">
            <label>Desired Launch Date</label>
            <input type="text" name="timeline" placeholder="e.g. Next Month, 15th Aug" />
          </div>
        </div>

        {/* SECTION 6: COMMUNICATION */}
        <h2>Section 6: Communication & Preferences</h2>
        <div className="field-row">
          <div className="field">
            <label>Preferred Contact Method</label>
            <div className="checkbox-group">
              <label className="checkbox-item"><input type="radio" name="contact_method" value="WhatsApp" /> WhatsApp</label>
              <label className="checkbox-item"><input type="radio" name="contact_method" value="Email" /> Email</label>
              <label className="checkbox-item"><input type="radio" name="contact_method" value="Phone Call" /> Phone Call</label>
            </div>
          </div>
        </div>

        {/* SECTION 7: NOTES */}
        <h2>Section 7: Additional Notes</h2>
        <div className="field-row">
          <div className="field">
            <label>Any special requirements or concerns?</label>
            <textarea name="notes" placeholder="Tell us anything else we should know..."></textarea>
          </div>
        </div>

        <br />
        <p style={{fontSize:'12px', color:'#555', fontWeight: 600}}>By submitting this form, I confirm the information provided is accurate and I agree to GrowX Labs' Terms & Conditions.</p>
        
        <div className="field-row" style={{marginTop: '30px', alignItems: 'flex-end'}}>
          <div className="field" style={{maxWidth: '300px'}}>
            <label>Client Digital Signature</label>
            <input type="text" name="signature" placeholder="Type full name to sign" style={{fontFamily: "var(--font-cursive), cursive", fontSize: '24px', background: 'transparent', borderBottom: '2px solid #333', borderRadius: '0', padding: '0 0 5px 0'}} required />
          </div>
          <div style={{fontSize: '11px', color: '#888', paddingBottom: '10px'}}>
            Date: {new Date().toLocaleDateString()}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold">
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className="submit-btn">
          {submitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Processing Submission...
            </>
          ) : "Submit Details"}
        </button>

        <div className="footer">
          GrowX Labs | growxlabs.tech | hello@growxlabs.tech | © {new Date().getFullYear()} GrowX Labs. All rights reserved.
        </div>
      </form>
    </div>
  );
}
