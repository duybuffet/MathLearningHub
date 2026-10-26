// Home: short intro, resume/review shortcuts, then the book-style table of contents.
import { ChapterTableOfContents } from '@/components/home/chapter-table-of-contents';
import { TodayReadingShortcuts } from '@/components/home/today-reading-shortcuts';

export function HomePage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-[2rem] leading-[1.15] text-text-primary sm:text-[2.5rem]">
          Toán nền cho
          <br />
          Khoa học Máy tính
        </h1>
        <p className="mt-4 max-w-xl text-text-secondary">
          Bảy chương toán mà lập trình viên gặp hằng ngày: từ logarit, xác suất đến Big-O. Mỗi bài
          giải thích bằng trực giác, có ví dụ giải từng bước, bài tập và thẻ ôn ngắt quãng.
        </p>
      </header>

      <TodayReadingShortcuts />

      <h2 className="mb-1 mt-12 text-sm text-text-muted">Mục lục</h2>
      <ChapterTableOfContents />
    </div>
  );
}
