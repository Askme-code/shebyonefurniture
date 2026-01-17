'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone, Twitter, Facebook, Linkedin, Instagram, ArrowUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SocialIcon({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
      {children}
    </a>
  );
}


export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="dark bg-card text-card-foreground/80 relative border-t border-border">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* GET IN TOUCH */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-card-foreground mb-4">GET IN TOUCH</h3>
            <p className="text-sm mb-4">
              We'd love to hear from you. Whether you have a question about our products or services, our team is here to help. Reach out to us anytime and we'll get back to you as soon as possible.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span>Zanzibar, Tanzania</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href="mailto:contact@shaabanfurniture.com" className="hover:text-primary transition-colors">
                  contact@shaabanfurniture.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <a href="tel:+255686587266" className="hover:text-primary transition-colors">
                  +255 686 587 266
                </a>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-card-foreground mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> Home</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> Our Shop</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> Contact Us</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> Go Admin</Link></li>
            </ul>
          </div>

          {/* MY ACCOUNT */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-card-foreground mb-4">MY ACCOUNT</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/admin" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> My Dashboard</Link></li>
                <li><Link href="/admin/orders" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> My Orders</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> My Wishlist</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors flex items-center gap-2"><ChevronRight className="h-4 w-4 text-primary" /> My Profile</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="font-headline text-lg font-semibold text-card-foreground mb-4">NEWSLETTER</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter and get 30% off your first purchase.
            </p>
            <form className="flex items-center">
              <Input type="email" placeholder="Your Email Address" className="bg-card border-border text-card-foreground rounded-r-none focus:ring-primary focus:border-primary placeholder:text-muted-foreground" />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-l-none shrink-0">Sign Up</Button>
            </form>
            <h3 className="font-headline text-lg font-semibold text-card-foreground mt-6 mb-4">FOLLOW US</h3>
            <div className="flex space-x-2">
                <SocialIcon href="#"><Twitter className="h-5 w-5" /></SocialIcon>
                <SocialIcon href="#"><Facebook className="h-5 w-5" /></SocialIcon>
                <SocialIcon href="#"><Linkedin className="h-5 w-5" /></SocialIcon>
                <SocialIcon href="#"><Instagram className="h-5 w-5" /></SocialIcon>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-card-foreground/60">&copy; {new Date().getFullYear()} Sheby One Furniture. All Rights Reserved.</p>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className="absolute bottom-6 right-6 bg-primary text-primary-foreground h-10 w-10 rounded flex items-center justify-center hover:bg-primary/90 transition-all"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </footer>
  );
}
