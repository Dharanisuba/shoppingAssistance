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
const PAGE_ACCESS_TOKEN = 'EAAG5m0TJFqYBAEwcrYkiJDxhWUKZAAyZAQxqSXd9HYDmvGc6ABY0qjIRbhLzbEDSzGv99AGQztyyIuDhjL8t9vij3DHTyeA6HdZC79l4qd9IsabOKaBBZCdylUTU8XXwncfe7ckWJVV8lAg4lv5DAMh5ZBWtrh4TdSX3xtjf0iAZDZD
';
var senderID = '';
var data = '';

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

  data = req.originalRequest.data;
  console.log("\ndata: \n", data);
  var result = req.result;
  //console.log("result", result);
  for(var i=0; i<result.contexts.length; i++) {
    console.log("Context: ", result.contexts[i]);
  }
  senderID = data.sender.id;
  console.log("SenderID: ", senderID);

  const appAi = new ApiAiApp({request: request, response: response});
  const actionMap = new Map();
  actionMap.set(WELCOME_INTENT, welcomeIntent);
  actionMap.set(PRINTER, productPrinter);
  actionMap.set(PRINTER_FALLBACK, productPrinterFallback);
  actionMap.set(USETYPE, chooseUseType);
  actionMap.set(USETYPE_FALLBACK, chooseUseTypeFallback);
  actionMap.set(LOADTYPE, chooseModerateUse);
  actionMap.set(LOADTYPE_FALLBACK, chooseModerateUseFallback);
  actionMap.set(SCANTYPE, chooseScanType);
  actionMap.set(SCANTYPE_FALLBACK, chooseScanTypeFallback);
  actionMap.set(WIFITYPE, chooseWiFiType);
  actionMap.set(WIFITYPE_FALLBACK, chooseWiFiTypeFallback);
  actionMap.set(ADD_TO_CART, productSelected);
  actionMap.set(ADD_TO_CART_FALLBACK, productSelectedFallback);
  actionMap.set(CHECKOUT, checkOut);
  actionMap.set(CHECKOUT_FALLBACK, checkOutFallback);
  actionMap.set(END_CHAT, endIntent);
  actionMap.set(GET_LOCATION, getLocation);
  actionMap.set(RETRIEVE_LOCATION, retrieveLocation);
  actionMap.set(GET_TOP_FIVE_ITEMS, getTopFiveItems);

  appAi.handleRequest(actionMap);
});

app.get('/', function(request, response) {
	console.log("Inside get");
  console.log("New deployment method")
  res.sendStatus(200);
});

