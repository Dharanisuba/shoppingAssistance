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

const PAGE_ACCESS_TOKEN = 'EAAG5m0TJFqYBAEwcrYkiJDxhWUKZAAyZAQxqSXd9HYDmvGc6ABY0qjIRbhLzbEDSzGv99AGQztyyIuDhjL8t9vij3DHTyeA6HdZC79l4qd9IsabOKaBBZCdylUTU8XXwncfe7ckWJVV8lAg4lv5DAMh5ZBWtrh4TdSX3xtjf0iAZDZD';
var senderID = '';
var data = '';
var url = 'https://graph.facebook.com/v2.6/me/messages';

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));

/*
* HTTP Cloud Function.
*/
app.post('/helloHttp', function(request, response) {
  console.log("Inside /helloHttp");
  var req = request.body;
  console.log("\nReq: \n", req);
   var result = req.result;
  data = result.fulfillment;
  console.log("\ndata: \n", data);
  
  //console.log("result", result);
  for(var i=0; i<result.contexts.length; i++) {
    console.log("Context: ", result.contexts[i]);
  }
  senderID = req.id;
	
  console.log("SenderID: ", senderID);
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
//  response.sendStatus(200);
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
var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sure. I can help you with that. \nHow do you plan on using it?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"For Personal use",
          "payload":"PRINTER_USE_TYPE_PERSONAL"
        },
        {
          "content_type":"text",
          "title":"For Professional use",
          "payload":"PRINTER_USE_TYPE_PROFESSIONAL"
        }]
    }
  };

  callSendAPI(messageData);	

}
function printerUse(appAi){
   appAi.ask('Cool. Would you print a lot every day? Like more than 50 pages per week i.e moderate use or regular use?');
}

function wifiPrinter(appAi){
  appAi.ask('Do you want  the printer to print over the WiFi?');  
}

function endIntent (appAi) {
  console.log("Inside endIntent");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Thanks for shopping with Best Buy.:) \nCan you please spare a minute to rate our service?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"CHATBOT_RATING_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"CHATBOT_RATING_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function sendPrinterDetails(recipientId) {
  console.log("RecipientID: ", recipientId);
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "HP pro 6978 printer",
            subtitle: "Printer",
            item_url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
            image_url: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5119/5119600_sd.jpg;maxHeight=550;maxWidth=642",
            buttons: [{
              type: "web_url",
              url: "https://www.bestbuy.com/site/hp-officejet-pro-6978-wireless-all-in-one-instant-ink-ready-printer/5119600.p?skuId=5119600",
              title: "Open Web URL"
            }],
          }]
        }
      }
    }
  };
  callSendAPI(messageData);
  }

  function sendPrinterSelectButton(recipientId) {
    messageData = {
      recipient: {
        id: senderID
      },
      "message":{
        "text": "I found the above for you. \nCan I add it to your cart?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"YES",
            "payload":"ADD_TO_CART_YES"
          },
          {
            "content_type":"text",
            "title":"NO",
            "payload":"ADD_TO_CART_NO"
          },
          {
            "content_type":"text",
            "title":"Show More",
            "payload":"PRINTER_SELECT_SHOW_MORE"
          }]
      }
    };
    callSendAPI(messageData);
  }

function callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
  }


module.exports = app;
