# M31-AAAX4440G (Ebyte) — Streszczenie instrukcji obsługi
*Distributed I/O Master, M31 series User Manual V1.1-EN — Chengdu Ebyte Electronic Technology Co., Ltd.*

---

## 1. Opis produktu

M31-AAAX4440G to host rozproszonego modułu wejść/wyjść (Distributed IO Master) z serii M31, obsługujący jednocześnie **Modbus TCP** i **Modbus RTU**. Umożliwia jednoczesny dostęp 5 klientów oraz kody funkcyjne Modbus: 01/02/03/04/05/06/15/16.

Konstrukcja jest **modułowa/rozszerzalna** – do hosta można doklejać dodatkowe moduły IO (maks. **16 modułów rozszerzeń**), gdy standardowe I/O nie wystarczają, bez konieczności wymiany całego urządzenia.

**Konfiguracja M31-AAAX4440G:** 4×DI (wejścia cyfrowe) + 4×AI (wejścia analogowe, prąd jednostronny) + 4×DO (wyjścia przekaźnikowe).

### Pełna lista modeli serii M31
| Model | Specyfikacja |
|---|---|
| M31-AAAX4440G | 4DI+4AI(jednostronny prąd)+4DO |
| M31-AXXX8000G | 8DI |
| M31-XXAX0080G | 8DO |
| M31-AXAX4040G | 4DI+4DO |
| M31-AXXXA000G | 16DI |
| M31-XXAX00A0G | 16DO |
| M31-AXAX8080G | 8DI+8DO |
| M31-XAXX0800G | 8AI (jednostronny prąd) |
| M31-XXXA0008G | 8AO (wyjście prądowe) |
| M31-XAXA0404G | 4AI (jednostronny prąd)+4AO |
| M31-XFXX0800G | 8AI (różnicowy prąd) |
| M31-XGXX0800G | 8AI (różnicowy prąd) |

### Kluczowe cechy
- Standardowy Modbus RTU i Modbus TCP
- Współpraca z różnym oprogramowaniem konfiguracyjnym / PLC / panelami dotykowymi
- Akwizycja/sterowanie I/O przez RS485 oraz port sieciowy (do 5 hostów jednocześnie)
- Konfigurowalny adres Modbus
- Różnicowe wejście analogowe, rozdzielczość 16-bit, dokładność do 1‰, z izolacją zasilania
- 8 konfiguracji prędkości transmisji
- DHCP i statyczne IP
- Obsługa DNS i rozwiązywania nazw domenowych
- Montaż na szynie DIN + otwory montażowe

---

## 2. Szybki start (Chapter 2)

**Uwaga:** test należy wykonać na domyślnych parametrach fabrycznych.

### 2.1 Wymagany sprzęt
M31-AAAX4440G, zasilacz impulsowy 12V, konwerter USB–RS485, komputer PC, kabel sieciowy, przewody.

### 2.2 Podłączenia

**RS485:** V+/V- (zasilanie), 485-A/485-B (do A/B urządzenia docelowego). Zalecany rezystor terminujący 120Ω na końcu magistrali (dopasowanie impedancji, redukcja odbić sygnału).

**DI (wejście cyfrowe):** typ NPN/PNP, aktywne, zakres napięcia **tylko 12–24 V**, używane wspólnie z terminalem COM.

**AI (wejście analogowe):**
- Jednostronne (single-ended) prądowe: 0–20/4–20 mA, używane z COM sąsiadującego bloku.
- Różnicowe prądowe: 0–20/4–20 mA lub ±20 mA (AI+/AI-).
- Różnicowe napięciowe: 0–5/0–10 V (AI+/AI-).

**DO (wyjście przekaźnikowe):** RL do obciążenia, max **5A na pojedynczy przekaźnik**, max **8A łącznie na wspólny terminal COM**.

**AO (wyjście analogowe):** RL do obciążenia, 0–20/4–20 mA, GND jako powrót.

**Uruchomienie:** RS485 (USB↔RS485, A-A, B-B) → kabel sieciowy do RJ45 → zasilanie DC 12V (zakres 9–36V).

### 2.3 Konfiguracja parametrów
1. Zmień IP komputera na tę samą podsieć co urządzenie (np. 192.168.3.100, maska 255.255.255.0, brama 192.168.3.1) – IP musi się różnić od IP urządzenia. Jeśli brak połączenia – wyłącz zaporę sieciową.
2. W "network assistant" (np. NetAssist): tryb **TCP Client**, adres zdalnego hosta **192.168.3.7** (domyślny), port **502** (domyślny), tryb wysyłania **HEX**.

