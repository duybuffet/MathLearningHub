import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '@/store/progress-store-with-persist';
import { SidebarNavigationTree } from './sidebar-navigation-tree';

export function MobileNavigationDrawer() {
  const sidebarOpen = useProgressStore((s) => s.sidebarOpen);
  const toggleSidebar = useProgressStore((s) => s.toggleSidebar);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    toggleSidebar(false);
  }, [location.pathname, toggleSidebar]);

  // Esc closes the drawer
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && toggleSidebar(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, toggleSidebar]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
            onClick={() => toggleSidebar(false)}
          />

          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col bg-bg-card shadow-2xl lg:hidden"
            aria-label="Điều hướng"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => toggleSidebar(false)}
              className="absolute right-3 top-[calc(0.875rem+env(safe-area-inset-top))] rounded-btn p-1.5 text-text-muted transition-colors hover:bg-bg-panel hover:text-text-primary"
              aria-label="Đóng điều hướng"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Any lesson link (even the current one) closes the drawer */}
            <div
              className="flex min-h-0 flex-1 flex-col"
              onClick={(e) => (e.target as HTMLElement).closest('a') && toggleSidebar(false)}
            >
              <SidebarNavigationTree />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
