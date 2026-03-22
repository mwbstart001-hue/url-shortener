import { useState } from 'react';

interface UrlFormProps {
  onSubmit: (url: string, expiresAt?: Date) => void;
  isLoading: boolean;
}

export function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [expireOption, setExpireOption] = useState<string>('never');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let expiresAt: Date | undefined;
    if (expireOption === '1day') {
      expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    } else if (expireOption === '7days') {
      expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else if (expireOption === '30days') {
      expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    onSubmit(url, expiresAt);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-white/80 mb-2 text-sm font-medium">
          目标链接
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="请输入要缩短的链接，如：https://example.com"
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-white/80 mb-2 text-sm font-medium">
          有效期
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'never', label: '永久有效' },
            { value: '1day', label: '1天' },
            { value: '7days', label: '7天' },
            { value: '30days', label: '30天' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setExpireOption(option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                expireOption === option.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            生成中...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            生成短链接
          </>
        )}
      </button>
    </form>
  );
}