### 2.4 Testy sterowania

**Modbus TCP** — przykład: zamknięcie 1. przekaźnika DO:
```
01 00 00 00 00 06 01 05 00 00 FF 00
```
Inne komendy (nagłówek MBAP + PDU):
| Funkcja | Instrukcja (HEX) |
|---|---|
| Zamknij 1. cewkę (0x05) | 01 00 00 00 00 06 01 05 00 00 FF 00 |
| Otwórz w pełni 4×DO (0x0F) | 02 00 00 00 00 08 01 0F 00 00 00 04 01 0F |
| Zamknij w pełni 4×DO (0x0F) | 02 00 00 00 00 08 01 0F 00 00 00 04 01 00 |
| Odczyt statusu 4×DI (0x02) | 01 00 00 00 00 06 01 02 00 00 00 04 |
| Odczyt statusu 4×DO (0x01) | 01 00 00 00 00 06 01 01 00 00 00 04 |

**Modbus RTU** — przykład: zamknięcie 1. przekaźnika DO:
```
01 05 00 00 FF 00 8C 3A
```
| Funkcja | Instrukcja (HEX + CRC) |
|---|---|
| Zamknij 1. cewkę (0x05) | 01 05 00 00 FF 00 8C 3A |
| Otwórz w pełni 4×DO (0x0F) | 01 0F 00 00 00 04 01 0F 7E 92 |
| Zamknij w pełni 4×DO (0x0F) | 01 0F 00 00 00 04 01 00 3E 96 |
| Odczyt statusu 4×DI (0x02) | 01 02 00 00 00 04 79 C9 |
| Odczyt statusu 4×DO (0x01) | 01 01 00 00 00 04 3D C9 |

---

## 3. Parametry techniczne (Chapter 3)

### 3.1 Specyfikacje ogólne
| Kategoria | Parametr | Wartość |
|---|---|---|
| Zasilanie | Napięcie robocze | DC 9–36V |
| | Wskaźnik | Czerwona dioda PWR |
| Komunikacja | Interfejsy | RJ45, RS485 |
| | Baud rate | 9600bps (opcjonalnie inne) |
| | Protokół | Modbus TCP, Modbus RTU |
| MODBUS | Adres urządzenia | Zmienny (komenda Modbus, PC, DIP) |
| **DI** | Typ | NPN, PNP |
| | Napięcie wejściowe | 12–24V |
| | Impedancja wejściowa | 7.2 kΩ |
| | Częstotliwość próbkowania | max 1kHz |
| **AI** | Tryb | jednostronny / różnicowy (opcja) |
| | Prąd jednostronny | 0–20mA, 4–20mA |
| | Prąd różnicowy | 0–20mA, 4–20mA, ±20mA |
| | Napięcie różnicowe | 0–5V, ±5V, 0–10V, ±10V |
| | Rozdzielczość | 16 bit (różnicowe) / 12 bit (jednostronne) |
| | Dokładność | 1‰ (różnicowe) / 3‰ (jednostronne) |
| | Próbkowanie | jednostronne max 100Hz / różnicowe max 40Hz |
| **DO** | Typ | Przekaźnik typu A (NO) |
| | Tryb | wyjście poziomowe |
| | Obciążalność | 5A 30VDC, 5A 250VAC (max 8A na wspólny COM) |
| **AO** | Typ wyjścia | 0–20mA, 4–20mA |
| | Dokładność | 3‰ |
| Inne | Wymiary | 110 × 40 × 100 mm (dł. × szer. × wys.) |
| | Temp./wilgotność pracy | -40 do +85°C, 5–95%RH (bez kondensacji) |
| | Temp./wilgotność przechowywania | -40 do +105°C, 5–95%RH |
| | Montaż | otwory pozycjonujące, szyna DIN |

### 3.2 Domyślne parametry fabryczne
**Parametry podstawowe:**
- Adres Modbus: **1**
- Baud rate: **9600bps** (8 opcji do wyboru)
- Bit kontrolny: brak (domyślnie), Odd, Even
- Bity danych: 8, bity stopu: 1
- Filtr DI: **6**, filtr AI: **6**

**Parametry sieciowe:**
- Tryb pracy: **TCP server** (do 5 połączeń klientów)
- DHCP: wyłączone
- Brama: 192.168.3.1
- Maska podsieci: 255.255.255.0
- Lokalny IP: **192.168.3.7**
- Lokalny port: **502**
- Docelowy IP: 192.168.3.3
- Docelowy port: 502
- DNS: 114.114.114.114
- MAC: ustalony przez chip (stały)

