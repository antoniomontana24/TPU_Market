import { Route, Routes, useNavigate } from 'react-router-dom';
import { CartPage } from './pages/CartPage';
import FavoritesPage from './pages/FavoritePage';
import { Layout } from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import ListingPage from './pages/ListingPage';
import CreateListingPage from './pages/CreateListingPage';
import ProfilePage from './pages/ProfilePage';
import ChatsPage from './pages/ChatsPage'; 
import NotificationsPage from './pages/NotificationsPage';

function CartRoute() {
  const nav = useNavigate();
  return <CartPage onBack={() => nav('/')} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="cart" element={<CartRoute />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="listing/:id" element={<ListingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/new" element={<CreateListingPage />} />
        <Route path="*" element={<p className="state">Страница не найдена</p>} />
      </Route>
    </Routes>
  );
}