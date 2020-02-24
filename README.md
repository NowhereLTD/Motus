
### Geplante Features
- Implementierung von mehreren Szenen
  - Jede Szene hat mehrere Frames
    - Jede Szene kann mehrere Subszenen haben, welche wie Szenen gehandhabt werden
  - Jedes Frame hat mehrere Layer
    - Jedes Frame kann mehrere Subframes haben welche wie Frames gehandhabt werden
  - Subszenen und Subframes werden über eine ParentID realisiert

- Implementierung von Objekten
  - Es können Objekte erstellt werden, welche dann den Part einer Zeichnung repräsentieren
  - Jedes Objekt beinhaltet entweder Subobjekte oder Zeichendaten
  - Subobjekte werden über eine ParentID realisiert und wie normale Objete gehandhabt
  - Objekte können die Tranformation und Position ändern

- Implementierung von Objektanimationen
  - Ein Objekt kann eine Animation beinhalten
  - Diese Animation repräsentiert den Datensatz eines Objektes über mehrere Frames hinweg
  - Animationen können mehrfach verwendet werden
  - (ggf. Implementation eines Animationseditors?)

- Objekte und Objektanimationen können global gespeichert werden.
- Dadurch wird eine Wiederverwendbarkeit einer Objektanimation über ein gesamtes Projekt hinweg garantiert
