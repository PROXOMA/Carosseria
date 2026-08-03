const categories = [
  {
    number: "01",
    name: "Drzwi",
    text: "Kompletne oraz poszycia do wielu popularnych modeli.",
    shape: "door",
  },
  {
    number: "02",
    name: "Maski",
    text: "Starannie wyselekcjonowane elementy gotowe do montażu.",
    shape: "hood",
  },
  {
    number: "03",
    name: "Błotniki",
    text: "Lewe i prawe, dopasowane do konkretnej wersji nadwozia.",
    shape: "fender",
  },
  {
    number: "04",
    name: "Zderzaki i kratki",
    text: "Przody, tyły oraz kratki i elementy uzupełniające.",
    shape: "bumper",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#start" aria-label="CAROSSERIA — strona główna">
          CAROSSERIA<span>.</span>
        </a>
        <nav aria-label="Główna nawigacja">
          <a href="#oferta">Oferta</a>
          <a href="#zakupy">Gdzie kupić</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
        <a className="header-cta" href="#zakupy">Sprawdź części <span>↗</span></a>
      </header>

      <section className="hero" id="start">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Części blacharskie do samochodów</p>
          <h1>Przywracamy<br />autu <em>formę.</em></h1>
          <p className="hero-lead">
            Drzwi, maski, błotniki, zderzaki i kratki. Sprawdzone części,
            konkretna obsługa i pomoc w dobraniu właściwego elementu.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#oferta">Zobacz ofertę <span>→</span></a>
            <a className="button text-button" href="#kontakt">Odwiedź nas osobiście <span>↘</span></a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="red-panel" />
          <div className="car-line">
            <div className="roof" />
            <div className="body-line" />
            <div className="wheel wheel-one" />
            <div className="wheel wheel-two" />
          </div>
          <div className="stamp">CZĘŚCI<br /><strong>NADWOZIA</strong></div>
          <p className="vertical-label">CAR BODY PARTS / POLSKA</p>
        </div>
      </section>

      <section className="trust-strip" aria-label="Najważniejsze informacje">
        <p><strong>Sprawdzone</strong><span>części używane</span></p>
        <p><strong>Dobór</strong><span>do modelu auta</span></p>
        <p><strong>Wygodne</strong><span>zakupy online</span></p>
        <p><strong>Możliwy</strong><span>odbiór osobisty</span></p>
      </section>

      <section className="offer section" id="oferta">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Nasza oferta</p>
            <h2>To, czego<br />potrzebuje <em>nadwozie.</em></h2>
          </div>
          <p>Skupiamy się na elementach blacharskich i częściach zewnętrznych. Dzięki temu wiemy, na co zwrócić uwagę przy wyborze.</p>
        </div>
        <div className="category-grid">
          {categories.map((item) => (
            <article className="category-card" key={item.name}>
              <div className={`part-shape ${item.shape}`}><i /></div>
              <span className="category-number">{item.number}</span>
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="buy section" id="zakupy">
        <div className="buy-intro">
          <p className="eyebrow light"><span /> Kupuj tak, jak Ci wygodnie</p>
          <h2>Znajdź część<br /><em>online.</em></h2>
          <p>Naszą aktualną ofertę znajdziesz na popularnych portalach motoryzacyjnych.</p>
        </div>
        <div className="marketplaces">
          <a href="https://allegro.pl" target="_blank" rel="noreferrer" className="market-card allegro">
            <span className="market-top">SKLEP INTERNETOWY <b>↗</b></span>
            <strong>allegro</strong>
            <span className="market-bottom">Zobacz nasze aukcje</span>
          </a>
          <a href="https://ovoko.pl" target="_blank" rel="noreferrer" className="market-card ovoko">
            <span className="market-top">CZĘŚCI SAMOCHODOWE <b>↗</b></span>
            <strong>OVOKO<span>.PL</span></strong>
            <span className="market-bottom">Przejdź do oferty</span>
          </a>
        </div>
      </section>

      <section className="visit section" id="kontakt">
        <div className="visit-number">05</div>
        <div className="visit-copy">
          <p className="eyebrow"><span /> Odbiór osobisty</p>
          <h2>Wolisz zobaczyć<br />część <em>na miejscu?</em></h2>
          <p>Zapraszamy do siedziby CAROSSERIA. Przed przyjazdem skontaktuj się z nami, aby potwierdzić dostępność wybranego elementu.</p>
        </div>
        <div className="address-card">
          <span className="pin">⌖</span>
          <p>ADRES FIRMY</p>
          <h3>CAROSSERIA</h3>
          <address>Adres do uzupełnienia<br />Polska</address>
          <a href="mailto:kontakt@carosseria.pl">kontakt@carosseria.pl <span>→</span></a>
        </div>
      </section>

      <footer>
        <a className="logo footer-logo" href="#start">CAROSSERIA<span>.</span></a>
        <p>Części, które pasują.<br />Obsługa, na której możesz polegać.</p>
        <div className="footer-links">
          <a href="#oferta">Oferta</a>
          <a href="https://allegro.pl" target="_blank" rel="noreferrer">Allegro</a>
          <a href="https://ovoko.pl" target="_blank" rel="noreferrer">Ovoko</a>
          <a href="#kontakt">Kontakt</a>
        </div>
        <span className="copyright">© 2026 CAROSSERIA</span>
      </footer>
    </main>
  );
}
