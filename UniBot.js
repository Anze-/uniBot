'use strict'

//TODO:
// funzioni basate sulla data:
//implementare la funzione che selezioni solo la lezione piu' vicina considerato il quarto d'ora accademico

var moment = require('moment');




function timeTo(cella){
    return moment(cella.giorno+"-"+cella.ora_fine, "d-hh").diff(moment().subtract(5,"days"),'minutes'); //mostra la lezione contemporanea fino alla sua fine
}


// funzioni basate sul corso:
//selezione del corso, espansione agli altri corsi

var POST = 'form-type=corso&anno='+moment().year()+'&corso=0518H&anno2=P0005%7C0&date='+moment().format("DD-MM-YYYY")+'&_lang=en&all_events=0'; //FIS.Magistrale

// funzioni database:
//salvare una copia degli oggetti JSON per diminuire le richieste al sito di UniTn e funzionare in caso di fallimento unitn





var request = require('request');
var nomeGiorno = [undefined, "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica", undefined];
var lezione;
var output="";
var self;


const Telegram = require('telegram-node-bot')
const TelegramBaseController = Telegram.TelegramBaseController
const TextCommand = Telegram.TextCommand
const tg = new Telegram.Telegram('468019762:AAEz4EharnUcaJLaT9Aq0n498xUTboN7BuA')
const cmd1 = 'lezione '//lasciare lo spazio dopo il comando

//formula la rispost leggibile 
function resp(jsonObj, Lez){
    console.log("called_resp");
    var rx = "";
    var delta0= 9999999999;
    var delta;
    jsonObj.celle.filter(function(cella){
        if (cella.nome_insegnamento.search(new RegExp(Lez, "i")) !== -1 ){
                    delta = timeTo(cella);
                    if (delta>0){
                        if(delta<delta0){
                            //replace outcome string
                            rx = cella.nome_insegnamento+" — di "+cella.docente+":\n"+cella.aula+"\n dalle "+cella.ora_inizio+" alle "+cella.ora_fine+" del "+nomeGiorno[cella.giorno]+"\n\n";  // 1 lunedi' ... 5 venerdi'
                            delta0=delta;
                            console.log(delta0);
                        }
                    }
        };          
    })
    if (rx==""){rx="Non ho trovato questa lezione! 😞 ";}
    return rx;
}


//funzione che chiama la risposta
function callback(error, response, body, $) {
    console.log("called_callback");
    if (!error && response.statusCode == 200) {
        //console.log(body);
        var obj = JSON.parse(body);
        //console.log(obj);
        //console.log(lezione);
        output=resp(obj, lezione);
        self.sendMessage(output);
    } else {
        output = 'unitn offline'; // 
    }
    //console.log(output);
}


//loads data from unitn.it
function getJSON(dataString, $) {
    console.log("called_getJSON");
    var headers = {
        'Host': 'easyroom.unitn.it',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:55.0) Gecko/20100101 Firefox/55.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://easyroom.unitn.it/Orario/index.php?view=easycourse&include=corso&_lang=en',
        'Connection': 'keep-alive',
        'Cookie': '_ga=GA1.2.282963219.1497261205'
    };

    var options = {
        url: 'https://easyroom.unitn.it/Orario/grid_call.php',
        method: 'POST',
        headers: headers,
        body: dataString
    };
    self=$;
    request(options, callback);
    //$.sendMessage("test!"); //ok! Working!

}


//////////////////////////////-------------     BOT     ----------/////////////////////////////
class orario extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    rispondi($) {
        console.log("called_rispondi");
        lezione=$.message.text.replace(cmd1,'');
        getJSON(POST , $); //
        //console.log(output);
        //$.sendMessage(output);

    }

    get routes() {
        return {
            'cmdLezione': 'rispondi'
        }
    }
}



class info extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    start($) {
        $.sendMessage('Ciao! Scrivi ‘lezione CorsoX’ per sapere dove e quando si terrà la prossima lezione del CorsoX!')
    }

    get routes() {
        return {
            'startCommand': 'start'
        }
    }
}




tg.router
    .when(
        new TextCommand(cmd1, 'cmdLezione'),
        new orario()
    )
    .when(new TextCommand('/start', 'startCommand'), new info())
