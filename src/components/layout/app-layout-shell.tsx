import { Link, Outlet } from 'react-router-dom';
import { useMemo } from 'react';
import { useSrStore } from '@/store/spaced-repetition-store';
import { loadAuthoredTopics } from '@/lib/content-loader';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { SidebarNavigationTree } from './sidebar-navigation-tree';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

/** Badge showing total due items count (preserved from Phase 4). */
function DueBadge() {
  const srStore = useSrStore();
  const now = useMemo(() => new Date(Date.now()), []);

  const count = useMemo(() => {
    const topics = loadAuthoredTopics();
    let total = 0;
    for (const topic of topics) {
      total += srStore.dueFlashcardIds(topic.flashcards.map((f) => f.id), now).length;
      total += srStore.dueExerciseIds(topic.exercises.map((e) => e.id), now).length;
    }
    return total;
  }, [srStore, now]);

  if (count === 0) return null;

  return (
    <span className="ml-1.5 min-w-[18px] h-[18px] rounded-full bg-accent-orange text-bg-primary text-[10px] font-bold flex items-center justify-center px-1">
      {count > 99 ? '99+' : count}
    </span>
  );
}

/** Hamburger icon */
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AppLayoutShell() {
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border-subtle bg-bg-card lg:flex lg:flex-col">
        <SidebarNavigationTree />
      </aside>

      {/* Mobile drawer overlay */}
      <MobileNavigationDrawer />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Sticky top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-bg-card/90 px-4 py-3 backdrop-blur-sm">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => toggleSidebar()}
            className="rounded-btn p-1.5 text-text-secondary transition-colors hover:bg-bg-panel hover:text-text-primary lg:hidden"
            aria-label="Mở điều hướng"
          >
            <HamburgerIcon />
          </button>

          {/* Brand — visible on mobile (hidden on desktop since sidebar shows it) */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold no-underline text-text-primary hover:text-accent-orange transition-colors lg:hidden"
          >
            <span className="text-accent-orange">∑</span>
            <span>Math Hub</span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Review link + DueBadge — always visible */}
          <nav className="flex items-center">
            <Link
              to="/review"
              className="flex items-center text-sm text-text-muted hover:text-text-primary transition-colors no-underline"
            >
              Ôn hôm nay (Review)
              <DueBadge />
            </Link>
          </nav>
        </header>

        {/* Page content — readable max-width column */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
