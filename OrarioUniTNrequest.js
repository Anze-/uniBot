var request = require('request');

var output;
var nomeGiorno = [undefined, "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica", undefined];
var lezione;
var obj;

function resp(jsonObj, Lez){
    var rx = "";
    jsonObj.celle.filter(function(cella){
        if (cella.nome_insegnamento.search(new RegExp(Lez, "i")) !== -1 ){
            rx += cella.nome_insegnamento+" — di "+cella.docente+":\n"+cella.aula+"\n dalle "+cella.ora_inizio+" alle "+cella.ora_fine+" del "+nomeGiorno[cella.giorno]+"\n";  // 1 lunedi' ... 5 venerdi'
        };
    })
    return rx;
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
         obj = JSON.parse(body);
        output=resp(obj, lezione);
    } else {
        output = 'unitn offline'; // 
    }
}


function getJSON(dataString) {
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

    request(options, callback);
}


lezione="quantum field";
var POST = 'form-type=corso&anno=2017&corso=0518H&anno2=P0005%7C0&date=06-10-2017&_lang=en&all_events=0'; //magistrale fisica
getJSON(POST); //stored in output
