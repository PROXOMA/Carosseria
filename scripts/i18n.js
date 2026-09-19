(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CarosseriaI18n = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SUPPORTED_LANGUAGES = Object.freeze(['pl', 'en', 'fr', 'uk', 'ru', 'de', 'lt']);
  const STORAGE_KEY = 'carosseria-language';

  const pl = {
    'meta.description': 'CAROSSERIA — samochodowe części blacharskie: drzwi, maski, błotniki, zderzaki i kratki.',
    'meta.ogDescription': 'Sprawdzone używane części blacharskie do samochodów. Wybierz markę, model i rocznik auta.',
    'meta.title': 'CAROSSERIA | Części blacharskie',
    'nav.aria': 'Główna nawigacja', 'nav.menuAria': 'Menu główne', 'nav.skip': 'Przejdź do treści',
    'nav.shops': 'Gdzie kupić', 'nav.offer': 'Oferta', 'nav.contact': 'Kontakt', 'nav.language': 'Wybierz język',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Części blacharskie do samochodów', 'hero.title1': 'Przywracamy', 'hero.title2': 'autu', 'hero.titleEm': 'formę.',
    'hero.lead': 'Drzwi, maski, błotniki, zderzaki i kratki. Sprawdzone części, konkretna obsługa i pomoc w dobraniu właściwego elementu.',
    'hero.offerButton': 'Zobacz ofertę →', 'hero.visitButton': 'Odwiedź nas osobiście ↓',
    'features.aria': 'Najważniejsze informacje', 'features.checked': 'Sprawdzone', 'features.checkedText': 'części używane', 'features.fit': 'Dobór', 'features.fitText': 'do modelu auta',
    'features.easy': 'Wygodne', 'features.easyText': 'zakupy online', 'features.pickup': 'Możliwy', 'features.pickupText': 'odbiór osobisty',
    'shops.label': 'Kupuj tak, jak Ci wygodnie', 'shops.title': 'Znajdź część', 'shops.titleEm': 'online.',
    'shops.text': 'Naszą aktualną ofertę znajdziesz na popularnych portalach motoryzacyjnych.',
    'shops.allegroSmall': 'SKLEP INTERNETOWY ↗', 'shops.allegroText': 'Zobacz nasze aukcje', 'shops.ovokoSmall': 'CZĘŚCI SAMOCHODOWE ↗', 'shops.ovokoText': 'Przejdź do oferty',
    'offer.label': 'Nasza oferta', 'offer.title': 'To, czego potrzebuje', 'offer.titleEm': 'nadwozie.',
    'offer.text': 'Skupiamy się na elementach blacharskich i częściach zewnętrznych. Dzięki temu wiemy, na co zwrócić uwagę przy wyborze.',
    'offer.doors': 'Drzwi', 'offer.doorsText': 'Kompletne oraz poszycia do wielu popularnych modeli.',
    'offer.hoods': 'Maski', 'offer.hoodsText': 'Starannie wyselekcjonowane elementy gotowe do montażu.',
    'offer.fenders': 'Błotniki', 'offer.fendersText': 'Lewe i prawe, dopasowane do konkretnej wersji nadwozia.',
    'offer.bumpers': 'Zderzaki i kratki', 'offer.bumpersText': 'Przody, tyły oraz kratki i elementy uzupełniające.',
    'gallery.label': 'Przykładowe części', 'gallery.title': 'Zobacz je', 'gallery.titleEm': 'z bliska.',
    'gallery.text': 'Każda część jest fotografowana, opisywana i oceniana przed wystawieniem w sprzedaży.',
    'gallery.alt1': 'Zielony błotnik samochodowy', 'gallery.alt2': 'Niebieski błotnik samochodowy', 'gallery.alt3': 'Czarny błotnik samochodowy', 'gallery.caption': 'Element blacharski',
    'order.label': 'Prosty zakup', 'order.title': 'Jak dobrać', 'order.titleEm': 'część?',
    'order.text': 'Wyślij markę, model, rok produkcji. Pomożemy sprawdzić, czy wybrany element będzie pasował.',
    'order.step1': 'Podaj dane samochodu', 'order.step1Text': 'Marka, model, rocznik.', 'order.step2': 'Potwierdzimy część', 'order.step2Text': 'Sprawdzimy wersję i zgodność elementu.',
    'order.step3': 'Wybierz odbiór', 'order.step3Text': 'Wysyłka kurierska lub odbiór osobisty.',
    'order.shipping': 'Wysyłka', 'order.shippingText': 'na terenie całej Polski i całej Unii Europejskiej.', 'order.pickup': 'Odbiór', 'order.pickupText': 'osobisty po potwierdzeniu',
    'order.condition': 'Stan części', 'order.conditionText': 'opisany i pokazany na zdjęciach',
    'contact.label': 'Kontakt', 'contact.title': 'Napisz do', 'contact.titleEm': 'nas.',
    'contact.text': 'Zapytaj o dostępność części lub umów odbiór osobisty. Odpowiemy na podany adres e-mail.',
    'contact.addressLabel': 'Adres firmy:', 'contact.hours': 'Godziny otwarcia', 'contact.hoursText': 'poniedziałek–sobota: 8:00–16:00',
    'contact.whatsappAria': 'Napisz do CAROSSERIA na WhatsApp', 'contact.whatsappAlt': 'Napisz do nas na WhatsApp',
    'form.email': 'E-mail', 'form.emailPlaceholder': 'twoj@email.pl', 'form.subject': 'Tytuł wiadomości', 'form.subjectPlaceholder': 'Np. zapytanie o błotnik',
    'form.brand': 'Marka pojazdu', 'form.brandPlaceholder': 'Np. Volvo', 'form.model': 'Model pojazdu', 'form.modelPlaceholder': 'Np. V60',
    'form.year': 'Rocznik', 'form.yearPlaceholder': 'Np. 2018', 'form.bodyType': 'Typ nadwozia', 'form.bodyTypePlaceholder': 'Np. Kombi',
    'form.engine': 'Pojemność silnika i rodzaj paliwa', 'form.enginePlaceholder': 'Np. 2.0 Diesel',
    'form.message': 'Treść wiadomości', 'form.messagePlaceholder': 'Napisz, jakiej części szukasz...', 'form.submit': 'Wyślij wiadomość →',
    'status.sending': 'Wysyłanie wiadomości…', 'status.success': 'Dziękujemy. Wiadomość została wysłana.', 'status.error': 'Nie udało się wysłać wiadomości. Sprawdź połączenie i spróbuj ponownie.',
    'map.title': 'Mapa z lokalizacją CAROSSERIA w Rokitnie 113', 'map.route': 'Wyznacz trasę ↗',
    'footer.text': 'Części, które pasują. Obsługa, na której możesz polegać.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const en = {
    'meta.description': 'CAROSSERIA — automotive body parts: doors, bonnets, wings, bumpers and grilles.', 'meta.ogDescription': 'Quality-checked used body parts. Tell us your vehicle make, model and year.', 'meta.title': 'CAROSSERIA | Automotive body parts',
    'nav.aria': 'Main navigation', 'nav.menuAria': 'Main menu', 'nav.skip': 'Skip to content', 'nav.shops': 'Where to buy', 'nav.offer': 'Products', 'nav.contact': 'Contact', 'nav.language': 'Choose language',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Automotive body parts', 'hero.title1': 'We bring', 'hero.title2': 'your car back into', 'hero.titleEm': 'shape.', 'hero.lead': 'Doors, bonnets, wings, bumpers and grilles. Checked parts, straightforward service and help choosing the right item.', 'hero.offerButton': 'See our products →', 'hero.visitButton': 'Visit us in person ↓',
    'features.aria': 'Key information', 'features.checked': 'Checked', 'features.checkedText': 'used parts', 'features.fit': 'Matched', 'features.fitText': 'to your car model', 'features.easy': 'Easy', 'features.easyText': 'online shopping', 'features.pickup': 'Available', 'features.pickupText': 'personal collection',
    'shops.label': 'Buy the way that suits you', 'shops.title': 'Find your part', 'shops.titleEm': 'online.', 'shops.text': 'Our current range is available on popular automotive marketplaces.', 'shops.allegroSmall': 'ONLINE STORE ↗', 'shops.allegroText': 'View our listings', 'shops.ovokoSmall': 'CAR PARTS ↗', 'shops.ovokoText': 'Browse our range',
    'offer.label': 'Our products', 'offer.title': 'Everything the', 'offer.titleEm': 'body needs.', 'offer.text': 'We focus on body panels and exterior parts, so we know what matters when choosing one.', 'offer.doors': 'Doors', 'offer.doorsText': 'Complete doors and skins for many popular models.', 'offer.hoods': 'Bonnets', 'offer.hoodsText': 'Carefully selected parts ready to fit.', 'offer.fenders': 'Wings', 'offer.fendersText': 'Left and right, matched to the exact body version.', 'offer.bumpers': 'Bumpers and grilles', 'offer.bumpersText': 'Fronts, rears, grilles and supplementary parts.',
    'gallery.label': 'Sample parts', 'gallery.title': 'Take a', 'gallery.titleEm': 'closer look.', 'gallery.text': 'Every part is photographed, described and assessed before it is listed for sale.', 'gallery.alt1': 'Green car wing', 'gallery.alt2': 'Blue car wing', 'gallery.alt3': 'Black car wing', 'gallery.caption': 'Body panel',
    'order.label': 'Simple purchase', 'order.title': 'How to match a', 'order.titleEm': 'part?', 'order.text': 'Send the make, model and year. We will help confirm whether the selected part fits.', 'order.step1': 'Send vehicle details', 'order.step1Text': 'Make, model and year.', 'order.step2': 'We confirm the part', 'order.step2Text': 'We check the version and compatibility.', 'order.step3': 'Choose delivery', 'order.step3Text': 'Courier delivery or personal collection.', 'order.shipping': 'Shipping', 'order.shippingText': 'throughout Poland and the European Union.', 'order.pickup': 'Collection', 'order.pickupText': 'in person after confirmation', 'order.condition': 'Part condition', 'order.conditionText': 'described and shown in photos',
    'contact.label': 'Contact', 'contact.title': 'Write to', 'contact.titleEm': 'us.', 'contact.text': 'Ask about part availability or arrange collection. We will reply to your email address.', 'contact.addressLabel': 'Company address:', 'contact.hours': 'Opening hours', 'contact.hoursText': 'Monday–Saturday: 8:00–16:00', 'contact.whatsappAria': 'Message CAROSSERIA on WhatsApp', 'contact.whatsappAlt': 'Message us on WhatsApp',
    'form.email': 'Email', 'form.emailPlaceholder': 'you@example.com', 'form.subject': 'Message subject', 'form.subjectPlaceholder': 'E.g. enquiry about a wing', 'form.brand': 'Vehicle make', 'form.brandPlaceholder': 'E.g. Volvo', 'form.model': 'Vehicle model', 'form.modelPlaceholder': 'E.g. V60', 'form.year': 'Year', 'form.yearPlaceholder': 'E.g. 2018', 'form.bodyType': 'Body type', 'form.bodyTypePlaceholder': 'E.g. Estate', 'form.engine': 'Engine capacity and fuel type', 'form.enginePlaceholder': 'E.g. 2.0 Diesel', 'form.message': 'Message', 'form.messagePlaceholder': 'Tell us which part you need...', 'form.submit': 'Send message →',
    'status.sending': 'Sending your message…', 'status.success': 'Thank you. Your message has been sent.', 'status.error': 'We could not send your message. Check your connection and try again.', 'map.title': 'Map showing CAROSSERIA at Rokitno 113', 'map.route': 'Get directions ↗', 'footer.text': 'Parts that fit. Service you can rely on.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const fr = {
    'meta.description': 'CAROSSERIA — pièces de carrosserie automobile : portes, capots, ailes, pare-chocs et grilles.', 'meta.ogDescription': 'Pièces de carrosserie d’occasion contrôlées. Indiquez la marque, le modèle et l’année.', 'meta.title': 'CAROSSERIA | Pièces de carrosserie',
    'nav.aria': 'Navigation principale', 'nav.menuAria': 'Menu principal', 'nav.skip': 'Aller au contenu', 'nav.shops': 'Où acheter', 'nav.offer': 'Offre', 'nav.contact': 'Contact', 'nav.language': 'Choisir la langue',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Pièces de carrosserie automobile', 'hero.title1': 'Nous redonnons', 'hero.title2': 'sa forme à votre', 'hero.titleEm': 'voiture.', 'hero.lead': 'Portes, capots, ailes, pare-chocs et grilles. Des pièces contrôlées, un service concret et une aide au choix.', 'hero.offerButton': 'Voir notre offre →', 'hero.visitButton': 'Nous rendre visite ↓',
    'features.aria': 'Informations principales', 'features.checked': 'Contrôlées', 'features.checkedText': 'pièces d’occasion', 'features.fit': 'Adaptées', 'features.fitText': 'au modèle du véhicule', 'features.easy': 'Faciles', 'features.easyText': 'achats en ligne', 'features.pickup': 'Possible', 'features.pickupText': 'retrait sur place',
    'shops.label': 'Achetez comme vous le souhaitez', 'shops.title': 'Trouvez votre pièce', 'shops.titleEm': 'en ligne.', 'shops.text': 'Notre offre actuelle est disponible sur des plateformes automobiles populaires.', 'shops.allegroSmall': 'BOUTIQUE EN LIGNE ↗', 'shops.allegroText': 'Voir nos annonces', 'shops.ovokoSmall': 'PIÈCES AUTO ↗', 'shops.ovokoText': 'Voir notre offre',
    'offer.label': 'Notre offre', 'offer.title': 'Tout ce dont la', 'offer.titleEm': 'carrosserie a besoin.', 'offer.text': 'Nous sommes spécialisés dans les éléments de carrosserie et les pièces extérieures.', 'offer.doors': 'Portes', 'offer.doorsText': 'Portes complètes et panneaux pour de nombreux modèles.', 'offer.hoods': 'Capots', 'offer.hoodsText': 'Éléments soigneusement sélectionnés, prêts à monter.', 'offer.fenders': 'Ailes', 'offer.fendersText': 'Gauche et droite, adaptées à la version de carrosserie.', 'offer.bumpers': 'Pare-chocs et grilles', 'offer.bumpersText': 'Avant, arrière, grilles et éléments complémentaires.',
    'gallery.label': 'Exemples de pièces', 'gallery.title': 'Regardez-les', 'gallery.titleEm': 'de près.', 'gallery.text': 'Chaque pièce est photographiée, décrite et évaluée avant sa mise en vente.', 'gallery.alt1': 'Aile automobile verte', 'gallery.alt2': 'Aile automobile bleue', 'gallery.alt3': 'Aile automobile noire', 'gallery.caption': 'Élément de carrosserie',
    'order.label': 'Achat simple', 'order.title': 'Comment choisir la', 'order.titleEm': 'pièce ?', 'order.text': 'Envoyez la marque, le modèle et l’année. Nous vérifierons la compatibilité.', 'order.step1': 'Indiquez le véhicule', 'order.step1Text': 'Marque, modèle et année.', 'order.step2': 'Nous confirmons la pièce', 'order.step2Text': 'Nous vérifions la version et la compatibilité.', 'order.step3': 'Choisissez la livraison', 'order.step3Text': 'Livraison par transporteur ou retrait.', 'order.shipping': 'Livraison', 'order.shippingText': 'dans toute la Pologne et l’Union européenne.', 'order.pickup': 'Retrait', 'order.pickupText': 'sur place après confirmation', 'order.condition': 'État de la pièce', 'order.conditionText': 'décrit et présenté en photos',
    'contact.label': 'Contact', 'contact.title': 'Écrivez-', 'contact.titleEm': 'nous.', 'contact.text': 'Demandez la disponibilité d’une pièce ou organisez un retrait. Nous répondrons par e-mail.', 'contact.addressLabel': 'Adresse :', 'contact.hours': 'Horaires', 'contact.hoursText': 'lundi–samedi : 8:00–16:00', 'contact.whatsappAria': 'Écrire à CAROSSERIA sur WhatsApp', 'contact.whatsappAlt': 'Écrivez-nous sur WhatsApp',
    'form.email': 'E-mail', 'form.emailPlaceholder': 'vous@exemple.fr', 'form.subject': 'Objet du message', 'form.subjectPlaceholder': 'Ex. demande concernant une aile', 'form.brand': 'Marque du véhicule', 'form.brandPlaceholder': 'Ex. Volvo', 'form.model': 'Modèle du véhicule', 'form.modelPlaceholder': 'Ex. V60', 'form.year': 'Année', 'form.yearPlaceholder': 'Ex. 2018', 'form.bodyType': 'Type de carrosserie', 'form.bodyTypePlaceholder': 'Ex. Break', 'form.engine': 'Cylindrée et carburant', 'form.enginePlaceholder': 'Ex. 2.0 Diesel', 'form.message': 'Message', 'form.messagePlaceholder': 'Indiquez la pièce recherchée...', 'form.submit': 'Envoyer →',
    'status.sending': 'Envoi du message…', 'status.success': 'Merci. Votre message a été envoyé.', 'status.error': 'Impossible d’envoyer le message. Vérifiez la connexion et réessayez.', 'map.title': 'Carte de CAROSSERIA à Rokitno 113', 'map.route': 'Itinéraire ↗', 'footer.text': 'Des pièces adaptées. Un service fiable.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const uk = {
    'meta.description': 'CAROSSERIA — кузовні автозапчастини: двері, капоти, крила, бампери та решітки.', 'meta.ogDescription': 'Перевірені вживані кузовні деталі. Вкажіть марку, модель і рік автомобіля.', 'meta.title': 'CAROSSERIA | Кузовні запчастини',
    'nav.aria': 'Головна навігація', 'nav.menuAria': 'Головне меню', 'nav.skip': 'Перейти до вмісту', 'nav.shops': 'Де купити', 'nav.offer': 'Асортимент', 'nav.contact': 'Контакти', 'nav.language': 'Оберіть мову',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Кузовні автозапчастини', 'hero.title1': 'Повертаємо', 'hero.title2': 'автомобілю', 'hero.titleEm': 'форму.', 'hero.lead': 'Двері, капоти, крила, бампери та решітки. Перевірені деталі й допомога з правильним вибором.', 'hero.offerButton': 'Переглянути асортимент →', 'hero.visitButton': 'Відвідати нас ↓',
    'features.aria': 'Основна інформація', 'features.checked': 'Перевірені', 'features.checkedText': 'вживані деталі', 'features.fit': 'Підбір', 'features.fitText': 'до моделі авто', 'features.easy': 'Зручні', 'features.easyText': 'онлайн-покупки', 'features.pickup': 'Можливий', 'features.pickupText': 'самовивіз',
    'shops.label': 'Купуйте зручно', 'shops.title': 'Знайдіть деталь', 'shops.titleEm': 'онлайн.', 'shops.text': 'Наш актуальний асортимент доступний на популярних автомобільних майданчиках.', 'shops.allegroSmall': 'ІНТЕРНЕТ-МАГАЗИН ↗', 'shops.allegroText': 'Переглянути оголошення', 'shops.ovokoSmall': 'АВТОЗАПЧАСТИНИ ↗', 'shops.ovokoText': 'Перейти до асортименту',
    'offer.label': 'Наш асортимент', 'offer.title': 'Усе необхідне для', 'offer.titleEm': 'кузова.', 'offer.text': 'Ми спеціалізуємося на кузовних і зовнішніх деталях та знаємо, що важливо при виборі.', 'offer.doors': 'Двері', 'offer.doorsText': 'Комплектні двері та панелі для популярних моделей.', 'offer.hoods': 'Капоти', 'offer.hoodsText': 'Ретельно відібрані деталі, готові до встановлення.', 'offer.fenders': 'Крила', 'offer.fendersText': 'Ліві та праві, відповідно до версії кузова.', 'offer.bumpers': 'Бампери та решітки', 'offer.bumpersText': 'Передні, задні, решітки й додаткові елементи.',
    'gallery.label': 'Приклади деталей', 'gallery.title': 'Роздивіться', 'gallery.titleEm': 'зблизька.', 'gallery.text': 'Кожну деталь фотографують, описують і оцінюють перед продажем.', 'gallery.alt1': 'Зелене автомобільне крило', 'gallery.alt2': 'Синє автомобільне крило', 'gallery.alt3': 'Чорне автомобільне крило', 'gallery.caption': 'Кузовна деталь',
    'order.label': 'Проста покупка', 'order.title': 'Як підібрати', 'order.titleEm': 'деталь?', 'order.text': 'Надішліть марку, модель і рік. Ми допоможемо перевірити сумісність.', 'order.step1': 'Вкажіть дані авто', 'order.step1Text': 'Марка, модель і рік.', 'order.step2': 'Ми підтвердимо деталь', 'order.step2Text': 'Перевіримо версію та сумісність.', 'order.step3': 'Оберіть отримання', 'order.step3Text': 'Кур’єрська доставка або самовивіз.', 'order.shipping': 'Доставка', 'order.shippingText': 'по всій Польщі та Європейському Союзу.', 'order.pickup': 'Самовивіз', 'order.pickupText': 'після підтвердження', 'order.condition': 'Стан деталі', 'order.conditionText': 'описаний і показаний на фото',
    'contact.label': 'Контакти', 'contact.title': 'Напишіть', 'contact.titleEm': 'нам.', 'contact.text': 'Запитайте про наявність або домовтеся про самовивіз. Ми відповімо електронною поштою.', 'contact.addressLabel': 'Адреса компанії:', 'contact.hours': 'Години роботи', 'contact.hoursText': 'понеділок–субота: 8:00–16:00', 'contact.whatsappAria': 'Написати CAROSSERIA у WhatsApp', 'contact.whatsappAlt': 'Напишіть нам у WhatsApp',
    'form.email': 'Електронна пошта', 'form.emailPlaceholder': 'you@example.com', 'form.subject': 'Тема повідомлення', 'form.subjectPlaceholder': 'Напр. запит щодо крила', 'form.brand': 'Марка авто', 'form.brandPlaceholder': 'Напр. Volvo', 'form.model': 'Модель авто', 'form.modelPlaceholder': 'Напр. V60', 'form.year': 'Рік випуску', 'form.yearPlaceholder': 'Напр. 2018', 'form.bodyType': 'Тип кузова', 'form.bodyTypePlaceholder': 'Напр. Універсал', 'form.engine': 'Об’єм двигуна й паливо', 'form.enginePlaceholder': 'Напр. 2.0 Дизель', 'form.message': 'Повідомлення', 'form.messagePlaceholder': 'Напишіть, яку деталь ви шукаєте...', 'form.submit': 'Надіслати →',
    'status.sending': 'Надсилання повідомлення…', 'status.success': 'Дякуємо. Повідомлення надіслано.', 'status.error': 'Не вдалося надіслати повідомлення. Перевірте з’єднання й повторіть.', 'map.title': 'Карта CAROSSERIA, Rokitno 113', 'map.route': 'Прокласти маршрут ↗', 'footer.text': 'Деталі, що підходять. Сервіс, якому можна довіряти.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const ru = {
    'meta.description': 'CAROSSERIA — кузовные автозапчасти: двери, капоты, крылья, бамперы и решётки.', 'meta.ogDescription': 'Проверенные бывшие в употреблении кузовные детали. Укажите марку, модель и год.', 'meta.title': 'CAROSSERIA | Кузовные запчасти',
    'nav.aria': 'Главная навигация', 'nav.menuAria': 'Главное меню', 'nav.skip': 'Перейти к содержанию', 'nav.shops': 'Где купить', 'nav.offer': 'Ассортимент', 'nav.contact': 'Контакты', 'nav.language': 'Выберите язык',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Кузовные автозапчасти', 'hero.title1': 'Возвращаем', 'hero.title2': 'автомобилю', 'hero.titleEm': 'форму.', 'hero.lead': 'Двери, капоты, крылья, бамперы и решётки. Проверенные детали и помощь с выбором.', 'hero.offerButton': 'Смотреть ассортимент →', 'hero.visitButton': 'Посетить нас ↓',
    'features.aria': 'Основная информация', 'features.checked': 'Проверенные', 'features.checkedText': 'бывшие в употреблении детали', 'features.fit': 'Подбор', 'features.fitText': 'к модели автомобиля', 'features.easy': 'Удобные', 'features.easyText': 'онлайн-покупки', 'features.pickup': 'Возможен', 'features.pickupText': 'самовывоз',
    'shops.label': 'Покупайте как удобно', 'shops.title': 'Найдите деталь', 'shops.titleEm': 'онлайн.', 'shops.text': 'Наш актуальный ассортимент представлен на популярных автомобильных площадках.', 'shops.allegroSmall': 'ИНТЕРНЕТ-МАГАЗИН ↗', 'shops.allegroText': 'Смотреть объявления', 'shops.ovokoSmall': 'АВТОЗАПЧАСТИ ↗', 'shops.ovokoText': 'Перейти к ассортименту',
    'offer.label': 'Наш ассортимент', 'offer.title': 'Всё необходимое для', 'offer.titleEm': 'кузова.', 'offer.text': 'Мы специализируемся на кузовных и наружных деталях и знаем, что важно при выборе.', 'offer.doors': 'Двери', 'offer.doorsText': 'Двери в сборе и панели для популярных моделей.', 'offer.hoods': 'Капоты', 'offer.hoodsText': 'Тщательно отобранные детали, готовые к установке.', 'offer.fenders': 'Крылья', 'offer.fendersText': 'Левые и правые, под конкретную версию кузова.', 'offer.bumpers': 'Бамперы и решётки', 'offer.bumpersText': 'Передние, задние, решётки и дополнительные элементы.',
    'gallery.label': 'Примеры деталей', 'gallery.title': 'Рассмотрите', 'gallery.titleEm': 'поближе.', 'gallery.text': 'Каждая деталь фотографируется, описывается и оценивается перед продажей.', 'gallery.alt1': 'Зелёное автомобильное крыло', 'gallery.alt2': 'Синее автомобильное крыло', 'gallery.alt3': 'Чёрное автомобильное крыло', 'gallery.caption': 'Кузовная деталь',
    'order.label': 'Простая покупка', 'order.title': 'Как подобрать', 'order.titleEm': 'деталь?', 'order.text': 'Отправьте марку, модель и год. Мы поможем проверить совместимость.', 'order.step1': 'Укажите данные автомобиля', 'order.step1Text': 'Марка, модель и год.', 'order.step2': 'Мы подтвердим деталь', 'order.step2Text': 'Проверим версию и совместимость.', 'order.step3': 'Выберите получение', 'order.step3Text': 'Курьерская доставка или самовывоз.', 'order.shipping': 'Доставка', 'order.shippingText': 'по всей Польше и Европейскому союзу.', 'order.pickup': 'Самовывоз', 'order.pickupText': 'после подтверждения', 'order.condition': 'Состояние детали', 'order.conditionText': 'описано и показано на фото',
    'contact.label': 'Контакты', 'contact.title': 'Напишите', 'contact.titleEm': 'нам.', 'contact.text': 'Узнайте о наличии или договоритесь о самовывозе. Мы ответим по электронной почте.', 'contact.addressLabel': 'Адрес компании:', 'contact.hours': 'Часы работы', 'contact.hoursText': 'понедельник–суббота: 8:00–16:00', 'contact.whatsappAria': 'Написать CAROSSERIA в WhatsApp', 'contact.whatsappAlt': 'Напишите нам в WhatsApp',
    'form.email': 'Электронная почта', 'form.emailPlaceholder': 'you@example.com', 'form.subject': 'Тема сообщения', 'form.subjectPlaceholder': 'Напр. запрос о крыле', 'form.brand': 'Марка автомобиля', 'form.brandPlaceholder': 'Напр. Volvo', 'form.model': 'Модель автомобиля', 'form.modelPlaceholder': 'Напр. V60', 'form.year': 'Год выпуска', 'form.yearPlaceholder': 'Напр. 2018', 'form.bodyType': 'Тип кузова', 'form.bodyTypePlaceholder': 'Напр. Универсал', 'form.engine': 'Объём двигателя и топливо', 'form.enginePlaceholder': 'Напр. 2.0 Дизель', 'form.message': 'Сообщение', 'form.messagePlaceholder': 'Напишите, какую деталь вы ищете...', 'form.submit': 'Отправить →',
    'status.sending': 'Отправка сообщения…', 'status.success': 'Спасибо. Сообщение отправлено.', 'status.error': 'Не удалось отправить сообщение. Проверьте соединение и повторите.', 'map.title': 'Карта CAROSSERIA, Rokitno 113', 'map.route': 'Проложить маршрут ↗', 'footer.text': 'Подходящие детали. Надёжное обслуживание.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const de = {
    'meta.description': 'CAROSSERIA — Karosserieteile: Türen, Motorhauben, Kotflügel, Stoßfänger und Kühlergrills.', 'meta.ogDescription': 'Geprüfte gebrauchte Karosserieteile. Nennen Sie Marke, Modell und Baujahr.', 'meta.title': 'CAROSSERIA | Karosserieteile',
    'nav.aria': 'Hauptnavigation', 'nav.menuAria': 'Hauptmenü', 'nav.skip': 'Zum Inhalt springen', 'nav.shops': 'Wo kaufen', 'nav.offer': 'Angebot', 'nav.contact': 'Kontakt', 'nav.language': 'Sprache wählen',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Karosserieteile für Autos', 'hero.title1': 'Wir bringen', 'hero.title2': 'Ihr Auto in', 'hero.titleEm': 'Form.', 'hero.lead': 'Türen, Motorhauben, Kotflügel, Stoßfänger und Kühlergrills. Geprüfte Teile und Hilfe bei der richtigen Auswahl.', 'hero.offerButton': 'Angebot ansehen →', 'hero.visitButton': 'Besuchen Sie uns ↓',
    'features.aria': 'Wichtige Informationen', 'features.checked': 'Geprüfte', 'features.checkedText': 'Gebrauchtteile', 'features.fit': 'Passend', 'features.fitText': 'zum Fahrzeugmodell', 'features.easy': 'Bequem', 'features.easyText': 'online einkaufen', 'features.pickup': 'Möglich', 'features.pickupText': 'Abholung vor Ort',
    'shops.label': 'Kaufen Sie ganz bequem', 'shops.title': 'Finden Sie Ihr Teil', 'shops.titleEm': 'online.', 'shops.text': 'Unser aktuelles Angebot finden Sie auf beliebten Fahrzeugmarktplätzen.', 'shops.allegroSmall': 'ONLINE-SHOP ↗', 'shops.allegroText': 'Angebote ansehen', 'shops.ovokoSmall': 'AUTOTEILE ↗', 'shops.ovokoText': 'Zum Angebot',
    'offer.label': 'Unser Angebot', 'offer.title': 'Alles für die', 'offer.titleEm': 'Karosserie.', 'offer.text': 'Wir konzentrieren uns auf Karosserie- und Außenteile und wissen, worauf es bei der Auswahl ankommt.', 'offer.doors': 'Türen', 'offer.doorsText': 'Komplette Türen und Außenhäute für viele Modelle.', 'offer.hoods': 'Motorhauben', 'offer.hoodsText': 'Sorgfältig ausgewählte, einbaufertige Teile.', 'offer.fenders': 'Kotflügel', 'offer.fendersText': 'Links und rechts, passend zur Karosserieversion.', 'offer.bumpers': 'Stoßfänger und Grills', 'offer.bumpersText': 'Vorn, hinten, Grills und Ergänzungsteile.',
    'gallery.label': 'Beispielteile', 'gallery.title': 'Aus der', 'gallery.titleEm': 'Nähe.', 'gallery.text': 'Jedes Teil wird vor dem Verkauf fotografiert, beschrieben und bewertet.', 'gallery.alt1': 'Grüner Autokotflügel', 'gallery.alt2': 'Blauer Autokotflügel', 'gallery.alt3': 'Schwarzer Autokotflügel', 'gallery.caption': 'Karosserieteil',
    'order.label': 'Einfacher Kauf', 'order.title': 'Wie finde ich das', 'order.titleEm': 'richtige Teil?', 'order.text': 'Senden Sie Marke, Modell und Baujahr. Wir prüfen, ob das Teil passt.', 'order.step1': 'Fahrzeugdaten senden', 'order.step1Text': 'Marke, Modell und Baujahr.', 'order.step2': 'Wir bestätigen das Teil', 'order.step2Text': 'Wir prüfen Version und Kompatibilität.', 'order.step3': 'Lieferung wählen', 'order.step3Text': 'Kurierversand oder Abholung.', 'order.shipping': 'Versand', 'order.shippingText': 'in ganz Polen und der Europäischen Union.', 'order.pickup': 'Abholung', 'order.pickupText': 'nach Bestätigung', 'order.condition': 'Teilezustand', 'order.conditionText': 'beschrieben und auf Fotos gezeigt',
    'contact.label': 'Kontakt', 'contact.title': 'Schreiben Sie', 'contact.titleEm': 'uns.', 'contact.text': 'Fragen Sie nach der Verfügbarkeit oder vereinbaren Sie eine Abholung. Wir antworten per E-Mail.', 'contact.addressLabel': 'Firmenadresse:', 'contact.hours': 'Öffnungszeiten', 'contact.hoursText': 'Montag–Samstag: 8:00–16:00', 'contact.whatsappAria': 'CAROSSERIA auf WhatsApp schreiben', 'contact.whatsappAlt': 'Schreiben Sie uns auf WhatsApp',
    'form.email': 'E-Mail', 'form.emailPlaceholder': 'sie@beispiel.de', 'form.subject': 'Betreff', 'form.subjectPlaceholder': 'Z. B. Anfrage zu einem Kotflügel', 'form.brand': 'Fahrzeugmarke', 'form.brandPlaceholder': 'Z. B. Volvo', 'form.model': 'Fahrzeugmodell', 'form.modelPlaceholder': 'Z. B. V60', 'form.year': 'Baujahr', 'form.yearPlaceholder': 'Z. B. 2018', 'form.bodyType': 'Karosserieform', 'form.bodyTypePlaceholder': 'Z. B. Kombi', 'form.engine': 'Hubraum und Kraftstoff', 'form.enginePlaceholder': 'Z. B. 2.0 Diesel', 'form.message': 'Nachricht', 'form.messagePlaceholder': 'Welches Teil suchen Sie?', 'form.submit': 'Nachricht senden →',
    'status.sending': 'Nachricht wird gesendet…', 'status.success': 'Vielen Dank. Ihre Nachricht wurde gesendet.', 'status.error': 'Die Nachricht konnte nicht gesendet werden. Prüfen Sie die Verbindung und versuchen Sie es erneut.', 'map.title': 'Karte mit CAROSSERIA in Rokitno 113', 'map.route': 'Route planen ↗', 'footer.text': 'Teile, die passen. Service, auf den Sie sich verlassen können.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const lt = {
    'meta.description': 'CAROSSERIA — automobilių kėbulo dalys: durys, variklio dangčiai, sparnai, buferiai ir grotelės.', 'meta.ogDescription': 'Patikrintos naudotos kėbulo dalys. Nurodykite automobilio markę, modelį ir metus.', 'meta.title': 'CAROSSERIA | Kėbulo dalys',
    'nav.aria': 'Pagrindinė navigacija', 'nav.menuAria': 'Pagrindinis meniu', 'nav.skip': 'Pereiti prie turinio', 'nav.shops': 'Kur pirkti', 'nav.offer': 'Pasiūlymai', 'nav.contact': 'Kontaktai', 'nav.language': 'Pasirinkite kalbą',
    'hero.logoAlt': 'CAROSSERIA', 'hero.label': 'Automobilių kėbulo dalys', 'hero.title1': 'Grąžiname', 'hero.title2': 'automobiliui', 'hero.titleEm': 'formą.', 'hero.lead': 'Durys, variklio dangčiai, sparnai, buferiai ir grotelės. Patikrintos dalys ir pagalba renkantis.', 'hero.offerButton': 'Žiūrėti pasiūlymus →', 'hero.visitButton': 'Aplankykite mus ↓',
    'features.aria': 'Svarbiausia informacija', 'features.checked': 'Patikrintos', 'features.checkedText': 'naudotos dalys', 'features.fit': 'Parinkimas', 'features.fitText': 'pagal automobilio modelį', 'features.easy': 'Patogus', 'features.easyText': 'pirkimas internetu', 'features.pickup': 'Galimas', 'features.pickupText': 'atsiėmimas vietoje',
    'shops.label': 'Pirkite taip, kaip patogu', 'shops.title': 'Raskite dalį', 'shops.titleEm': 'internetu.', 'shops.text': 'Mūsų naujausius pasiūlymus rasite populiariose automobilių platformose.', 'shops.allegroSmall': 'INTERNETINĖ PARDUOTUVĖ ↗', 'shops.allegroText': 'Žiūrėti skelbimus', 'shops.ovokoSmall': 'AUTOMOBILIŲ DALYS ↗', 'shops.ovokoText': 'Pereiti prie pasiūlymų',
    'offer.label': 'Mūsų pasiūlymai', 'offer.title': 'Viskas, ko reikia', 'offer.titleEm': 'kėbului.', 'offer.text': 'Specializuojamės kėbulo ir išorės dalyse, todėl žinome, kas svarbu renkantis.', 'offer.doors': 'Durys', 'offer.doorsText': 'Komplektinės durys ir skardos daugeliui modelių.', 'offer.hoods': 'Variklio dangčiai', 'offer.hoodsText': 'Kruopščiai atrinktos montuoti paruoštos dalys.', 'offer.fenders': 'Sparnai', 'offer.fendersText': 'Kairieji ir dešinieji, tinkantys kėbulo versijai.', 'offer.bumpers': 'Buferiai ir grotelės', 'offer.bumpersText': 'Priekiniai, galiniai, grotelės ir papildomos dalys.',
    'gallery.label': 'Dalių pavyzdžiai', 'gallery.title': 'Pažvelkite', 'gallery.titleEm': 'iš arčiau.', 'gallery.text': 'Kiekviena dalis prieš pardavimą fotografuojama, aprašoma ir įvertinama.', 'gallery.alt1': 'Žalias automobilio sparnas', 'gallery.alt2': 'Mėlynas automobilio sparnas', 'gallery.alt3': 'Juodas automobilio sparnas', 'gallery.caption': 'Kėbulo dalis',
    'order.label': 'Paprastas pirkimas', 'order.title': 'Kaip parinkti', 'order.titleEm': 'dalį?', 'order.text': 'Atsiųskite markę, modelį ir metus. Padėsime patikrinti suderinamumą.', 'order.step1': 'Pateikite automobilio duomenis', 'order.step1Text': 'Markė, modelis ir metai.', 'order.step2': 'Patvirtinsime dalį', 'order.step2Text': 'Patikrinsime versiją ir suderinamumą.', 'order.step3': 'Pasirinkite pristatymą', 'order.step3Text': 'Kurjeris arba atsiėmimas vietoje.', 'order.shipping': 'Pristatymas', 'order.shippingText': 'visoje Lenkijoje ir Europos Sąjungoje.', 'order.pickup': 'Atsiėmimas', 'order.pickupText': 'vietoje po patvirtinimo', 'order.condition': 'Dalies būklė', 'order.conditionText': 'aprašyta ir parodyta nuotraukose',
    'contact.label': 'Kontaktai', 'contact.title': 'Parašykite', 'contact.titleEm': 'mums.', 'contact.text': 'Paklauskite apie dalį arba susitarkite dėl atsiėmimo. Atsakysime el. paštu.', 'contact.addressLabel': 'Įmonės adresas:', 'contact.hours': 'Darbo laikas', 'contact.hoursText': 'pirmadienis–šeštadienis: 8:00–16:00', 'contact.whatsappAria': 'Rašyti CAROSSERIA per WhatsApp', 'contact.whatsappAlt': 'Rašykite mums per WhatsApp',
    'form.email': 'El. paštas', 'form.emailPlaceholder': 'jūs@pavyzdys.lt', 'form.subject': 'Žinutės tema', 'form.subjectPlaceholder': 'Pvz. užklausa dėl sparno', 'form.brand': 'Automobilio markė', 'form.brandPlaceholder': 'Pvz. Volvo', 'form.model': 'Automobilio modelis', 'form.modelPlaceholder': 'Pvz. V60', 'form.year': 'Pagaminimo metai', 'form.yearPlaceholder': 'Pvz. 2018', 'form.bodyType': 'Kėbulo tipas', 'form.bodyTypePlaceholder': 'Pvz. Universalas', 'form.engine': 'Variklio tūris ir degalai', 'form.enginePlaceholder': 'Pvz. 2.0 Dyzelinas', 'form.message': 'Žinutė', 'form.messagePlaceholder': 'Parašykite, kokios dalies ieškote...', 'form.submit': 'Siųsti žinutę →',
    'status.sending': 'Žinutė siunčiama…', 'status.success': 'Ačiū. Žinutė išsiųsta.', 'status.error': 'Žinutės išsiųsti nepavyko. Patikrinkite ryšį ir bandykite dar kartą.', 'map.title': 'CAROSSERIA vietos Rokitno 113 žemėlapis', 'map.route': 'Rodyti maršrutą ↗', 'footer.text': 'Tinkančios dalys. Patikimas aptarnavimas.', 'footer.copyright': '© 2026 CAROSSERIA'
  };

  const translations = { pl, en, fr, uk, ru, de, lt };

  function normalizeLanguage(value) {
    const code = String(value || '').toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES.includes(code) ? code : 'pl';
  }

  function selectInitialLanguage(storage, browserLanguages) {
    try {
      const stored = storage && storage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
    } catch (_) {}
    for (const value of browserLanguages || []) {
      const raw = String(value || '').toLowerCase().split('-')[0];
      if (SUPPORTED_LANGUAGES.includes(raw)) return raw;
    }
    return 'pl';
  }

  function translate(language, key) {
    const selected = translations[normalizeLanguage(language)] || pl;
    return selected[key] ?? pl[key] ?? '';
  }

  function applyLanguage(document, language) {
    const selected = normalizeLanguage(language);
    document.documentElement.lang = selected;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      node.textContent = translate(selected, node.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(node => {
      const separator = node.dataset.i18nAttr.indexOf(':');
      if (separator < 1) return;
      const attribute = node.dataset.i18nAttr.slice(0, separator);
      const key = node.dataset.i18nAttr.slice(separator + 1);
      node.setAttribute(attribute, translate(selected, key));
    });
    document.querySelectorAll('[data-language]').forEach(button => {
      if (button.dataset.language === selected) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    return selected;
  }

  function initI18n(window) {
    const document = window.document;
    const initial = selectInitialLanguage(window.localStorage, window.navigator.languages || [window.navigator.language]);
    const setLanguage = (language, persist) => {
      const selected = applyLanguage(document, language);
      if (persist) {
        try { window.localStorage.setItem(STORAGE_KEY, selected); } catch (_) {}
      }
      const EventType = window.CustomEvent || function CustomEvent(type, options) { return { type, detail: options.detail }; };
      document.dispatchEvent(new EventType('carosseria:languagechange', { detail: { language: selected } }));
    };
    document.querySelectorAll('[data-language]').forEach(button => {
      button.addEventListener('click', () => setLanguage(button.dataset.language, true));
    });
    setLanguage(initial, false);
  }

  if (typeof window !== 'undefined' && window.document) {
    if (window.document.readyState === 'loading') window.document.addEventListener('DOMContentLoaded', () => initI18n(window));
    else initI18n(window);
  }

  return { SUPPORTED_LANGUAGES, translations, normalizeLanguage, selectInitialLanguage, translate, applyLanguage, initI18n };
});
