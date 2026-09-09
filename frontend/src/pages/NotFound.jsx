import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
    <h1 className="text-2xl font-bold">Page not found</h1>
    <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
    <Button asChild>
      <Link to="/dashboard">Back to Dashboard</Link>
    </Button>
  </div>
);

export default NotFound;
