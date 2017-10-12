const
  bodyParser = require('body-parser'),
  config = require('config'),
  crypto = require('crypto'),
  express = require('express'),
  https = require('https'),
  request = require('request'),
  ApiAiApp = require('actions-on-google').ApiAiApp;
var app = express();

const WELCOME_INTENT = 'input.welcome';
const PRINTER = 'input.printer';
const HOMEUSE="input.homeuse";
const SCAN="input.scan";
const WIFI="input.wifi";

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

var senderID = '';
var data = '';
const PAGE_ACCESS_TOKEN = 'EAAG5m0TJFqYBAEwcrYkiJDxhWUKZAAyZAQxqSXd9HYDmvGc6ABY0qjIRbhLzbEDSzGv99AGQztyyIuDhjL8t9vij3DHTyeA6HdZC79l4qd9IsabOKaBBZCdylUTU8XXwncfe7ckWJVV8lAg4lv5DAMh5ZBWtrh4TdSX3xtjf0iAZDZD
';

/*
* HTTP Cloud Function.
*/
app.post('/helloHttp', function(request, response) {
  console.log("Inside /helloHttp");
  const appAi = new ApiAiApp({request: request, response: response});
  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(PRINTER, buyPrinter);
  actionMap.set(HOMEUSE,printerUse);
  actionMap.set(SCAN,scanPrinter);
  actionMap.set(WIFI,wifiPrinter);
	
  appAi.handleRequest(actionMap);
});

app.get('/', function(request, response) {
	console.log("Inside get");
  console.log("New deployment method")
 
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
function welcomeIntent (appAi) {
  appAi.tell('I am your BestBuy virtual In-Home Assistant. I can help you choose your home appliances. How may I help you today?');

}
function scanPrinter(appAi) {
   appAi.ask('Do you want printer with scan option?');
}
function buyPrinter (appAi) {
  //appAi.tell('Sure, I can help you with that.');
  appAi.ask('Sure, I can help you with that. \nDo you want this for home use or office use?');

}
function printerUse(appAi){
   appAi.ask('Cool. Would you print a lot every day? Like more than 50 pages per week i.e moderate use or regular use?');
}
function wifiPrinter(appAi){
  appAi.ask('Do you want printer with wifi?');
 };

  callSendAPI(messageData);
}

 
module.exports = app;
