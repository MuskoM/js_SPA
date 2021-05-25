## Celem projektu jest stworzenie aplikacji typu SPA (single page application).
Backend stanowi serwer RESTowy, udostępniający dane w postaci JSON (można wykorzystać json-server). Klient działający w przeglądarce komunikuje się z nim przy pomocy AJAX. Dozwolone (a nawet zalecane) jest korzystanie z javascriptowych bibliotek i frameworków (np. Angular, React, Vue, Bakcbone, Knockout, Ember). 
### Aplikacja powinna pozwalać na przeglądanie, dodawanie, usuwanie oraz edycję danych.
Rodzaj tych danych należy określić samemu, trzymając się ogólnych wytycznych (liczby w nawiasach oznaczają punktację, maksymalnie można zdobyć za projekt 10 punktów):  
**Obowiązkowa podstawa** (3): CRUD do pojedynczej tabeli (np. książki, pracownicy, zakupy, piosenki), jej rekordy powinny mieć co najmniej 5 pól (użyj paru różnych typów, np. tekst, liczba, data)
- przynajmniej dwie tabele połączone relacją jeden-do-wielu (np. autor-książki, rejon-pracownicy, zamówienie-produkty) (+1) 
   - jeśli w powyższym wystąpi relacja wiele-do-wielu (np. książka może mieć wielu autorów, pracownik może być przypisany do wielu rejonów) (dodatkowo +1) 
- użytkownik ma możliwość sortowania (wg. dwóch czy trzech kryteriów) (+1) 
- użytkownik ma możliwość wyszukiwania/filtrowania danych (np. "pokaż książki o tytule zaczynającym się od ...", "pokaż wszystkie książki danego autora") (+1)
- zaimplementowano poprawnie działający routing po stronie klienta (+1) 
- bardziej złożona niż sam CRUD logika, pasująca do tematu projektu (+1) 
- wysoki user experience (wygoda, atrakcyjność, obecność grafik i animacji, responsywność) (+1) 
- wszelkie inne sensowne i nietrywialne dodatki wzbogacające aplikację (+1) 