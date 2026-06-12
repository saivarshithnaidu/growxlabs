"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useRouter } from "@/navigation";
import { cn } from "@/lib/utils";

// Roles list
const ROLES = [
  "AI / LLM Engineer",
  "Full-Stack Developer (Next.js/Node)",
  "UI / UX Designer",
  "Custom Automation Specialist",
];

// Tech stack options
const TECH_OPTIONS = [
  "React / Next.js",
  "Node.js / TypeScript",
  "Python / FastAPI",
  "LangChain / LlamaIndex",
  "n8n / Workflows",
  "Supabase / PostgreSQL",
  "Figma / UI Design",
  "Docker / AWS",
];

// Notice period options
const NOTICE_PERIODS = [
  "Immediate (Within 7 days)",
  "15 Days",
  "30 Days",
  "60+ Days",
];

// Employment type options
const EMPLOYMENT_TYPES = [
  "Full-Time (Remote)",
  "Part-Time (Remote)",
  "Contract / Freelance",
];

export function CareersContent() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = Intro, 1-17 = Fields, 18 = Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [utcTime, setUtcTime] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Trigger form view on interaction/mouse movement
  useEffect(() => {
    if (showForm) return;

    let isEnabled = false;
    const enableTimer = setTimeout(() => {
      isEnabled = true;
    }, 1200); // 1.2s delay to show the white screen

    let hasTriggered = false;
    const triggerTransition = () => {
      if (!isEnabled || hasTriggered) return;
      hasTriggered = true;
      setShowForm(true);
    };

    const handleMouseMove = () => {
      triggerTransition();
    };

    const handleTouchStart = () => {
      triggerTransition();
    };

    const handleClick = () => {
      triggerTransition();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("click", handleClick);

    return () => {
      clearTimeout(enableTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("click", handleClick);
    };
  }, [showForm]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    experience: "",
    techStack: "", // will compile from array
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

  // Selected tech stacks for Step 8
  const [selectedTech, setSelectedTech] = useState<string[]>([]);

  // Focus ref for inputs
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // UTC clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toISOString().split("T")[1].slice(0, 8) + "Z";
      setUtcTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Autofocus input on step change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setError("");
  }, [step]);

  // Handle select inputs key triggers (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If intro step and press enter, start
      if (step === 0 && e.key === "Enter") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Option selection via keyboard for specific steps
      if (step === 5) {
        // Role Selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= ROLES.length) {
          e.preventDefault();
          selectRole(ROLES[num - 1]);
        }
      } else if (step === 16) {
        // Notice Period Selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= NOTICE_PERIODS.length) {
          e.preventDefault();
          selectNoticePeriod(NOTICE_PERIODS[num - 1]);
        }
      } else if (step === 15) {
        // Employment Type Selection
        const num = parseInt(e.key);
        if (num >= 1 && num <= EMPLOYMENT_TYPES.length) {
          e.preventDefault();
          selectEmploymentType(EMPLOYMENT_TYPES[num - 1]);
        }
      }

      // Enter key for next on text inputs
      if (e.key === "Enter" && step > 0 && step !== 17 && step !== 8) {
        // Exclude step 17 (textarea) and step 8 (multi-select)
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, formData, selectedTech]);

  // Get current step category label
  const getStepCategory = () => {
    if (step === 0) return "INTRO";
    if (step >= 1 && step <= 4) return "PERSONAL DETAILS";
    if (step >= 5 && step <= 8) return "EXPERIENCE & SKILLS";
    if (step >= 9 && step <= 12) return "PROFESSIONAL LINKS";
    if (step >= 13 && step <= 16) return "LOGISTICS & PREFERENCES";
    if (step === 17) return "MOTIVATION";
    return "SUCCESS";
  };

  // Field validation
  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) return "Full name is required.";
        break;
      case 2:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) return "Email address is required.";
        if (!emailRegex.test(formData.email.trim())) return "Please enter a valid email address.";
        break;
      case 3:
        if (!formData.phone.trim()) return "Phone number is required.";
        break;
      case 4:
        if (!formData.location.trim()) return "Current location is required.";
        break;
      case 5:
        if (!formData.role) return "Please select a target role.";
        break;
      case 6:
        if (!formData.experience.trim()) return "Years of experience is required.";
        if (isNaN(Number(formData.experience))) return "Please enter a numerical value.";
        break;
      case 7:
        if (!formData.techStack.trim()) return "Please enter your primary tool or language.";
        break;
      case 8:
        if (selectedTech.length === 0) return "Select at least one skill option.";
        break;
      case 9:
        if (formData.github && !formData.github.startsWith("http")) return "Must be a valid URL starting with http:// or https://";
        break;
      case 10:
        if (formData.linkedin && !formData.linkedin.startsWith("http")) return "Must be a valid URL starting with http:// or https://";
        break;
      case 12:
        if (!formData.resume.trim()) return "Resume URL is required.";
        if (!formData.resume.startsWith("http")) return "Must be a valid link URL.";
        break;
      case 13:
        if (!formData.jobTitle.trim()) return "Current/last job title is required.";
        break;
      case 14:
        if (!formData.company.trim()) return "Current/last employer is required.";
        break;
      case 15:
        if (!formData.employmentType) return "Please select employment preference.";
        break;
      case 16:
        if (!formData.noticePeriod) return "Please select notice period.";
        break;
      case 17:
        if (formData.motivation.trim().length < 15) return "Motivation statement must be at least 15 characters.";
        break;
      default:
        break;
    }
    return "";
  };

  // Navigations
  const handleNext = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step === 8) {
      // Compile tech selection into techStack info
      setFormData(prev => ({
        ...prev,
        techStack: `Primary: ${prev.techStack} | Skills: ${selectedTech.join(", ")}`
      }));
    }

    if (step === 17) {
      submitApplication();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  // Select handlers
  const selectRole = (role: string) => {
    setFormData(prev => ({ ...prev, role }));
    setTimeout(() => setStep(prev => prev + 1), 200);
  };

  const selectNoticePeriod = (noticePeriod: string) => {
    setFormData(prev => ({ ...prev, noticePeriod }));
    setTimeout(() => setStep(prev => prev + 1), 200);
  };

  const selectEmploymentType = (employmentType: string) => {
    setFormData(prev => ({ ...prev, employmentType }));
    setTimeout(() => setStep(prev => prev + 1), 200);
  };

  const toggleTechOption = (tech: string) => {
    setSelectedTech(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  // Submit API Call
  const submitApplication = async () => {
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

      setStep(18); // Success Step
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!showForm ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 w-full h-full bg-black text-white font-sans z-50 flex flex-col justify-between p-8 md:p-16 select-none overflow-hidden"
        >
          {/* Decorative Grid Mesh Background matching main site */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />

          {/* Top Row */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-zinc-500">
            <div>[GrowXLabs]</div>
            <div>// INTRO</div>
            <div>START</div>
          </div>

          {/* Middle Row with columns */}
          <div className="flex justify-end w-full mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-[9px] font-mono tracking-widest uppercase text-zinc-500 max-w-4xl w-full">
              <div>
                <p className="text-zinc-500 mb-1">We hire for</p>
                <p className="text-white font-bold">Curiosity, grit,<br />honesty</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">{ROLES.length} roles</p>
                <p className="text-white font-bold">open across<br />the company</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Reply within</p>
                <p className="text-white font-bold">7 days,<br />always a human</p>
              </div>
              <div>
                <p className="text-zinc-500 mb-1">© 2026</p>
                <p className="text-white font-bold">GrowX Labs<br />Pvt Ltd</p>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full flex flex-col items-start">
            <h1 className="text-[12vw] font-bold tracking-tighter leading-none select-none text-white">
              Careers
            </h1>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 w-full h-full bg-black text-white font-sans z-40 flex flex-col justify-between pt-28 pb-8 px-8 md:pt-32 md:pb-12 md:px-12 xl:pt-36 xl:pb-16 xl:px-16 select-none overflow-hidden"
        >
          {/* Decorative Grid Mesh Background matching main site */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />

          {/* ═══ TOP HEADER BAR ═══ */}
          <header className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-500">
            <div>// CAREERS</div>
            <div className="text-zinc-400 transition-colors uppercase">{getStepCategory()}</div>
            <div>
              {step > 0 && step <= 17 ? (
                <span>{String(step).padStart(2, "0")} / 17</span>
              ) : step === 18 ? (
                <span>COMPLETED</span>
              ) : (
                <span>START</span>
              )}
            </div>
          </header>

          {/* ═══ MAIN STEP VIEWPORT ═══ */}
          <main className="flex-grow flex flex-col justify-center max-w-4xl mx-auto w-full relative">
            
            {/* Back navigation indicator */}
            {step > 0 && step < 18 && (
              <button
                onClick={handleBack}
                className="absolute -left-12 lg:-left-20 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-full cursor-pointer transition-all active:scale-90 text-zinc-500 hover:text-white hidden md:block"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full flex flex-col items-start"
              >
                
                {/* Step label comment */}
                {step < 18 && (
                  <span className="font-mono text-xs text-zinc-500 tracking-wider mb-3">
                    // {step === 0 ? "CAREERS - 2026" : `QUESTION ${String(step).padStart(2, "0")}`}
                  </span>
                )}

                {/* ═══ STEP 0: INTRO ═══ */}
                {step === 0 && (
                  <div className="space-y-8">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight">
                      Apply to GrowX Labs.
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-400 font-sans tracking-tight leading-relaxed max-w-xl">
                      Curious. Hard-working. Honest. About 10-15 minutes.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                      <button
                        onClick={handleNext}
                        className="px-8 py-3.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md transition-all active:scale-95 shadow-md cursor-pointer"
                      >
                        Start
                      </button>
                      <span className="font-mono text-[10px] text-zinc-500">PRESS ENTER</span>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 1: NAME ═══ */}
                {step === 1 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your full name?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Type your answer here..."
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 2: EMAIL ═══ */}
                {step === 2 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your email address?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 3: PHONE ═══ */}
                {step === 3 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your phone number?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 4: LOCATION ═══ */}
                {step === 4 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      Where are you currently located?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 5: ROLE (Select) ═══ */}
                {step === 5 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight block mb-6">
                      What role are you applying for?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {ROLES.map((role, idx) => (
                        <button
                          key={role}
                          onClick={() => selectRole(role)}
                          className={cn(
                            "w-full p-5 text-left border rounded-xl flex justify-between items-center transition-all cursor-pointer group",
                            formData.role === role
                              ? "border-[#C0F0FB] bg-[#C0F0FB]/10 text-white"
                              : "border-white/10 bg-white/5 hover:border-[#C0F0FB]"
                          )}
                        >
                          <span className="font-sans font-semibold text-white">{role}</span>
                          <span className="font-mono text-[10px] bg-white/10 text-zinc-400 group-hover:bg-[#C0F0FB] group-hover:text-black px-2 py-1 rounded">
                            [{idx + 1}]
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 6: EXP ═══ */}
                {step === 6 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      How many years of professional experience do you have?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Years (e.g. 5)"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 7: TECH STACK (TEXT) ═══ */}
                {step === 7 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your primary programming language or design tool?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.techStack}
                      onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                      placeholder="TypeScript, Python, Figma, etc."
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 8: TECH STACK OPTIONS (Multi-select) ═══ */}
                {step === 8 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight block mb-6">
                      Select other libraries and tools you are highly confident in:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full">
                      {TECH_OPTIONS.map((tech) => {
                        const isSelected = selectedTech.includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => toggleTechOption(tech)}
                            className={cn(
                              "p-3 text-center border rounded-lg transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer",
                              isSelected
                                ? "bg-white border-white text-black font-extrabold"
                                : "bg-white/5 border-white/10 text-zinc-300 hover:border-[#C0F0FB] hover:text-white"
                            )}
                          >
                            {tech}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                      <button
                        onClick={handleNext}
                        className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
                      >
                        Continue
                      </button>
                      <span className="font-mono text-[10px] text-zinc-500">click to continue</span>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 9: GITHUB ═══ */}
                {step === 9 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your GitHub profile URL? (Optional)
                    </label>
                    <input
                      ref={inputRef as any}
                      type="url"
                      value={formData.github}
                      onChange={e => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/yourusername"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 10: LINKEDIN ═══ */}
                {step === 10 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your LinkedIn profile URL? (Optional)
                    </label>
                    <input
                      ref={inputRef as any}
                      type="url"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 11: PORTFOLIO ═══ */}
                {step === 11 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your portfolio or website URL? (Optional)
                    </label>
                    <input
                      ref={inputRef as any}
                      type="url"
                      value={formData.portfolio}
                      onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://yourportfolio.com"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 12: RESUME CV ═══ */}
                {step === 12 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      Please provide a link to your resume or CV.
                    </label>
                    <input
                      ref={inputRef as any}
                      type="url"
                      value={formData.resume}
                      onChange={e => setFormData({ ...formData, resume: e.target.value })}
                      placeholder="Google Drive, Dropbox, or custom PDF link..."
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 13: LAST TITLE ═══ */}
                {step === 13 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your current or last job title?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.jobTitle}
                      onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 14: LAST COMPANY ═══ */}
                {step === 14 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      What is your current or last company / employer?
                    </label>
                    <input
                      ref={inputRef as any}
                      type="text"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company name..."
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-2xl md:text-3xl font-sans tracking-tight font-black bg-transparent w-full text-white transition-colors placeholder-zinc-700"
                    />
                  </div>
                )}

                {/* ═══ STEP 15: EMPLOYMENT TYPE (Select) ═══ */}
                {step === 15 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight block mb-6">
                      Select your employment preference:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                      {EMPLOYMENT_TYPES.map((type, idx) => (
                        <button
                          key={type}
                          onClick={() => selectEmploymentType(type)}
                          className={cn(
                            "p-5 text-left border rounded-xl flex justify-between items-center transition-all cursor-pointer group",
                            formData.employmentType === type
                              ? "border-[#C0F0FB] bg-[#C0F0FB]/10 text-white"
                              : "border-white/10 bg-white/5 hover:border-[#C0F0FB]"
                          )}
                        >
                          <span className="font-sans font-semibold text-white text-sm">{type}</span>
                          <span className="font-mono text-[10px] bg-white/10 text-zinc-400 group-hover:bg-[#C0F0FB] group-hover:text-black px-2 py-1 rounded">
                            [{idx + 1}]
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 16: NOTICE PERIOD (Select) ═══ */}
                {step === 16 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight block mb-6">
                      What is your notice period / availability to start?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {NOTICE_PERIODS.map((period, idx) => (
                        <button
                          key={period}
                          onClick={() => selectNoticePeriod(period)}
                          className={cn(
                            "p-5 text-left border rounded-xl flex justify-between items-center transition-all cursor-pointer group",
                            formData.noticePeriod === period
                              ? "border-[#C0F0FB] bg-[#C0F0FB]/10 text-white"
                              : "border-white/10 bg-white/5 hover:border-[#C0F0FB]"
                          )}
                        >
                          <span className="font-sans font-semibold text-white">{period}</span>
                          <span className="font-mono text-[10px] bg-white/10 text-zinc-400 group-hover:bg-[#C0F0FB] group-hover:text-black px-2 py-1 rounded">
                            [{idx + 1}]
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ═══ STEP 17: MOTIVATION (Textarea) ═══ */}
                {step === 17 && (
                  <div className="w-full space-y-6">
                    <label className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                      Why do you want to join GrowX Labs Tech?
                    </label>
                    <textarea
                      ref={inputRef as any}
                      value={formData.motivation}
                      onChange={e => setFormData({ ...formData, motivation: e.target.value })}
                      placeholder="Tell us what drives you..."
                      rows={4}
                      className="border-b border-white/20 focus:border-white py-4 outline-none text-xl sm:text-2xl font-sans tracking-tight font-medium bg-transparent w-full text-white transition-colors resize-none placeholder-zinc-700"
                    />
                    <div className="flex items-center gap-4 pt-4">
                      <button
                        disabled={isSubmitting}
                        onClick={handleNext}
                        className="px-8 py-3.5 bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-md transition-all cursor-pointer"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                      <span className="font-mono text-[10px] text-zinc-500">click to submit</span>
                    </div>
                  </div>
                )}

                {/* ═══ STEP 18: SUCCESS VIEW ═══ */}
                {step === 18 && (
                  <div className="space-y-8 max-w-xl">
                    <div className="w-16 h-16 rounded-full bg-emerald-950/30 text-emerald-400 flex items-center justify-center mb-6">
                      <Check className="w-8 h-8" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-tight">
                      Application Submitted.
                    </h1>
                    <p className="text-lg text-zinc-400 font-sans tracking-tight leading-relaxed">
                      Thank you for applying. We will review your systems experience and get back to you at the email address provided within 48 hours.
                    </p>
                    <div className="pt-6">
                      <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 border border-zinc-750 hover:border-white text-white font-mono font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer bg-transparent"
                      >
                        Go back Home
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation/Error alerts */}
                {error && (
                  <div className="mt-6 flex items-center gap-2 text-xs font-mono font-bold text-red-400 bg-red-950/20 border border-red-950/30 px-4 py-3 rounded-md animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Hint for progress for text-steps (Next) */}
                {step > 0 && step <= 14 && step !== 5 && step !== 8 && (
                  <div className="mt-8 flex items-center gap-4 text-[10px] font-mono text-zinc-500">
                    <button
                      onClick={handleNext}
                      className="px-4 py-1.5 border border-white/10 hover:border-white rounded transition-all text-white hover:bg-white/5 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Next
                    </button>
                    <span>or press Enter</span>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </main>

          {/* ═══ BOTTOM STATUS FOOTER BAR ═══ */}
          <footer className="flex justify-between items-center text-xs font-mono font-bold text-zinc-500">
            <div className="flex items-center gap-2">
              <span className={cn(
                "w-2 h-2 rounded-full",
                step === 18 ? "bg-emerald-500" : "bg-white animate-pulse"
              )} />
              <span>{step === 18 ? "COMPLETED" : "READY"}</span>
            </div>
            <div>{utcTime}</div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
