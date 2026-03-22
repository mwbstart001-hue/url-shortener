import { useState } from 'react';
import { CopyToClipboard } from './components/CopyToClipboard';
import { StatsCard } from './components/StatsCard';
import { UrlForm } from './components/UrlForm';
import { UrlResult } from './components/UrlResult';
import { OverallStats } from './components/OverallStats';

interface ShortUrlResult {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

function App() {
  const [shortUrlResult, setShortUrlResult] = useState<ShortUrlResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'stats'>('create');

  const handleCreateShortUrl = async (originalUrl: string, expiresAt?: Date) => {
    setIsLoading(true);
    setError(null);
    setShortUrlResult(null);

    try {
      const response = await fetch('http://localhost:3000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl,
          expiresAt: expiresAt?.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.code === 200) {
        setShortUrlResult(data.data);
      } else {
        setError(data.message || 'Failed to create short URL');
      }
    } catch (err) {
      setError('Failed to connect to server. Please make sure the backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            短链接服务
          </h1>
          <p className="text-white/70 text-lg">
            快速、简洁、高效的URL缩短工具
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl inline-flex p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              创建短链
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              数据统计
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <div className="animate-fade-in">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 mb-8">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span className="text-3xl">🔗</span>
                创建短链接
              </h2>
              <UrlForm onSubmit={handleCreateShortUrl} isLoading={isLoading} />
            </div>

            {error && (
              <div className="bg-white/10 backdrop-blur-lg border border-red-500/50 rounded-xl p-6 mb-8 bg-red-500/10 animate-fade-in">
                <p className="text-red-400 flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {shortUrlResult && (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 animate-fade-in">
                <UrlResult result={shortUrlResult} />
                <div className="mt-4 flex justify-end">
                  <CopyToClipboard
                    text={shortUrlResult.shortUrl}
                    onCopy={handleCopy}
                    copied={copied}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <OverallStats />
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            icon="⚡"
            title="快速生成"
            description="一键生成简洁的短链接，支持自定义过期时间"
          />
          <StatsCard
            icon="📊"
            title="数据统计"
            description="实时追踪链接访问数据，了解用户行为"
          />
          <StatsCard
            icon="🔒"
            title="安全可靠"
            description="采用Redis缓存加速，SQLite持久化存储"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
