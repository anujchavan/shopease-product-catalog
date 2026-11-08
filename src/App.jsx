import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import ProductListPage from '@/pages/ProductListPage/ProductListPage';
import ErrorPage from '@/pages/ErrorPage';

// Code splitting: the detail page's code is only downloaded when a user opens a product
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage/ProductDetailPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ProductListPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      // Any unknown URL goes back to the listing
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
