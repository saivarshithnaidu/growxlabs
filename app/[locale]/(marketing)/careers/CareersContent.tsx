"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, ArrowLeft, ArrowRight, Upload, Briefcase, User, Link2, FileText, Send, Loader2 } from "lucide-react";
import { Link, useRouter } from "@/navigation";
import { cn } from "@/lib/utils";

// Roles list
const ROLES = [
  "AI / LLM Engineer",
  "Full-Stack Developer (Next.js/Node)",
  "UI / UX Designer",
  "Custom Automation Specialist",
];

// Employment type options
const EMPLOYMENT_TYPES = [
  "Full-Time (Remote)",
  "Part-Time (Remote)",
  "Contract / Freelance",
];

// Notice period options
const NOTICE_PERIODS = [
  "Immediate (Within 7 days)",
  "15 Days",
  "30 Days",
  "60+ Days",
];

export function CareersContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    experience: "",
    techStack: "",
    github: "",
    linkedin: "",
    portfolio: "",
    resume: "",
    jobTitle: "",
    company: "",
    expectedSalary: "",
    noticePeriod: "",
    employmentType: "",
    motivation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectRole = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    setError("");
  };

  const handleSelectEmployment = (type: string) => {
    setFormData(prev => ({ ...prev, employmentType: type }));
    setError("");
  };

  const handleSelectNotice = (period: string) => {
    setFormData(prev => ({ ...prev, noticePeriod: period }));
    setError("");
  };

  const validate = () => {
    if (!formData.name.trim()) return "Full name is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) return "Email address is required.";
    if (!emailRegex.test(formData.email.trim())) return "Please enter a valid email address.";
    if (!formData.phone.trim()) return "Phone number is required.";
    if (!formData.location.trim()) return "Current location is required.";
    if (!formData.role) return "Please select a target role.";
    if (!formData.experience.trim()) return "Years of experience is required.";
    if (isNaN(Number(formData.experience))) return "Please enter a numeric value for experience.";
    if (!formData.techStack.trim()) return "Please specify your primary technical stack/tools.";
    if (!formData.resume.trim()) return "Resume link is required.";
    if (!formData.resume.startsWith("http")) return "Resume must be a valid link URL (starting with http/https).";
    if (!formData.jobTitle.trim()) return "Current/last job title is required.";
    if (!formData.company.trim()) return "Current/last company is required.";
    if (!formData.employmentType) return "Please select employment preference.";
    if (!formData.noticePeriod) return "Please select your notice period.";
    if (formData.motivation.trim().length < 15) return "Motivation statement must be at least 15 characters.";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      // Scroll to error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-32 pb-24 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Decorative Grid Mesh Background matching main site */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Header section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
                  <span>[ Careers ]</span>
                  <span>//</span>
                  <span>Join the intelligence engineering team</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                  Start Your Systems Application
                </h1>
                <p className="text-zinc-400 font-sans tracking-tight leading-relaxed max-w-2xl text-sm md:text-base">
                  We look for curiosity, technical grit, and absolute honesty. Please fill out our professional dossier below. All fields are mandatory unless marked optional.
                </p>
              </div>

              {/* Error box */}
              {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-450 text-xs font-mono font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* ═══ SECTION 1: PERSONAL DETAILS ═══ */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-6">
                  <h3 className="text-xs font-mono font-bold text-primary tracking-widest uppercase flex items-center gap-2">// 01. Personal Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Current Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* ═══ SECTION 2: POSITION & TARGET ═══ */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-6">
                  <h3 className="text-xs font-mono font-bold text-primary tracking-widest uppercase flex items-center gap-2">// 02. Role Preference</h3>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Target Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      {ROLES.map((role) => {
                        const isSelected = formData.role === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleSelectRole(role)}
                            className={cn(
                              "p-4 text-left border rounded-xl flex justify-between items-center transition-all cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5 text-white"
                                : "border-zinc-850 bg-zinc-900/30 text-zinc-400 hover:border-zinc-500"
                            )}
                          >
                            <span className="text-xs font-bold">{role}</span>
                            {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Employment Preference</label>
                      <div className="flex flex-col gap-2">
                        {EMPLOYMENT_TYPES.map((type) => {
                          const isSelected = formData.employmentType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => handleSelectEmployment(type)}
                              className={cn(
                                "p-3 text-left border rounded-lg text-xs font-bold transition-all cursor-pointer flex justify-between items-center",
                                isSelected 
                                  ? "border-primary bg-primary/5 text-white" 
                                  : "border-zinc-850 bg-zinc-900/20 text-zinc-450 hover:border-zinc-700"
                              )}
                            >
                              <span>{type}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block">Availability / Notice Period</label>
                      <div className="flex flex-col gap-2">
                        {NOTICE_PERIODS.map((period) => {
                          const isSelected = formData.noticePeriod === period;
                          return (
                            <button
                              key={period}
                              type="button"
                              onClick={() => handleSelectNotice(period)}
                              className={cn(
                                "p-3 text-left border rounded-lg text-xs font-bold transition-all cursor-pointer flex justify-between items-center",
                                isSelected 
                                  ? "border-primary bg-primary/5 text-white" 
                                  : "border-zinc-850 bg-zinc-900/20 text-zinc-450 hover:border-zinc-700"
                              )}
                            >
                              <span>{period}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Expected Annual Compensation (e.g. ₹12,00,000 / $60,000)</label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleChange}
                      placeholder="e.g. ₹15 LPA / $75k"
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                    />
                  </div>
                </div>

                {/* ═══ SECTION 3: WORK HISTORY & SKILLS ═══ */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-6">
                  <h3 className="text-xs font-mono font-bold text-primary tracking-widest uppercase flex items-center gap-2">// 03. Competence & Experience</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Years of Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g. 4"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Current/Last Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Full-Stack Developer"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Current/Last Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Corp"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Core Technical Stack & Tools (comma-separated)</label>
                    <input
                      type="text"
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleChange}
                      placeholder="React, Next.js, Node.js, Python, LangChain, TailwindCSS, Figma, AWS..."
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                    />
                  </div>
                </div>

                {/* ═══ SECTION 4: PROFESSIONAL LINKS ═══ */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-6">
                  <h3 className="text-xs font-mono font-bold text-primary tracking-widest uppercase flex items-center gap-2">// 04. Digital Footprints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Resume / CV Link</label>
                      <input
                        type="url"
                        name="resume"
                        value={formData.resume}
                        onChange={handleChange}
                        placeholder="Google Drive, Dropbox, or custom PDF URL..."
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">LinkedIn Profile URL (Optional)</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">GitHub Profile URL (Optional)</label>
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Portfolio URL (Optional)</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        placeholder="https://mywork.com"
                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none px-4 py-3 rounded-xl text-sm text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* ═══ SECTION 5: MOTIVATION ═══ */}
                <div className="p-6 md:p-8 rounded-2xl bg-zinc-950/60 border border-zinc-900 space-y-6">
                  <h3 className="text-xs font-mono font-bold text-primary tracking-widest uppercase flex items-center gap-2">// 05. Motivations</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Why do you want to join the GrowX Labs Tech team? (Minimum 15 characters)</label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder="Share what drives you, why you are passionate about automation/AI systems, and how your skills can help scale the platform..."
                      rows={5}
                      className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-white focus:outline-none p-4 rounded-xl text-sm text-white leading-relaxed resize-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Return to Home
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-white/5 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Submitting Dossier...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-16 text-center max-w-xl mx-auto space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 flex items-center justify-center rounded-3xl mx-auto shadow-lg shadow-emerald-500/5">
                <Check className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Application Submitted Successfully</h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                  Thank you, <span className="text-white font-bold">{formData.name}</span>. Your details have been securely logged in our hiring database. Our systems engineering team will review your application and contact you at <span className="text-white font-bold">{formData.email}</span> within 48 hours.
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  Return Home
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      location: "",
                      role: "",
                      experience: "",
                      techStack: "",
                      github: "",
                      linkedin: "",
                      portfolio: "",
                      resume: "",
                      jobTitle: "",
                      company: "",
                      expectedSalary: "",
                      noticePeriod: "",
                      employmentType: "",
                      motivation: "",
                    });
                  }}
                  className="px-6 py-3.5 bg-transparent border border-zinc-800 text-zinc-400 hover:border-white hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Apply for another role
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
