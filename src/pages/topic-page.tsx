import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  findTopicEntry,
  loadTopicByFile,
  topicIdFor,
  getCurriculum,
} from '@/lib/content-loader';
import { useTopicProgress } from '@/hooks/use-topic-progress';
import { TopicPageHeader } from '@/components/topic/topic-page-header';
import { SectionContentRenderer } from '@/components/topic/section-content-renderer';
import { QuizSection } from '@/components/topic/quiz-section';
import { FlashcardDeck } from '@/components/flashcards/flashcard-deck';
import { ExerciseList } from '@/components/exercises/exercise-list';

export function TopicPage() {
  const { areaId, topicSlug } = useParams<{ areaId: string; topicSlug: string }>();

  // Resolve topic content from curriculum + content loader
  const entry = areaId && topicSlug ? findTopicEntry(areaId, topicSlug) : null;
  const topic = entry?.topic?.file ? loadTopicByFile(entry.topic.file) : null;

  const topicId = areaId && topicSlug ? topicIdFor(areaId, topicSlug) : '';
  const { markRead, setLastVisited } = useTopicProgress(topicId);

  // Find area title for badge
  const areaTitle = areaId
    ? getCurriculum().areas.find((a) => a.id === areaId)?.titleEn
    : undefined;

  // Track last visited on mount
  useEffect(() => {
    if (topicId) setLastVisited();
  }, [topicId, setLastVisited]);

  // Mark read when the sentinel at the bottom scrolls into view
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !topicId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          markRead();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [topicId, markRead]);

  if (!topic) {
    return <ContentComingSoon />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <TopicPageHeader
          title={topic.title}
          tagline={topic.tagline}
          readTime={topic.readTime}
          areaBadge={areaTitle}
        />

        {/* Main content sections */}
        <SectionContentRenderer sections={topic.sections} />

        {/* Scroll sentinel — triggers markRead when visible */}
        <div ref={sentinelRef} aria-hidden="true" className="h-1" />

        {/* ── Thẻ ghi nhớ (Flashcards) ── */}
        {topic.flashcards.length > 0 && (
          <div className="mt-10 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Thẻ ghi nhớ (Flashcards)
            </h2>
            <FlashcardDeck
              cards={topic.flashcards.map((fc) => ({ topicId: topicId, card: fc }))}
            />
          </div>
        )}

        {/* ── Bài tập (Exercises) ── */}
        {topic.exercises.length > 0 && (
          <div className="mt-10 mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Bài tập (Exercises)
            </h2>
            <ExerciseList exercises={topic.exercises} flashcards={topic.flashcards} />
          </div>
        )}

        {/* Quiz */}
        {topic.quiz.length > 0 && (
          <div className="mt-8 mb-12">
            <QuizSection topicId={topicId} quiz={topic.quiz} />
          </div>
        )}
      </div>
    </div>
  );
}

function ContentComingSoon() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="text-5xl" aria-hidden="true">🚧</div>
      <h1 className="text-2xl font-bold text-text-primary">Đang cập nhật (Coming soon)</h1>
      <p className="text-text-secondary max-w-sm">
        Topic này chưa được xuất bản. Quay lại sau nhé — chúng tôi đang làm!
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-btn bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-blue transition-colors duration-150 text-sm"
      >
        ← Quay lại tất cả topics
      </Link>
    </div>
  );
}
