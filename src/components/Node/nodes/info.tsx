/*
Beschreibung: 
- Der Editor soll den Modus "Design" haben, in dem es möglich ist, neue Nodes mit "Neue Node" oder mit dem +-Key zu setzen.
- Dann erfolgt in dem Modal die Node-Auswahl. 
    -Dabei sollen zu jeder Node ein Hilfs-Text erscheinen, der direkt aus der Komponente geholt wird.  
     Die Komponente soll dazu eine immer konforme "About" besitzen.
- Die Positionierung der Node erfolgt auf die Position auf die der User mit der Maus klicket nachdem das Modal geschlossen wird.
- Durch Umschalten in den Run-Modus soll die Position und die Konnektoren geschützt sein, aber die Parameter und Aktionselemente (Buttons, Slider, Schalter, Input-Felder etc.) sollen Aktiv sein. EIn Doppelklick auf die Node soll hier ein Modal zum Ändern der Parameter öffnen, und bei klick außerhalb des Modals schließen und den Wert speichern.
- Der Modus "Run" soll in einem leichten Hell-Grün erscheinen, der Modus "Design" in leichtem Grau.
- Mit Export und Impoer soll der Graf gespeichert und geladen werden.

Folgende Probleme bestehen immer noch: 

- Aktion des Sliders nicht gegeben im Run-Mode. Es geht nur das Modal auf, das ist ok. Der Slider soll sich aber verschieben lassen!
- Auch im Run-Modus läßt sich noch alles Löschen (Node und Konnektor). Das soll so nicht sein. 
- Im Run-Modus so

*/