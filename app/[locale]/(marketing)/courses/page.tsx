"use client";

import { motion } from "framer-motion";
import { courses } from "@/lib/data/courses";
import { BookOpen, Clock, BarChart, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CoursesPage() {
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 xl:px-16 2xl:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-[#00A86B] font-bold uppercase tracking-widest text-xs">
              Skill Validation Ecosystem
            </span>
            <h1 className="text-white font-bold text-[clamp(40px,7vw,64px)] leading-[1] tracking-tighter">
              Verify Your Expertise. <br />
              <span className="text-white/40 italic">Earn Your Credentials.</span>
            </h1>
            <p className="text-[#A0A0A0] text-lg max-w-2xl leading-relaxed">
              Premium, structured learning paths designed for real-world impact. Complete the modules, pass the evaluation, and claim your verifiable GrowX Labs certification.
            </p>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-[32px] overflow-hidden hover:border-[#00A86B]/30 transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Course Image */}
                <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                  <Image 
                    src={course.image} 
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase text-[#00A86B] border border-[#00A86B]/20">
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="flex-1 p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00A86B] transition-colors leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed mb-8 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                        <BookOpen size={14} className="text-[#00A86B]" />
                        {course.modules.length} Modules
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                        <Clock size={14} className="text-[#00A86B]" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-widest">
                        <BarChart size={14} className="text-[#00A86B]" />
                        Final Project
                      </div>
                    </div>
                  </div>

                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-white text-black hover:bg-[#00A86B] hover:text-white rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-none transition-all">
                      View Curriculum <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-md">
            <h4 className="text-white font-bold text-xl mb-2">Verifiable Credentialing</h4>
            <p className="text-[#A0A0A0] text-sm">
              Every graduate receives a cryptographically signed certificate with a unique tracking ID and QR code for instant employer verification.
            </p>
          </div>
          <div className="flex gap-12 grayscale opacity-30">
            <div className="text-2xl font-black text-white italic tracking-tighter">GrowX Cert</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">ISO Audit</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">GXL Valid</div>
          </div>
        </div>

      </div>
    </div>
  );
}
