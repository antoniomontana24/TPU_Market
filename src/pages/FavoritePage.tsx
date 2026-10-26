import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { ListingCard } from '../components/ListingCard';

export default function FavoritesPage() {
  const favorites = useFavorites();

  if (!favorites.items.length)
    return (
      <section className="state">
        <h1>В избранном пока пусто</h1>
        <p>Нажимайте ♡ на карточках товаров, чтобы сохранить их сюда.</p>
        <Link to="/" className="btn btn--green">Перейти в каталог</Link>
      </section>
    );

  return (
    <>
      <nav className="crumbs"><Link to="/">Главная</Link> / Избранное</nav>
      <h1 className="cart-title">Избранное <span className="tag">{favorites.items.length} товара</span></h1>
      <p className="muted">Нажмите ♡ на карточке, чтобы убрать из избранного</p>
      <div className="grid">
        {favorites.items.map((l) => <ListingCard key={l.id} l={l} />)}
      </div>
    </>
  );
}