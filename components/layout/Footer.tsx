import Link from "next/link";
import { Rocket, Globe, Send, MessageSquare, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-white">GrowX Labs</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We build high-performance websites and intelligent automation systems 
              that help modern businesses scale exponentially.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Globe size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Send size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-white transition-colors">
                <MessageSquare size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Services</h4>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">Custom Automation</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">SEO Optimization</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-white text-sm transition-colors">Cloud Hosting</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-muted-foreground hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-white text-sm transition-colors">Portfolio</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-white text-sm transition-colors">Contact</Link></li>
              <li><Link href="/dashboard" className="text-muted-foreground hover:text-white text-sm transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-primary" />
                <span>123 Innovation Drive, Tech City</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-primary" />
                <span>hello@growxlabs.com</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} GrowX Labs. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-muted-foreground hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