### 3.3 Wymiary
110 mm (długość) × 40 mm (szerokość) × 100 mm (wysokość).

---

## 4. Porty, przyciski i diody LED — M31-AAAX4440G

*Uwaga: dioda AI oraz oznaczenia na obudowie występują tylko w najnowszej wersji (host V1.2, moduł rozszerzeń V2.0).*

### Opis portów
| Symbol | Funkcja |
|---|---|
| AI1–AI4 | Wejścia analogowe, współpracują ze wspólnym terminalem COMA |
| COMA | Wspólny terminal dla AI1–AI4 |
| DI1–DI2 | Wejścia cyfrowe, wspólny terminal COMB |
| COMB | Wspólny terminal dla DI1–DI2 |
| DI3–DI4 | Wejścia cyfrowe, wspólny terminal COMC |
| COMC | Wspólny terminal dla DI3–DI4 |
| DO1/COM1, DO2/COM, DO3/COM3, DO4/COM4 | Wyjścia przekaźnikowe, każde z własnym terminalem COM |
| Reload | Przytrzymaj 5–10s = reset do ustawień fabrycznych; podwójne kliknięcie w ciągu 2s = auto-negocjacja modułu rozszerzeń |
| A/B/G (RS485) | Interfejsy magistrali RS485 |
| PE | Uziemienie |
| V-/V+ (DC9-36V) | Zasilanie |
| LAN1 | Standardowy port RJ45 |

### Opis diod LED
| Symbol | Kolor | Znaczenie |
|---|---|---|
| PWR | Czerwona | Zapalona = zasilanie OK; zgaszona = błąd zasilania |
| LINK | Żółta | Zapalona = jest łącze; zgaszona = brak łącza; szybkie miganie = wymiana danych |
| STA | Niebieska | Naprzemienne miganie = praca normalna; stały stan (on/off) = błąd urządzenia |
| DI1–DI4 | Zielona | Zapalona = ważne wejście; zgaszona = brak sygnału |
| DO1–DO4 | Zielona | Zapalona = przekaźnik zwarty; zgaszona = otwarty |
| AI1–AI4 | Zielona | Zapalona = sygnał ≥1% zakresu; zgaszona = brak sygnału; szybkie miganie = przekroczenie zakresu o 10% |

*(Instrukcja zawiera analogiczne tabele portów/LED dla pozostałych 11 modeli serii M31 — mogę je przytoczyć na życzenie.)*

---

## 5. DIP switch (adresowanie sprzętowe)

Adres urządzenia = **adres sprzętowy (DIP) + adres programowy (offset)**.

- Domyślny adres urządzenia: **1** (DIP=0 + offset=1).
- Zakres adresu urządzenia: **1–255**.
- **Adres sprzętowy:** binarnie, 4-bitowy przełącznik DIP (fabrycznie 0). Np. DIP 1+2+3 = ON → adres sprzętowy = 1+2+4 = 7 (zakres 0–15).
- **Adres programowy:** ustawiany w oprogramowaniu konfiguracyjnym (Offset Address, fabrycznie 1, max 240 — powyżej 240 zapis nie zadziała).
- Przykład: adres sprzętowy 5 + adres programowy 113 = adres urządzenia **118**.

---

## 6. Funkcje produktu (Chapter 4)

### 6.1 Rozbudowa I/O (splicing modułów)
- **Uwaga:** nie wolno łączyć modułów pod napięciem — ryzyko uszkodzenia!
- Procedura: 1) host bez zasilania, suwak w pozycji **UNLK**, podłącz moduł rozszerzenia; 2) przesuń suwak na **LOCK**, włącz zasilanie, podłącz kabel sieciowy; 3) wykonaj **auto-negocjację** przez komputer PC (lub podwójne kliknięcie przycisku Reload w ciągu 2s).
- Każde dodanie/usunięcie modułu wymaga ponownej auto-negocjacji (weryfikacja kolejności i statusu urządzeń).

### 6.2 Wejście DI — filtrowanie
Sygnał musi utrzymać się przez kilka cykli próbkowania przed potwierdzeniem zmiany stanu. Parametr filtra: **1–16** (domyślnie 6 cykli, 6×1kHz). Konfigurowalny komendą lub przez PC.

### 6.3 Wyjście DO
Tryb wyjścia przekaźnikowego (poziomowy).

