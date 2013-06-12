//

var assert = require('assert')
var util = require('util')
var imap = require('imap');
var secret = require('./secret');

var sessionWang = "wtf12333";
var sender = Math.round(Math.random() * 60535) + 5000;
var myAddress = secret.user + '+' + sender + '@gmail.com';
var toAddress = secret.user + '@gmail.com';
var startDate = new Date();

if (typeof(chrome) == "undefined") {
  var http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
  }).listen(8124, "127.0.0.1");
  console.log('ctrl-c to stop');
} else {
  document.addEventListener("DOMContentLoaded", function() {
    var gmail = new imap({
      user: secret.user,
      password: secret.pass,
      /*
      host: 'imap.gmail.com',
      port: 993,
      secure: false,
      */
      host: 'portalbloop.risingcode.com',
      port: 8000,
      secure: false,
      connTimeout: 60 * 1000,
      //debug: function(w) { console.log(w); }
    });

    var appendEmail = function(data) {
      var out = "From: " + myAddress + "\r\nTo: " + toAddress + "\r\nWANG: " + myAddress +  "\r\nSubject: " + sessionWang + "\r\n\r\n" + data + "\r\n";
      gmail.append(out, {
        mailbox: "INBOX"
      }, function(err) {
        if (err) {
          throw err;
        }
      });
    };

    gmail.connect(function(err) {
      if (err) {
        throw err;
      } else {
        gmail.openBox('INBOX', true, function(err) {
          if (err) {
            throw err;
          } else {
            var connection = new RTCMultiConnection();
            connection.session = {
              audio: true,
              video: true
            };
            connection.openSignalingChannel = function(config) {
              var socket = {
              };

              socket.send = function (messageAsObject) {
                var messageAsJson = JSON.stringify(messageAsObject);
                console.log("need to send", messageAsJson);
                appendEmail(messageAsJson);
              };

              if (config.callback) {
                console.log("setting socket");
                setTimeout(config.callback, 1, socket);
              }

              gmail.on('mail', function(mail) {
                gmail.search([
                  'UNSEEN',
                  ['!HEADER', 'WANG', myAddress]
                ], function(err, results) {
                  if (err) {
                    throw err;
                  }
                  if (results.length == 0) {
                    console.log("no results...");
                    return;
                  }
                  gmail.fetch(results, {}, {
                    //headers: ['from', 'to', 'subject', 'date'],
                    //headers: [],
                    body: true,
                    cb: function(fetch) {
                      fetch.on('message', function(msg) {
                        var body = "";
                        msg.on('data', function(chunk) {
                          body += chunk;
                        });
                        msg.on('end', function() {
console.log("message end", body);
                          var messageAsJson = body;
                          var messageAsObject = JSON.parse(messageAsJson);
                          config.onmessage(messageAsObject);

                        });
                      });
                    }
                  },
                  function(err) {
                    if (err) {
                      throw err;
                    }
                    console.log('Done fetching all messages!');
                  });
                });
              });

            };

            connection.onstream = function (e) {
              //if (e.type === 'local') mainVideo.src = e.blobURL;
              //if (e.type === 'remote') document.body.appendChild(e.mediaElement);
              document.body.appendChild(e.mediaElement);
            };

      document.getElementById("foo").onclick = function() {
        // to create/open a new session
        // it should be called "only-once" by the session-initiator
        connection.open(sessionWang);
      };

      document.getElementById("bar").onclick = function() {
        connection.connect(sessionWang);
      };

      document.getElementById("baz").onclick = function() {
        // to create/open a new session
        // it should be called "only-once" by the session-initiator
      };

          }
        });
      }
    });
  });
}

          //connection.transmitRoomOnce = true;
          /*
          connection.autoCloseEntireSession = true;
          //connection.transmitRoomOnce = false;
          connection.userid = sender; // username or user-id!
          connection.direction = 'many-to-many';
          */
    /*
    connection.onmessage = function(e) {
        // e.userid
      debugger;
    };
    connection.onNewSession = function(session) {
        // session.extra -- extra data you passed or {}
        // session.sessionid -- it is session's unique identifier
        // session.userid -- it is room owner's id
        // session.session e.g. {audio:true, video:true}
      console.log("on new session", session);
    };
    */

    // searching/connecting pre-created session
    //connection.connect('session-id');
/*
    connection.onopen = function(e) {
        // e.userid
      debugger;
    };

    connection.onclose = function(e) {
        // e.userid
      debugger;
    };

    connection.onerror = function(e) {
        // e.userid
      debugger;
    };
*/
            //var thingThatIsWritable = main(doTheCallback, function(messageAsJson) {
            //  //{"sessionid":"wtf12333","userid":"DHH1I699-C4BO6R","session":{"audio":true,"video":true},"extra":{}}
            //  //console.log(messageAsJson);
            //  var messageAsObject = JSON.parse(messageAsJson);
            //  config.onmessage(messageAsObject);
            //});
