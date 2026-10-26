import { Link, useSearchParams } from 'react-router-dom';
import { CreateListingForm } from '../components/CreateListingForm';
import { useListingsData } from '../context/ListingsContext';

export default function CreateListingPage() {
  const [params] = useSearchParams();
  const ctx = useListingsData();
  const editId = params.get('edit');
  const initial = editId ? ctx.get(Number(editId)) : undefined;

  return (
    <>
      <nav className="crumbs"><Link to="/profile">Личный кабинет</Link> / {initial ? 'Редактирование' : 'Подать объявление'}</nav>
      <h1 className="cart-title">{initial ? 'Редактирование объявления' : 'Подать объявление'}</h1>
      <CreateListingForm initial={initial} />
    </>
  );
}