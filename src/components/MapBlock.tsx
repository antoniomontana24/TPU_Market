interface Props {
  dorms: string[];
  walkMinutes?: number;
}

export function MapBlock({ dorms, walkMinutes = 6 }: Props) {
  if (dorms.length === 0) return null;
  return (
    <section className="mapblock">
      <div className="card__row">
        <h2>Карта передачи</h2>
        <small>{dorms.join(' · ')}</small>
      </div>
      <div className="map__canvas" role="img" aria-label="Схема расположения пунктов передачи">
        {dorms.map((d, i) => (
          <span key={d} className="map__pin" style={{ left: `${25 + i * 40}%`, top: `${30 + (i % 2) * 30}%` }}>{d}</span>
        ))}
        {dorms.length > 1 && <span className="map__dist">Расстояние между точками: {walkMinutes} минут пешком</span>}
      </div>
      <p className="muted"><small>Все пункты передачи находятся в пешей доступности от вашего общежития.</small></p>
    </section>
  );
}