### 6.4 Wejście AI — zakresy
- **Jednostronne (single-ended):** 0–20mA lub 4–20mA, dokładność 3‰, 12-bit, 100Hz, impedancja wejściowa 100Ω. Rejestr zakresu: 0=0-20mA (domyślnie), 1=4-20mA.
- **Różnicowe prądowe:** 0–20mA / 4–20mA / ±20mA, 1‰, 16-bit, 40Hz. Rejestr: 0=0-20mA, 1=4-20mA, 2=±20mA.
- **Różnicowe napięciowe:** 0–5V / ±5V / 0–10V / ±10V, 1‰, 16-bit, 40Hz. Rejestr: 3=0-5V, 4=±5V, 5=0-10V (domyślnie), 6=±10V.

**Uwaga konfiguracyjna:** przy zakresie 4-20mA, sygnał <3.5mA wyświetlany jako 0, sygnał 3.5–4mA jako 4. Brak limitu konwersji >20mA, ale max 25mA (powyżej — ryzyko uszkodzenia urządzenia).

Adres rejestru zakresu AI: **0x0DAC** (holding register, funkcje 0x06/0x10).

### 6.5 Trzy sposoby odczytu AI
1. **Wartość całkowita (shaping):** rejestr od 0x0000 (input register, FC 0x04), 1 rejestr/kanał.
   - Prąd jednostronny: 0–20000 = 0–20mA (prąd = wartość/1000 mA)
   - Prąd różnicowy: -20000–20000 = -20–20mA
   - Napięcie różnicowe: -10000–10000 = -10–10V
2. **Wartość zmiennoprzecinkowa (IEEE754):** rejestr od 0x03E8 (FC 0x04), 2 rejestry/kanał.
3. **Wartość procesowa:** rejestr od 0x0BB8 (FC 0x04), 1 rejestr/kanał, zakres -27648–27648 = -10V/+10V lub -20mA/+20mA.

*(Instrukcja zawiera szczegółowe tabele konwersji dec/hex dla zakresów 0-20mA, -20-0mA, -20-20mA oraz napięć 0-5V/0-10V/±5V/±10V — dostępne na życzenie.)*

### 6.6 Filtr AI
Zakres 1–16, domyślnie **6**. Wyższa wartość = stabilniejszy odczyt, wolniejsza reakcja. Rejestr: **0x0DA2** (holding, FC 0x06/0x10). Wartości spoza zakresu są automatycznie zaokrąglane; 0 → ustawiane na 1.

### 6.7 Wyjście AO
- Zakres: 0–20mA lub 4–20mA, dokładność 3‰, 16-bit, impedancja wejściowa 500Ω.
- Rejestr zakresu wyjścia: **0x0DAC** (holding, FC 0x06/0x10), wartości: 0=0-20mA (domyślnie), 1=4-20mA.
- Trzy sposoby zapisu/odczytu: wartość całkowita (od 0x0000, FC 0x03/0x06/0x10, 0-20000=0-20mA), wartość zmiennoprzecinkowa (od 0x03E8), wartość procesowa (od 0x01F4, 0-27648=0-20mA).

### 6.8 Monitoring online
| Rejestr | Adres hex | Adres dec | Opis |
|---|---|---|---|
| Kod błędu urządzenia | 0x7587 | 4-30088 | 0=brak błędu, 1=slave nie odpowiada, 2=zła kolejność modułów rozszerzeń (powoduje niesprawność urządzenia) |
| Błędnie oznakowany moduł rozszerzeń | 0x7588 | 4-30089 | 2 rejestry (32 bity) — bit=1 oznacza, że dany moduł w kolejności jest niesprawny |

---

## 7. Rejestry Modbus (Chapter 4.8) — najważniejsze tabele

*Uwaga producenta: rejestry DI/DO/AI/AO są ciągłe — np. przy doklejeniu modułu 8DI do hosta 8DI, DI modułu rozszerzeń zaczyna się od 0x0008 (kontynuacja po hoście 0x0000-0x0007).*

### 7.1 Rejestry DI (status)
| Kanał | Adres hex | Adres dec | Strefa | FC |
|---|---|---|---|---|
| DI1 | 0x0000 | 1-0001 | Zone 1 | R: 0x02 |
| DI2 | 0x0001 | 1-0002 | Zone 1 | R: 0x02 |
| DI3 | 0x0002 | 1-0003 | Zone 1 | R: 0x02 |
| DI4 | 0x0003 | 1-0004 | Zone 1 | R: 0x02 |

