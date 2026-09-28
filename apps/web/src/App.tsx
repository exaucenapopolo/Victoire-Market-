import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ToastProvider } from "@/components/ui/Toast";
import { HomePage } from "@/pages/HomePage";
import { SearchPage } from "@/pages/SearchPage";
import { ProductPage } from "@/pages/ProductPage";
import { StoresPage } from "@/pages/StoresPage";
import { StorePage } from "@/pages/StorePage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ConfirmationPage } from "@/pages/ConfirmationPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AccountPage } from "@/pages/AccountPage";
import { JeCherchePage } from "@/pages/JeCherchePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AnimatedOutlet } from "@/components/layout/AnimatedOutlet";

function Root() {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            element: <AnimatedOutlet />,
            children: [
              { path: "/", element: <HomePage /> },
              { path: "/recherche", element: <SearchPage /> },
              { path: "/produit/:id", element: <ProductPage /> },
              { path: "/boutiques", element: <StoresPage /> },
              { path: "/boutique/:id", element: <StorePage /> },
              { path: "/panier", element: <CartPage /> },
              { path: "/checkout", element: <CheckoutPage /> },
              { path: "/commande/:id", element: <ConfirmationPage /> },
              { path: "/connexion", element: <LoginPage /> },
              { path: "/inscription", element: <RegisterPage /> },
              { path: "/compte", element: <AccountPage /> },
              { path: "/je-cherche", element: <JeCherchePage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
