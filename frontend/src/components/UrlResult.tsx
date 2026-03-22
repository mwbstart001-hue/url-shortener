interface ShortUrlResult {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
}

interface UrlResultProps {
  result: ShortUrlResult;
}

export function UrlResult({ result }: UrlResultProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">✅</span>
        <h3 className="text-xl font-semibold text-green-400">短链接生成成功！</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-white/60 text-sm mb-1">原始链接</label>
          <p className="text-white/80 break-all text-sm bg-white/5 p-3 rounded-lg">
            {result.originalUrl}
          </p>
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-1">短链接</label>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 break-all text-lg font-medium bg-white/5 p-3 rounded-lg block transition-colors"
          >
            {result.shortUrl}
          </a>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>短码: {result.shortCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