Filtr DI: rejestr **0x0DA3** (4-3492), holding, FC 0x03 (odczyt) / 0x06,0x10 (zapis), domyślnie 6.

### 7.2 Rejestry DO (status/sterowanie)
| Kanał | Adres hex | Adres dec | Strefa | FC |
|---|---|---|---|---|
| DO1 | 0x0000 | 0-0001 | Zone 0 | R:0x01, W:0x05/0x0F |
| DO2 | 0x0001 | 0-0002 | Zone 0 | R:0x01, W:0x05/0x0F |
| DO3 | 0x0002 | 0-0003 | Zone 0 | R:0x01, W:0x05/0x0F |
| DO4 | 0x0003 | 0-0004 | Zone 0 | R:0x01, W:0x05/0x0F |

### 7.3 Rejestry AI
**Wartość całkowita (0–20000, 2-bajtowa, µA):**
| Kanał | Adres hex | Adres dec | Strefa | FC |
|---|---|---|---|---|
| AI1 | 0x0000 | 3-0001 | Zone 3 | R:0x04 |
| AI2 | 0x0001 | 3-0002 | Zone 3 | R:0x04 |
| AI3 | 0x0002 | 3-0003 | Zone 3 | R:0x04 |
| AI4 | 0x0003 | 3-0004 | Zone 3 | R:0x04 |

**Wartość zmiennoprzecinkowa (mA, 4-bajtowa float, 2 rejestry/kanał):**
| Kanał | Adres hex | Adres dec |
|---|---|---|
| AI1 | 0x03E8 | 3-1001 |
| AI2 | 0x03EA | 3-1003 |
| AI3 | 0x03EC | 3-1005 |
| AI4 | 0x03EE | 3-1007 |

**Wartość procesowa (2-bajtowa, FC 0x04):**
| Kanał | Adres hex | Adres dec |
|---|---|---|
| AI1 | 0x0BB8 | 3-3001 |
| AI2 | 0x0BB9 | 3-3002 |
| AI3 | 0x0BBA | 3-3003 |
| AI4 | 0x0BBB | 3-3004 |

**Filtr AI:** 0x0DA2 (4-3491), Zone 4, holding, FC 0x03/0x06/0x10, domyślnie 6.

**Zakres próbkowania AI (na kanał):** AI1=0x0DAC (4-3501), AI2=0x0DAD (4-3502), AI3=0x0DAE (4-3503), AI4=0x0DAF (4-3504). Wartości: 0=0-20mA, 1=4-20mA. FC 0x03/0x06/0x10.

### 7.4 Rejestry AO (dot. wariantów z wyjściami analogowymi, np. M31-XAXA0404G)
**Wartość całkowita:** AO1=0x0000 (4-0001) ... kolejne kanały +1 adres, Zone 4, R:0x03, W:0x06/0x10.
**Wartość zmiennoprzecinkowa:** AO1=0x03E8 (4-1001), 2 rejestry/kanał.
**Wartość procesowa:** AO1=0x01F4 (3-0501).
**Zakres wyjścia AO:** AO1=0x1194 (4-4501) itd., wartości 0=0-20mA, 1=4-20mA.

### 7.5 Rejestry modułu (parametry systemowe)
| Rejestr | Adres hex | Adres dec | Opis |
|---|---|---|---|
| Kod prędkości transmisji | 0x7530 | 4-30001 | 1:2400, 2:4800, 3:9600, 4:19200, 5:38400, 6:57600, 7:115200, 8:230400 |
| Bit kontrolny | 0x7531 | 4-30002 | 0:NONE, 1:ODD, 2:EVEN |
| Tryb pracy sieciowej | 0x7532 | 4-30003 | 0:TCPS, 1:TCPC, 2:UDPS, 3:UDPC |
| DHCP | 0x7533 | 4-30004 | 0:wył., 1:wł. |
| Adres MAC | 0x7534 | 4-30005 | 3 rejestry, tylko odczyt |
| Lokalny IP | 0x7537 | 4-30008 | 2 rejestry |
| Maska podsieci | 0x7539 | 4-30010 | 2 rejestry |
| Brama | 0x753B | 4-30012 | 2 rejestry |
| DNS | 0x753D | 4-30014 | 2 rejestry |
| Lokalny port | 0x7541 | 4-30018 | 0–65535 |
| Docelowy IP/domena | 0x7542 | 4-30019 | 64 rejestry (max 128 znaków, string) |
| Docelowy port | 0x7582 | 4-30083 | 1–65535 |
| Protokół Modbus sieciowy | 0x7583 | 4-30084 | 1=TCP, 0=RTU |
| Zabezpieczenie zapisu rejestru negocjacji adresu | 0x7584 | 4-30085 | zapis 1 = otwarcie ochrony przed komendą negocjacji |
| Rejestr negocjacji adresu | 0x7585 | 4-30086 | zapis 1 = start negocjacji |
| Status bieżącej negocjacji | 0x7586 | 4-30087 | 0=nieukończona, 1=ukończona |
| Kod błędu urządzenia | 0x7587 | 4-30088 | (opis w sekcji 6.8) |
| Błędnie oznakowany moduł | 0x7588 | 4-30089 | (opis w sekcji 6.8) |

