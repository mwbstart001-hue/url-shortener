import { useState, useEffect } from 'react';

interface OverallStatsData {
  totalUrls: number;
  totalVisits: number;
  topUrls: Array<{
    shortCode: string;
    originalUrl: string;
    visitCount: number;
    createdAt: string;
  }>;
}

export function OverallStats() {
  const [stats, setStats] = useState<OverallStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stats');
      const data = await response.json();
      
      if (data.code === 200) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-red-500/50 rounded-xl p-6 bg-red-500/10">
        <p className="text-red-400 text-center py-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            {stats?.totalUrls || 0}
          </div>
          <div className="text-white/60">总链接数</div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
            {stats?.totalVisits || 0}
          </div>
          <div className="text-white/60">总访问量</div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>🔥</span>
          热门链接 TOP 5
        </h3>
        {stats?.topUrls && stats.topUrls.length > 0 ? (
          <div className="space-y-3">
            {stats.topUrls.map((url, index) => (
              <div
                key={url.shortCode}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-500 text-black' :
                    'bg-white/20 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={`http://localhost:3000/${url.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium truncate block"
                    >
                      {url.shortCode}
                    </a>
                    <p className="text-white/50 text-sm truncate">{url.originalUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-white/60 text-sm">{url.visitCount} 次访问</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/50 text-center py-8">暂无数据</p>
        )}
      </div>
    </div>
  );
}
