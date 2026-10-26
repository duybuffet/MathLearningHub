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
import { LessonPrevNextNavigation } from '@/components/topic/lesson-prev-next-navigation';
import { lessonNumber } from '@/lib/topic-title-and-numbering';

export function TopicPage() {
  const { areaId, topicSlug } = useParams<{ areaId: string; topicSlug: string }>();

  // Resolve topic content from curriculum + content loader
  const entry = areaId && topicSlug ? findTopicEntry(areaId, topicSlug) : null;
  const topic = entry?.topic?.file ? loadTopicByFile(entry.topic.file) : null;

  const topicId = areaId && topicSlug ? topicIdFor(areaId, topicSlug) : '';
  const { markRead, setLastVisited } = useTopicProgress(topicId);

  const chapterTitle = areaId
    ? getCurriculum().areas.find((a) => a.id === areaId)?.title
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
    <article>
      <div>
        <TopicPageHeader
          title={topic.title}
          tagline={topic.tagline}
          readTime={topic.readTime}
          lessonNumber={lessonNumber(areaId!, topicSlug!)}
          chapterTitle={chapterTitle}
        />

        {/* Main content sections */}
        <SectionContentRenderer sections={topic.sections} />

        {/* Scroll sentinel — triggers markRead when visible */}
        <div ref={sentinelRef} aria-hidden="true" className="h-1" />

        {/* ── Thẻ ghi nhớ (Flashcards) ── */}
        {topic.flashcards.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 font-serif text-2xl text-text-primary">
              Thẻ ghi nhớ
            </h2>
            <FlashcardDeck
              key={topicId}
              cards={topic.flashcards.map((fc) => ({ topicId: topicId, card: fc }))}
            />
          </section>
        )}

        {/* ── Bài tập (Exercises) ── */}
        {topic.exercises.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 font-serif text-2xl text-text-primary">
              Bài tập
            </h2>
            <ExerciseList key={topicId} exercises={topic.exercises} flashcards={topic.flashcards} />
          </section>
        )}

        {/* Quiz */}
        {topic.quiz.length > 0 && (
          <section className="mt-14">
            <QuizSection key={topicId} topicId={topicId} quiz={topic.quiz} />
          </section>
        )}

        <LessonPrevNextNavigation areaId={areaId!} slug={topicSlug!} />
      </div>
    </article>
  );
}

function ContentComingSoon() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="font-serif text-2xl text-text-primary">Không tìm thấy bài này</h1>
      <p className="max-w-sm text-text-secondary">
        Đường dẫn có thể đã cũ. Mở mục lục để chọn bài khác.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-btn bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent-blue transition-colors duration-150 text-sm"
      >
        Mở mục lục
      </Link>
    </div>
  );
}
