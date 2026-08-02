import { Suspense, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { AppLoader } from "./components/AppLoader";
import { Home } from "./features/home/Home";
import { Shop } from "./features/products/Shop";
import { ProductEdit } from "./features/products/ProductEdit";
import { Cart } from "./features/cart/Cart";
import { Checkout } from "./features/checkout/Checkout";
import { Login } from "./features/auth/Login";
import { Register } from "./features/auth/Register";
import { Orders } from "./features/orders/Orders";
import { Dashboard } from "./features/admin/Dashboard";
import { ProfilePage } from "./features/profile/Profile";
import { AdminProducts } from "./features/products/AdminProducts";
import { ProductFormPage } from "./features/products/ProductFormPage";
import { AdminOrders } from "./features/orders/AdminOrders";
import { AdminCategories } from "./features/categories/AdminCategories";
import { AdminUsers } from "./features/admin/AdminUsers";
import { useRbac } from "./contexts";

function RootHome() {
  const { canAccessAdmin } = useRbac();
  return canAccessAdmin ? <Navigate to="/dashboard" replace /> : <Home />;
}

export default function App() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      {booting && <AppLoader onComplete={() => setBooting(false)} />}
      <div className={booting ? "pointer-events-none opacity-0" : "opacity-100"}>
        <Shell>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<RootHome />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/categories" element={<AdminCategories />} />
              <Route path="/admins" element={<AdminUsers />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<AdminProducts/>}/>
              <Route
                path="/products/:id/edit"
                element={<ProductEdit />}
              />
              <Route
                path="/products/new"
                element={<ProductFormPage/>}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Shell>
      </div>
    </>
  );
}
