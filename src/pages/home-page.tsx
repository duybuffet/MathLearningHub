// Home dashboard: hero + review CTA + continue card + 7 area collapsibles + overall progress.
import { useProgressStore } from '@/store/progress-store-with-persist';
import { getCurriculum } from '@/lib/content-loader';
import { overallCompletion } from '@/lib/completion-progress-helpers';
import { AreaSectionCollapsible } from '@/components/home/area-section-collapsible';
import { ReviewTodayCta } from '@/components/home/review-today-cta';
import { ContinueLearningCard } from '@/components/home/continue-learning-card';
import { ProgressBar } from '@/components/ui/progress-bar';

export function HomePage() {
  const curriculum = getCurriculum();
  const progress = useProgressStore((s) => s.progress);
  const { pct, read, total } = overallCompletion(curriculum, progress);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-card border border-border-subtle bg-bg-card p-6">
        <h1 className="text-2xl font-bold text-text-primary">
          Toán nền cho Khoa học Máy tính
          <span className="block text-base font-normal text-text-muted mt-1">
            Math Foundations for Computer Science
          </span>
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary text-sm leading-relaxed">
          Học lại toán cốt lõi cho CS — trực quan, có công thức (formula), đồ thị tương tác
          (interactive graph) và lặp lại ngắt quãng (spaced repetition) để nhớ lâu.
        </p>
        {total > 0 && (
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between text-xs text-text-muted mb-1.5">
              <span>Tiến độ tổng (Overall progress)</span>
              <span className="font-mono">{read}/{total} chủ đề · {pct}%</span>
            </div>
            <ProgressBar value={pct} />
          </div>
        )}
      </section>

      {/* Review CTA + Continue card — side by side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ReviewTodayCta />
        <ContinueLearningCard />
      </div>

      {/* Curriculum: 7 areas */}
      <section>
        <h2 className="text-lg font-bold text-text-primary mb-6">
          Chương trình học (Curriculum)
        </h2>
        {curriculum.areas.map((area, i) => (
          <AreaSectionCollapsible
            key={area.id}
            area={area}
            defaultOpen={i === 0}
          />
        ))}
      </section>
    </div>
  );
}
