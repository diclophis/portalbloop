//

var assert = require('assert')
var util = require('util')
var imap = require('imap');
var secret = require('./secret');

var sessionWang = "wtf12333";
var sender = Math.round(Math.random() * 60535) + 5000;
var myAddress = secret.user + '+' + sender + '@gmail.com';
var toAddress = secret.user + '@gmail.com';

function main(onMessageFunction) {
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
    debug: function(w) { console.log(w); }
  });

  gmail.on('mail', function(mail) {
    gmail.search([
      'UNSEEN',
      ['SINCE', 'May 20, 2010'],
      ['!FROM', myAddress]
    ], function(err, results) {
      if (err) {
        throw err;
      }
      gmail.fetch(results,
        { headers: ['from', 'to', 'subject', 'date'],
          cb: function(fetch) {
            fetch.on('message', function(msg) {
              console.log('Saw message ', msg);


    var messageAsJson = "{wang:true}";
    onMessageFunction(messageAsJson);


              //msg.on('headers', function(hdrs) {
              //  console.log('Headers for no. ' + msg.seqno + ': ' + console.log(hdrs));
              //});
              //msg.on('end', function() {
              //  console.log('Finished message no. ' + msg.seqno);
              //});
            });
          }
        }, function(err) {
          if (err) throw err;
          console.log('Done fetching all messages!');
        }
      );
    });

  });

  gmail.connect(function(err) {
    if (err) {
      throw err;
    } else {
      gmail.openBox('INBOX', true, function(err) {
        if (err) {
          throw err;
        } else {
          /*
          document.getElementById("spam-button").addEventListener('click', function() {
            (function appendEmail() {
              gmail.append("From: jon.j.mahone@gmail.com\r\nTo: jon.j.mahone@gmail.com\r\nSubject: data\r\ndata\r\n", {
                mailbox: "INBOX"
              }, function(err) {
                console.log("append errored", err);
              });
              console.log("???????????", appendEmail);
              setTimeout(appendEmail, 1000);
            })();
          });
          */
        }
      });
    }
  });

            (function appendEmail() {
              gmail.append("From: jon.j.mahone@gmail.com\r\nTo: jon.j.mahone@gmail.com\r\nSubject: data\r\ndata\r\n", {
                mailbox: "INBOX"
              }, function(err) {
                console.log("append errored", err);
              });
              console.log("???????????", appendEmail);
              setTimeout(appendEmail, 1000);
            });

  /*
      gmail.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
        if (err) {
          console.log(err);
          return;
        }
        gmail.fetch(results,
          { headers: ['from', 'to', 'subject', 'date'],
            cb: function(fetch) {
              fetch.on('message', function(msg) {
                console.log('Saw message no. ' + msg.seqno);
                msg.on('headers', function(hdrs) {
                  console.log('Headers for no. ' + msg.seqno + ': ' + console.log(hdrs));
                });
                msg.on('end', function() {
                  console.log('Finished message no. ' + msg.seqno);
                });
              });
            }
          }, function(err) {
            if (err) throw err;
            console.log('Done fetching all messages!');
            //imap.logout();
          }
        );
      });
  */

  return gmail;
}

if (typeof(chrome) == "undefined") {
  main();
  var http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
  }).listen(8124, "127.0.0.1");
  console.log('ctrl-c to stop');
} else {
  document.addEventListener("DOMContentLoaded", function() {
    var connection = new RTCMultiConnection();
    connection.session = {
      audio: true,
      video: true
    };
    /*
    connection.autoCloseEntireSession = true;
    //connection.transmitRoomOnce = false;
    connection.userid = sender; // username or user-id!
    connection.direction = 'many-to-many';
    */
    connection.openSignalingChannel = function(config) {
      //var channel = config.channel || this.channel || 'Default-Socket';
      //console.log("openSignalingChannel", channel, sender, config);
      console.log(config);

      var socket = {
      };

      var thingThatIsWritable = main(function(messageAsJson) {
        //{"sessionid":"wtf12333","userid":"DHH1I699-C4BO6R","session":{"audio":true,"video":true},"extra":{}}
        var messageAsObject = JSON.parse(messageAsJson);
        config.onmessage(messageAsObject);
      });

      socket.send = function (messageAsObject) {
        var messageAsJson = JSON.stringify(messageAsObject);
        console.log("need to send", messageAsJson);
        thingThatIsWritable.write(messageAsJson);
      };

      if (config.callback) {
        console.log("setting socket");
        setTimeout(config.callback, 1, socket);
      }

      if (config.onopen) {
        setTimeout(config.onopen, 1);
      }
    };

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

    // get access to local or remote streams
    connection.onstream = function (e) {
      console.log("onstream", e);
      //if (e.type === 'local') mainVideo.src = e.blobURL;
      //if (e.type === 'remote') document.body.appendChild(e.mediaElement);
      document.body.appendChild(e.mediaElement);
    };

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

    document.getElementById("foo").onclick = function() {
      // to create/open a new session
      // it should be called "only-once" by the session-initiator
      connection.open(sessionWang);
    };

    document.getElementById("bar").onclick = function() {
      connection.connect(sessionWang);
    };
  });
}
