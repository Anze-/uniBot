#UNIBOT

il sistema funziona cosi'
 1) sono andato sul sito dell'orario
 li ho destrutturato le richieste che il browser fa al server
 sono delle richieste POST abbastanza semplici
 ma vanno simulate con tutti gli headers altrimenti il server riconosce che sei esterno alla pagina di unitn e non ti risponde
 ogni corso ha una richiesta POST diversa
 per ora io ho "hard-coded"  la richiesta che restituisce i dati per il corso di fisica magistrale
 quindi espandere significa o fare una lista delle POST principali e poi permettere una scelta all'utente ogni volta che manda il messaggio
 oppure ancora piu difficile
 fare un sistema che riconosce gli utenti e salva le tue impostazioni tipo con un comando
 /configura
 2) la risposta del server e' una stringa
 che rappresenta un oggetto JSON
 (tipico formato di struttura dati)
 quindi trasformi la lista in un JSON
 poi sul JSON le lezioni sono in
 obj.celle[i]
 al variare di i tutte le lezioni della settimana
 3) qui si passa alla ricerca
 la ricerca e' una funzione che prende una parola chiave e l'oggetto JSON
 e cicla sugli elementi cella selezionando solo quelli che contengono nel
 cella.nome_lezione
 la parola chiave
 indipendentemente dal maiuscolo.minuscolo
 quindi con la regex (/keyword/i)
 4) trovati i candidati dobbiamo scegliere quello che ha l'ora piu' vicina... qui entrano in gioco le funzioni tempo dipendenti che calcolano la distanza tra ora e i corsi
 mentre ciclo e seleziono sovrascrivo la risposta con quella del nuovo elemento solo se la sua distanza temporale e' minore rispetto a quella gia' salvata
 cosi' la risposta e' formulata
 5) Telegram Bot
 a questo punto tutto va fatto combaciare con il bot di telegram
 che si presenta come una libreria che ha delle classi
 (tipo delle funzioni ma a via di mezzo con degli oggetti.. non so se le hai mai incontrate)
 le classi si "estendono"
 pensale come delle classi di funzioni
 da una classe la estendi e in pratica ricavi delle funzioni che hanno una particolare struttra
 e ti permettono di fare magie con poche righe di codice
 allora il bot funziona con due classi e poi ha un routing
 cioe' in una classe ho la funzione /start
 in una invece ricevo i messaggi, controllo se sono del tipo "lezione...blah blah"
 e estraggo le keywords
 (che andrebbe migliorato)
 alla fine il routing sono due righe di codice che sfruttano le classi
 e in pratica gestiscono tutte le riciheste
 il parallelismo e tutto
 6) in tutto questo devi considerare che la funzione che "invia il messaggio di risposta"
 deve essere "asincrona"
 perche' deve aspettare la risposta del server di unitn
 e questo rallentrerebbe le nuove richieste
 quindi la risposta avviene in una funzione di "callback"
 cioe' direttamente nella funzione che fa la richiesta a unitn
 come argomento ha una funzione
 che elabora e manda la risposta
 ora
 tutto e' scritto in NODE.JS
 puoi installarlo con
 sudo apt-get install node
 e
 sudo apt-get install npm
 npm
 e' il gestore di pacchetti per node
 a questo punto ti servono 3 pacchetti
 quindi
 npm install nomepacchetto
 per i pacchetti
 request
 moment
 telegram-node-bot