app.get('/setupGetStartedButton',function(req,res){
    setupGetStartedButton(res);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function welcomeIntent (appAi) {
  console.log("Inside welcomeIntent");
  appAi.tell('I am your Best Buy In-Home Assistant. \nAsk me about Electronic Gadgets and Home appliances. \nHow may I help you today?');
}

function productPrinter (appAi) {
  console.log("Inside productPrinter");
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

function productPrinterFallback (appAi) {
  console.log("Inside productPrinterFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nHow do you plan on using it?",
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

function chooseUseType (appAi) {
  console.log("Inside chooseUseType");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Cool.. :) \nHow many pages would you print every day?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Less than 10",
          "payload":"PRINTER_PAPER_LESS_THAN_10"
        },
        {
          "content_type":"text",
          "title":"Less than 100",
          "payload":"PRINTER_PAPER_LESS_THAN_100"
        },
        {
          "content_type":"text",
          "title":"More than 100",
          "payload":"PRINTER_PAPER_MORE_THAN_100"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseUseTypeFallback (appAi) {
  console.log("Inside chooseUseTypeFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nHow many pages would you print every day?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Less than 10",
          "payload":"PRINTER_PAPER_LESS_THAN_10"
        },
        {
          "content_type":"text",
          "title":"Less than 100",
          "payload":"PRINTER_PAPER_LESS_THAN_100"
        },
        {
          "content_type":"text",
          "title":"More than 100",
          "payload":"PRINTER_PAPER_MORE_THAN_100"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseModerateUse (appAi) {
  console.log("Inside chooseModerateUse");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Would you also want the printer to scan pages?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_SCAN_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_SCAN_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseModerateUseFallback (appAi) {
  console.log("Inside chooseModerateUseFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nWould you also want the printer to scan pages?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_SCAN_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_SCAN_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseScanType (appAi) {
  console.log("Inside chooseScanType");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Do you need the printer to print over the WiFi?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_WIFI_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_WIFI_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseScanTypeFallback (appAi) {
  console.log("Inside chooseScanTypeFallback");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nDo you need the printer to print over the WiFi?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_WIFI_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_WIFI_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function chooseWiFiType (appAi) {
  console.log("Inside chooseWiFiType");
  sendPrinterDetails(senderID);
  setTimeout(sendPrinterSelectButton, 3000);
}

function chooseWiFiTypeFallback (appAi) {
  console.log("Inside chooseWiFiTypeFallback");
  messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nCan I add it to your cart?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_SELECT_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_SELECT_NO"
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

function productSelected (appAi) {
  console.log("Inside productSelected");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Great! Product added to your BestBuy cart. \nCan I checkout this item for you?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_CHECKOUT_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_CHECKOUT_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function productSelectedFallback (appAi) {
  console.log("Inside productSelected");
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Sorry, I didnt get that. \nCan I checkout this item for you?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_CHECKOUT_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_CHECKOUT_NO"
        }]
    }
  };

  callSendAPI(messageData);
}

function checkOut (appAi) {
  console.log("Inside checkOut");
  appAi.tell('Item checked out. \nIs there anything else I can help you with?');
}

function checkOutFallback (appAi) {
  console.log("Inside checkOut");
  appAi.tell('Sorry, I didnt get that. \nIs there anything else I can help you with?');
}

function endIntent (appAi) {
  console.log("Inside endIntent");
  appAi.tell('Thanks for shopping with Best Buy.:) \nHave a great day! ');
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
            "payload":"PRINTER_SELECT_YES"
          },
          {
            "content_type":"text",
            "title":"NO",
            "payload":"PRINTER_SELECT_NO"
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

  function getLocation(appAi) {
    console.log("Inside getLocation");
    messageData = {
      recipient: {
        id: senderID
      },
      "message":{
          "text": "Sure, I can help you with that. \nPlease share your location to show the nearest Best Buy stores",
          "quick_replies":[
            {
              "content_type":"location",
              "payload":"GET_USER_LOCATION"
            }
          ]
        }
      };
      callSendAPI(messageData);
    }

  function retrieveLocation(appAi) {
    console.log("Inside retrieveLocation");
    var lat = data.postback.data.lat;
    var long = data.postback.data.long;
    console.log('Provided Lat and long are: ',lat, long);
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
              + "location=" + lat + "," + long
              + "&radius=10000&type=Retail&keyword=Best%20Buy"
              + "&key=AIzaSyDHyBBKhH-CKIvxiwPIfEMA9wUvVShq5F0";
    request({
      url: url,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200 && body != undefined && body.results.length > 0) {
          //console.log(body) // Print the json response
          for(var i=0; i<body.results.length; i++) {
            console.log("Open Now: ", body.results[i].opening_hours.open_now);
            var storeOpenStatus = 'Closed Now';
            if(body.results[i].opening_hours.open_now) {
                storeOpenStatus = 'Open Now';
            }
            console.log("Store Address: ", body.results[i].vicinity);
            var storeTitle = body.results[i].name + ' \n :- ' + body.results[i].vicinity;
            var messageData = {
              recipient: {
                id: senderID
              },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: storeTitle,
                      subtitle: storeOpenStatus
                    }]
                  }
                }
              }
            };
            callSendAPI(messageData);
            if( i == 5) {
              break;
            }
          }
          //
      } else {
        appAi.tell("Sorry, no stores near by.");
      }
    });
  }

  function getTopFiveItems(appAi) {
    console.log("Inside getTopFiveItems");
    messageData = {
      recipient: {
        id: senderID
      },
      "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "list",
              "top_element_style": "compact",
              "elements": [
                {
                  "title": "Classic T-Shirt Collection",
                  "subtitle": "See all our colors",
                  "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",
                  "buttons": [
                    {
                      "title": "View",
                      "type": "web_url",
                      "url": "https://peterssendreceiveapp.ngrok.io/collection",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                    }
                  ]
                },
                {
                  "title": "Classic White T-Shirt",
                  "subtitle": "See all our colors",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                  }
                },
                {
                  "title": "Classic Blue T-Shirt",
                  "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
                  "subtitle": "100% Cotton, 200% Comfortable",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                    "messenger_extensions": true,
                    "webview_height_ratio": "tall",
                    "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                  },
                  "buttons": [
                    {
                      "title": "Shop Now",
                      "type": "web_url",
                      "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                      "messenger_extensions": true,
                      "webview_height_ratio": "tall",
                      "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
                    }
                  ]
                }
              ],
               "buttons": [
                {
                  "title": "View More",
                  "type": "postback",
                  "payload": "payload"
                }
              ]
            }
          }
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

  function setupGetStartedButton(res){
          var messageData = {
                  "get_started"://[
                  {
                      "payload":"Get Started with Home Electronic Assistance"
                      }
                  //]
          };

          // Start the request
          request({
              url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              form: messageData
          },
          function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // Print out the response body
                  res.send(body);

              } else {
                  // TODO: Handle errors
                  res.send(body);
              }
          });
      }

module.exports = app;

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
  var messageData = {
    recipient: {
      id: senderID
    },
    "message":{
      "text": "Do you need the printer to print over the WiFi?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"YES",
          "payload":"PRINTER_WIFI_YES"
        },
        {
          "content_type":"text",
          "title":"NO",
          "payload":"PRINTER_WIFI_NO"
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
