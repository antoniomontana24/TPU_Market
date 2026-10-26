const RULES = [
  { title: '1. Тест техники', text: 'Проверяйте работоспособность электроприборов в холле у дежурного вахтера или в комнате.' },
  { title: '2. Без предоплат', text: 'Передача денег (наличные или перевод через СБП) строго после личного визуального осмотра.' },
  { title: '3. Соседский манибэк', text: 'Гарантия 3 дня на выявление скрытых дефектов электроники между верифицированными студентами.' },
];

export function SafetyRules() {
  return (
    <section className="safety">
      <h2>Регламент безопасных студенческих сделок ТПУ</h2>
      <div className="safety__grid">
        {RULES.map((r) => (
          <div className="safety__item" key={r.title}>
            <strong>{r.title}</strong>
            <p className="muted">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}