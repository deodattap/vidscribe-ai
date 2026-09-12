import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer = () => (
  <footer className="border-t mt-24">
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Sparkles className="w-4 h-4" />
        VidScribe
      </div>
      <p>&copy; {new Date().getFullYear()} VidScribe. All rights reserved.</p>
      <div className="flex gap-4">
        <Link to="/login" className="hover:text-foreground transition-colors">Log in</Link>
        <Link to="/register" className="hover:text-foreground transition-colors">Sign up</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
