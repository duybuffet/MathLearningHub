import { createBrowserRouter } from 'react-router-dom';
import { AppLayoutShell } from './components/layout/app-layout-shell';
import { HomePage } from './pages/home-page';
import { TopicPage } from './pages/topic-page';
import { ReviewTodayPage } from './pages/review-today-page';
import { TopicDrillPage } from './pages/topic-drill-page';

// Route table: layout shell wraps all pages.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayoutShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'area/:areaId/:topicSlug', element: <TopicPage /> },
      { path: 'review', element: <ReviewTodayPage /> },
      { path: 'drill/:areaId/:topicSlug', element: <TopicDrillPage /> },
    ],
  },
]);
