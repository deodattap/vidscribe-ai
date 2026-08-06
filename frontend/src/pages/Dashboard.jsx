import { Video, FileText, Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const StatCard = ({ icon: Icon, label, value, loading }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{value}</p>}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground">Here's what's happening with your content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Video} label="Videos Processed" value={data?.stats.videosProcessed} loading={isLoading} />
        <StatCard icon={FileText} label="Blogs Generated" value={data?.stats.blogsGenerated} loading={isLoading} />
        <StatCard icon={Sparkles} label="Total Content" value={data?.stats.totalContentGenerated} loading={isLoading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data?.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-4">No videos processed yet.</p>
              <Button asChild>
                <Link to="/process">
                  <Plus className="w-4 h-4 mr-2" />
                  Process your first video
                </Link>
              </Button>
            </div>
          ) : (
            <div>{/* recent activity list — built in Phase 4/6 */}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;