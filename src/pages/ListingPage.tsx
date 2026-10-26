import { useEffect, useState } from 'react';
import { useListingsData } from '../context/ListingsContext'; 
import { Link, useParams } from 'react-router-dom';
import { fetchListingDetails, type ListingDetails } from '../api/listingDetails';
import { BuyBox, DealTerms } from '../components/BuyBox';
import { Gallery } from '../components/Gallery';
import { Reviews } from '../components/Reviews';
import { SellerCard } from '../components/SellerCard';
import { Specs } from '../components/Specs';
import '../styles/listing.css';

export default function ListingPage() {
  const { id } = useParams();
  const { all } = useListingsData();
  const [l, setL] = useState<ListingDetails | null | undefined>(undefined); 

useEffect(() => {
  let cancelled = false;
  setL(undefined);
  fetchListingDetails(Number(id), all) 
    .then((d) => !cancelled && setL(d))
    .catch(() => !cancelled && setL(null));
  return () => { cancelled = true; };
}, [id, all]);                                         

  if (l === undefined) return <p className="state">Загрузка…</p>;
  if (l === null) return <p className="state">Объявление не найдено. <Link to="/">В каталог</Link></p>;

  return (
    <>
      <nav className="crumbs"><Link to="/">Каталог</Link> / {l.category} / <b>{l.title}</b></nav>
      <div className="detail">
        <div className="detail__main">
          <Gallery images={l.images} dorm={l.dorm} />
          <div className="moderation"><b>Проверено AI-модератором ТПУ</b><br /><small>{l.moderation}</small></div>
          <Specs specs={l.specs} />
          <section className="panel">
            <h2>Описание от продавца</h2>
            <p>{l.longDescription}</p>
            <div className="seller-card__info"><b>Условия передачи и самовывоз:</b><br />{l.pickupNote}</div>
            <div className="map__canvas" role="img" aria-label="Точка встречи">
              <span className="map__dist">Точка встречи: Главный вход / Вахта {l.dorm.split(' (')[0]}</span>
            </div>
          </section>
          <Reviews seller={l.seller.name} rating={l.seller.rating} reviews={l.reviews} />
        </div>
        <aside className="detail__side">
          <BuyBox l={l} />
          <SellerCard l={l} />
          <DealTerms />
        </aside>
      </div>
    </>
  );
}
