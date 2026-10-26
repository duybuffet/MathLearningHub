import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { useDueReviewCount } from '@/hooks/use-due-review-count';
import { SidebarNavigationTree } from './sidebar-navigation-tree';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

/** Hamburger icon */
function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Review link with the due count, shown in the top bar on every page. */
function ReviewLink() {
  const count = useDueReviewCount();
  return (
    <Link
      to="/review"
      className="flex items-center gap-2 rounded-btn px-2.5 py-1.5 text-sm text-text-secondary transition-colors hover:bg-bg-panel hover:text-text-primary"
    >
      Ôn tập
      {count > 0 && (
        <span className="rounded-full bg-accent-orange px-1.5 text-xs font-semibold tabular-nums leading-5 text-bg-primary">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export function AppLayoutShell() {
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);
  const { pathname } = useLocation();

  // New page → start at the top (router keeps scroll position otherwise).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border-subtle bg-bg-card lg:flex lg:flex-col">
        <SidebarNavigationTree />
      </aside>

      <MobileNavigationDrawer />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-primary/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="flex h-12 items-center gap-2 px-3 sm:px-5">
            <button
              onClick={() => toggleSidebar()}
              className="-ml-1 rounded-btn p-2 text-text-secondary transition-colors hover:bg-bg-panel hover:text-text-primary lg:hidden"
              aria-label="Mở mục lục"
            >
              <HamburgerIcon />
            </button>
            <Link to="/" className="font-serif text-base text-text-primary lg:hidden">
              <span className="mr-1 text-accent-orange">∑</span>Math Hub
            </Link>
            <div className="flex-1" />
            <ReviewLink />
          </div>
        </header>

        <main className="flex-1 px-4 pb-[calc(3rem+var(--safe-bottom))] pt-6 sm:px-6 lg:px-12 lg:pt-12">
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
