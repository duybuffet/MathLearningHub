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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => toggleSidebar(false)}
          />

          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-bg-card shadow-2xl lg:hidden"
            aria-label="Điều hướng"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => toggleSidebar(false)}
              className="absolute right-3 top-4 rounded-btn p-1.5 text-text-muted transition-colors hover:bg-bg-panel hover:text-text-primary"
              aria-label="Đóng điều hướng"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div onClick={() => toggleSidebar(false)} className="h-full overflow-hidden">
              <SidebarNavigationTree />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
