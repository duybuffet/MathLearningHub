import { Link } from 'react-router-dom';

interface TopicPageHeaderProps {
  title: string;
  tagline: string;
  readTime: string;
  areaBadge?: string;
}

export function TopicPageHeader({ title, tagline, readTime, areaBadge }: TopicPageHeaderProps) {
  return (
    <header className="text-center py-8 px-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1 mb-6 text-sm text-text-muted hover:text-accent-blue transition-colors duration-150"
      >
        <span aria-hidden="true">←</span>
        Quay lại tất cả topics
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 leading-tight">
        {title}
      </h1>

      <p className="text-text-secondary text-lg max-w-xl mx-auto mb-4 leading-relaxed">
        {tagline}
      </p>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        <span className="inline-block px-3 py-1 rounded-btn bg-bg-panel border border-border-subtle text-text-muted text-sm font-mono">
          {readTime} đọc
        </span>
        {areaBadge && (
          <span className="inline-block px-3 py-1 rounded-btn bg-accent-orange/15 border border-accent-orange/30 text-accent-orange text-sm font-medium">
            {areaBadge}
          </span>
        )}
      </div>
    </header>
  );
}
