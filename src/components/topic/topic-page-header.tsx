import { Link } from 'react-router-dom';
import { splitBilingualTitle } from '@/lib/topic-title-and-numbering';

interface TopicPageHeaderProps {
  title: string;
  tagline: string;
  readTime: string;
  lessonNumber: string;
  chapterTitle?: string;
}

/** Lesson header: chapter + lesson number, bilingual title, one-line tagline. */
export function TopicPageHeader({ title, tagline, readTime, lessonNumber, chapterTitle }: TopicPageHeaderProps) {
  const { vi, en } = splitBilingualTitle(title);
  const minutes = readTime.replace(/[^\d]/g, '');

  return (
    <header className="pb-8 pt-2">
      <Link to="/" className="text-sm text-text-muted transition-colors hover:text-text-primary">
        {chapterTitle ?? 'Mục lục'}
      </Link>

      <p className="mt-6 text-sm text-text-muted">
        <span className="text-accent-orange">Bài {lessonNumber}</span>
        {minutes && <span className="ml-3">{minutes} phút đọc</span>}
      </p>
      <h1 className="mt-2 font-serif text-[2rem] leading-[1.15] text-text-primary sm:text-[2.5rem]">{vi}</h1>
      {en && <p className="mt-1 text-text-muted">{en}</p>}

      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">{tagline}</p>
    </header>
  );
}
