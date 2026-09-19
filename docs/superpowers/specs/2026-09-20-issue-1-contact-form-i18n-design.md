# Issue #1: formularz kontaktowy i wielojęzyczność

## Cel

Przebudować statyczną stronę CAROSSERIA tak, aby formularz nie zależał od VehiclesDB, wszystkie dane pojazdu były wpisywane ręcznie, a cały widoczny interfejs obsługiwał języki PL, EN, FR, UK, RU, DE i LT pod jednym adresem URL.

## Zakres

- Zachować pojedynczy dokument `index.html` i jeden adres strony.
- Dodać przełącznik PL / EN / FR / UK / RU / DE / LT w prawym górnym rogu.
- Przy pierwszej wizycie wybrać obsługiwany język na podstawie `navigator.languages` lub `navigator.language`; w innym przypadku użyć polskiego.
- Zapisywać ręczny wybór w `localStorage` i traktować go jako ważniejszy od ustawienia przeglądarki.
- Przetłumaczyć całą widoczną treść, etykiety dostępności, teksty alternatywne, pola formularza i komunikaty statusu.
- Nie tłumaczyć nazwy CAROSSERIA, nazw Allegro i OVOKO, adresów, adresu e-mail ani numeru telefonu.
- Ustawić menu w kolejności: Gdzie kupić, Oferta, Kontakt.
- Zachować responsywność na komputerach, iPhone'ach i iPadach.

## Architektura tłumaczeń

Nowy plik `scripts/i18n.js` będzie zawierał słowniki dla siedmiu języków oraz logikę wyboru języka. Elementy HTML otrzymają stabilne atrybuty `data-i18n`; osobne atrybuty będą używane do tłumaczenia `placeholder`, `aria-label`, `alt` i innych wartości atrybutów.

Zmiana języka:

1. aktualizuje tekst i tłumaczone atrybuty bez przeładowania,
2. ustawia atrybut `lang` dokumentu (`uk` dla języka ukraińskiego),
3. oznacza aktywny przycisk przez `aria-current` i styl wizualny,
4. zapisuje ręczny wybór w `localStorage`,
5. odświeża bieżący komunikat formularza w wybranym języku.

Brakujący klucz w wybranym słowniku ma bezpiecznie korzystać z tekstu polskiego. Skrypt zostanie dołączony z `defer`, aby nie blokować parsowania dokumentu.

## Formularz kontaktowy

Formularz zachowa adres odbiorcy `carosseria-parts@wp.pl`, ale jego wysłanie obsłuży `scripts/contact-form.js` poprzez endpoint AJAX FormSubmit. Pola będą niezależnymi, wymaganymi kontrolkami:

- E-mail (`email`),
- Tytuł wiadomości (`Tytuł wiadomości`),
- Marka pojazdu (`Marka pojazdu`),
- Model pojazdu (`Model pojazdu`),
- Rocznik (`Rocznik`),
- Typ nadwozia (`Typ nadwozia`),
- Pojemność silnika i rodzaj paliwa (`Pojemność silnika i rodzaj paliwa`),
- Treść wiadomości (`Treść wiadomości`).

Nazwy przesyłanych pól pozostaną stałe i opisowe niezależnie od aktualnego języka interfejsu, dzięki czemu wiadomość e-mail będzie czytelna. Przeglądarkowa walidacja `required` i poprawności adresu e-mail odbędzie się przed wysłaniem.

Podczas wysyłania przycisk zostanie zablokowany, a obszar `role="status"` poinformuje o trwającej operacji. Kod uzna wysłanie za udane wyłącznie po poprawnej odpowiedzi endpointu. Po sukcesie wyczyści formularz i pokaże przetłumaczone potwierdzenie. Przy błędzie zachowa wpisane dane, ponownie włączy przycisk i pokaże zrozumiały, przetłumaczony komunikat.

## Usunięcie VehiclesDB

- Usunąć selecty marki, modelu i rocznika oraz pole warunkowe modelu.
- Usunąć notatkę o danych pojazdu.
- Usunąć odwołanie do `scripts/cars.js`.
- Usunąć stopkę „Vehicle data by VehiclesDB” i nieużywane style.
- Sam plik `scripts/cars.js` usunąć z projektu, ponieważ po zmianie nie będzie miał konsumenta.

## Układ i responsywność

Nagłówek zachowa istniejące zachowanie przyklejonego i kolorowego pasa. Przełącznik języka będzie umieszczony po prawej stronie na szerokich ekranach. Na wąskich ekranach zawinie się do osobnego, łatwego do dotknięcia rzędu bez poziomego przewijania. Kontrolki będą miały czytelny stan fokusu oraz co najmniej praktyczny obszar dotykowy.

Formularz pozostanie jednokolumnowy, aby wszystkie nowe pola zachowały czytelność na telefonach i tabletach.

## Błędy i bezpieczeństwo

- Jeżeli `localStorage` jest niedostępny, wybór języka nadal działa w bieżącej karcie.
- Nieobsługiwane lub niepoprawne kody języka wracają do PL.
- Teksty są podstawiane przez `textContent` lub bezpieczną aktualizację atrybutów, bez interpretowania HTML ze słownika.
- Błędy sieciowe i niepoprawne odpowiedzi FormSubmit nie są przedstawiane jako sukces.
- Wielokrotne wysłanie podczas trwającego żądania jest blokowane.

## Weryfikacja

- Testy jednostkowe logiki wyboru języka, fallbacku, zapisu wyboru i kompletności słowników.
- Testy DOM zmiany tekstów, atrybutu `lang` i stanu przełącznika.
- Testy formularza: komplet danych w żądaniu, sukces, błąd i blokada podwójnego wysłania.
- Statyczne sprawdzenie, że HTML nie odwołuje się do VehiclesDB ani `cars.js` oraz że kolejność menu jest prawidłowa.
- Kontrola wizualna szerokiego ekranu oraz rozmiarów odpowiadających iPhone'owi i iPadowi, wraz ze zmianą wszystkich siedmiu języków.

## Kryteria akceptacji

Zmiana jest ukończona, gdy wszystkie kryteria issue #1 są spełnione, każdy widoczny tekst interfejsu ma siedem wersji, formularz przesyła wszystkie osiem pól i rozróżnia sukces od błędu, a strona nie zawiera aktywnej zależności ani informacji o VehiclesDB.
