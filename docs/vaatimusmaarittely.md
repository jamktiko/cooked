### Cooked - Ryhmä 7 - Eetu, Janika, Mikael, Essi

# Vaatimusmäärittely

- [Vaatimusmäärittely](#vaatimusmäärittely)
  - [Kuvaus ja tavoitteet](#kuvaus-ja-tavoitteet)
  - [Ydintoiminnot ja -ominaisuudet](#ydintoiminnot-ja--ominaisuudet)
    - [Toiminnalliset vaatimukset](#toiminnalliset-vaatimukset)
    - [Ei-toiminnalliset vaatimukset](#ei--toiminnalliset-vaatimukset)
    - [Käyttöympäristö](#käyttöympäristö)

## Kuvaus ja tavoitteet

Kehitämme sovellusta, joka modernisoi perinteisen reseptikirjan ja tuo siihen mukaan pelillisiä sekä sosiaalisia elementtejä. Järjestelmän teknisenä selkärankana toimivat kattavat CRUD-toiminnallisuudet (Create, Read, Update, Delete), joiden avulla käyttäjä voi vaivatta tallentaa omia luomuksiaan, muokata niitä ja poistaa vanhentuneita reseptejä. Tavoitteena on, että käyttäjän ei enää tarvitse etsiä kadonneita paperilappuja tai selailla kuvakaappauksia puheli-men galleriasta, vaan kaikki kulkee mukana yhdessä paikassa.

Sovelluksen erottuvin ominaisuus on "Swipe & Like" -toiminnallisuus, joka on saanut inspiraa-tionsa nykyaikaisista deittisovelluksista. Käyttäjä voi selata uusia reseptejä pyyhkäisemällä niitä joko oikealle (suosikki) tai vasemmalle (hylkäys). Tämä tekee uusien ruokien löytämisestä haus-kaa ja intuitiivista. Lisäksi sovellus sisältää arvontaominaisuuden, joka ratkaisee "mitä tänään syötäisiin?" -ongelman valitsemalla käyttäjän tallentamista resepteistä satunnaisen suosituk-sen.

## Ydintoiminnot ja -ominaisuudet

Sovelluksen ydintoimintoja ovat:

- Ruokien tallennus sekä mahdollisesti voi lisätä ruokia suosikiksi ja jakaa.
- Sovellus ehdottaa ruokia “random”-napista
- Sovelluksessa on Tinder-tyylinen swaippausmekaniikka
- Muiden ihmisten ruokien etsiminen ja profiili
- CRUD-toiminnallisuudet (Lisäys, poista ja muokkaaminen)

### Toiminnalliset vaatimukset

- Reseptien lisääminen, poisto, näyttäminen ja päivitys
- Muiden ihmisten tekemien reseptien selaaminen
- Asiakastilit ja niihin liittyvät toiminnot
- Pyyhkäisyliittymä, käyttäjä voi hyväksyä tai hylätä reseptiehdotuksen
- Sovelluksen pitää toimia vähintään viisi vuotta vanhalla mobiililaitteella

### Ei-toiminnalliset vaatimukset

- Suorituskyky: Ei hidastele, esim. kun uusia kuvia lataa kun reseptejä swaippaa
- Käytettävyys: Puhelimella on helppo käyttää sovellusta (esim yhdellä peukalolla)
- Saavutettavuus: Tekstien ja taustan kontrastin on täytettävä WCAG 2.1 AA-taso (Voidaan tarkistaa esim Figmalla).
- Tietoturva: Käyttäjätiedot ja salasanat on tallennettava kryptatussa muodossa tietokantaan.

### Käyttöympäristö

- Sovellus on suunniteltu ensisijaisesti mobiililaitteille (iOS ja Android), sillä käyttö perustuu vahvasti kosketusnäytön eleisiin. Sitä käytetään tilanteissa, joissa päätöksenteko on vaikeaa (esim. kaupassa tai kotona nälän yllättäessä).
