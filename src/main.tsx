import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoriteContext';
import './styles/styles.css';
import { ListingsProvider } from './context/ListingsContext';
import { NotificationsProvider } from './context/NotificationsContext';
import { BookingsProvider } from './context/BookingsContext';
import { ChatProvider } from './context/ChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/studobmen">
      <CartProvider>
        <FavoritesProvider>
          <NotificationsProvider>
            <ListingsProvider>
              <BookingsProvider>
                <ChatProvider>
                  <App />
                </ChatProvider>
              </BookingsProvider>
            </ListingsProvider>
          </NotificationsProvider>
        </FavoritesProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);