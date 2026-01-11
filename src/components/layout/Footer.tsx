import Link from 'next/link';
import { Logo } from './Logo';

function SocialIcon({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">Crafting comfort for your home from the heart of Zanzibar.</p>
            <div className="flex space-x-4">
               <SocialIcon href="#">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd"></path></svg>
              </SocialIcon>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/category/beds" className="text-muted-foreground hover:text-primary">Beds</Link></li>
              <li><Link href="/category/sofas" className="text-muted-foreground hover:text-primary">Sofas</Link></li>
              <li><Link href="/category/chairs" className="text-muted-foreground hover:text-primary">Chairs</Link></li>
              <li><Link href="/category/tables" className="text-muted-foreground hover:text-primary">Tables</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">About Us</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Our Story</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Custom Orders</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Zanzibar, Tanzania</p>
                <p>Email: contact@shaabanfurniture.com</p>
                <p>Phone: +255 777 123 456</p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Shaaban Furniture Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
