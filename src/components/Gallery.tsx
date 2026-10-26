import { useState } from 'react';

export function Gallery({ images, dorm }: { images: string[]; dorm: string }) {
  const [i, setI] = useState(0);
  return (
    <section className="gallery">
      <div className="gallery__main">
        {images[i] ? <img src={images[i]} alt="" /> : <span aria-hidden>📦</span>}
        <span className="chip">{dorm}</span>
        {images.length > 0 && <span className="gallery__count">{images.length} фото</span>}
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs">
          {images.map((src, n) => (
            <button key={src} className={n === i ? 'is-active' : ''} onClick={() => setI(n)} aria-label={`Фото ${n + 1}`}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
