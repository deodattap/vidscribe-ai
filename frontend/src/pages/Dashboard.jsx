import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground mb-4">{user?.email}</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Dashboard;