*Uwaga: niektóre programy (np. Configurator) liczą rejestry 16→10 z przesunięciem +1 (podana baza dziesiętna już jest +1).*

---

## 8. Oprogramowanie konfiguracyjne (Chapter 5 — Ebyte Distributed IO Configtool)

### 8.1 Połączenie i sterowanie
1. Wybierz interfejs (Ethernet lub port szeregowy) → **Search** (wyszukiwanie urządzeń).
   - Ethernet: wybierz kartę sieciową przed wyszukiwaniem.
   - Port szeregowy: ustaw numer COM, baud rate, bity danych, bity stopu, bit kontrolny, zakres adresów wyszukiwania — zgodnie z ustawieniami urządzenia.
2. Wybierz znalezione urządzenie z listy, aby sterować I/O w zakładce **IO Status** (podgląd stanu DI/DO, wartości AI w mA na żywo).

### 8.2 Konfiguracja parametrów (zakładka Config)
Umożliwia zmianę: adresu Modbus, baud rate, parzystości, filtrów DI/AI, trybu pracy sieciowej, DHCP, bramy, maski, lokalnego IP/portu, docelowego IP/portu, serwera DNS, protokołu Modbus na sieci, oraz **zakresu wejść AI** dla każdego kanału osobno (lista rozwijana np. 0-20mA / 4-20mA).

Po zmianie parametrów: kliknij **Save** → komunikat w logu o powodzeniu zapisu → **zrestartuj urządzenie** (przycisk Reboot), aby zmiany zaczęły obowiązywać.

Panel **Info** pokazuje: adres Modbus, interfejs, adres MAC, wersję firmware, typ DI/AI/DO/AO.

---

## 9. Środki ostrożności (Chapter 6)

1. **Nie łączyć/rozłączać modułów pod napięciem** — ryzyko uszkodzenia sprzętu.
2. Oprogramowanie hosta w wersji **V1.1 jest niekompatybilne** z niektórymi modułami rozszerzeń: GXGXX0800, GXFXX0800, GXXXA0008, GXAXA0404, GXAXX0800 (V2.0), GAAAX4440 (V2.0).
   - **Wersja V1.2** jest kompatybilna ze wszystkimi modułami rozszerzeń. Instrukcję aktualizacji można pobrać ze strony **www.es-ebyte.com**.
3. Kompletny host zawiera firmware hosta oraz firmware modułów rozszerzeń — wersje można sprawdzić w zakładce Info programu konfiguracyjnego (osobno dla hosta i dla każdego modułu).

---

## 10. Historia rewizji dokumentu
| Wersja | Data | Zmiany | Autor |
|---|---|---|---|
| 1.0 | 2025-05-06 | Wydanie początkowe | LT |
| 1.1 | 2026-01-29 | Zmiana schematu wyglądu | LT |

---

## 11. Kontakt (Chapter 7 — About us)
- Wsparcie techniczne: **service@cdebyte.com**
- Dokumenty i ustawienia RF: **www.es-ebyte.com**
- Ogólny kontakt: **info@cdebyte.com**
- Telefon: **+86 4000-330-990**
- Adres: B5 Mould Park, 199# Xiqu Ave, High-tech District, Sichuan, China

---

*Streszczenie sporządzone na podstawie pliku: M31_Series_Distributed_IO_Host_User_Manual_V1_1-EN.pdf (61 stron). Pominięto szczegółowe tabele portów/LED dla pozostałych 11 modeli serii (identyczna struktura co dla AAAX4440G, inna liczba kanałów) oraz pełne tabele konwersji dec/hex dla wszystkich zakresów AI/AO — mogę je dołączyć na życzenie.*
