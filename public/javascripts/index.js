//

var assert = require('assert');
var util = require('util');
var imap = require('imap');
var when = require('when');
var sequence = require('when/sequence');
var secret = require('./secret');

var sessionWang = "wtf12333";
var sender = Math.round(Math.random() * 60535) + 5000;
var myAddress = secret.user + '+' + sender + '@gmail.com';
var toAddress = secret.user + '@gmail.com';
var startDate = new Date();
var seenMessages = {};
var channels = [];
var outstarted = {};

if (typeof(chrome) == "undefined") {
  throw "requires chrome";
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

    var appendEmail = function(box, data) {
      var out = "From: " + myAddress + "\r\nTo: " + toAddress + "\r\nWANG: " + myAddress +  "\r\nCHANNEL: " + box + "\r\nSubject: " + sessionWang + "\r\n\r\n" + data + "\r\n";
      gmail.append(out, {
        //mailbox: 'WANG/' + box 
        mailbox: 'WANGCHUNG'
      }, function(err) {
        if (err) {
          throw err;
        }
      });
    };

    var search = function() {
      var abc = when.defer();
      var needsafun = function() {
      };
      gmail.openBox('WANGCHUNG', false, function(err) {
        if (err) {
          throw err;
        } else {
          gmail.search([
            'UNSEEN'
            //['!HEADER', 'WANG', myAddress]
          ], function(err, results) {
            if (err) {
              throw err;
            }
            if (results.length == 0) {
              abc.resolve(needsafun);
            } else {
              var notseen = [];
              for (var i=0; i<results.length; i++) {
                if (typeof(seenMessages[results[i]]) === "undefined") {
                  seenMessages[results[i]] = true;
                  notseen.push(results[i]);
                } else {
                }
              }

              if (notseen.length == 0) {
                abc.resolve(needsafun);
              } else {
                gmail.fetch(notseen, {}, {
                  body: true,
                  headers: 'CHANNEL',
                  cb: function(fetch) {
                    fetch.on('message', function(msg) {
                      var body = "";
                      var thingy = null;
                      msg.on('data', function(chunk) {
                        body += chunk;
                      });
                      msg.on('headers', function(headers) {
                        //console.log(headers);
                        thingy = headers.channel[0];
                      });
                      msg.on('end', function() {
                        //console.log("inbound on channel", thingy);
                        var messageAsJson = body;
                        var messageAsObject = JSON.parse(messageAsJson);
                        //console.log(outstarted);
                        if (outstarted[thingy]) {
                          outstarted[thingy](messageAsObject.data);
                        }
                      });
                    });
                  }
                },
                function(err) {
                  if (err) {
                    throw err;
                  }
                  abc.resolve(needsafun);
                });
              }
            }
          });
        }
      });

      return abc.promise;
    };

    gmail.connect(function(err) {
      if (err) {
        throw err;
      } else {
           

        (function multiplex() {
          if (channels.length > 0) {
            var searches = [];


            //for (var i=0; i<channels.length; i++) {
              //var channl = channels[i];
              //var channelCallbackFunc = channl.callbackFunc;
              //var channelBox = channl.box;
              //console.log(channelCallbackFunc);
              var prom = search();
              searches.push(prom);
            //}

            var tail = sequence(searches);
            tail.then(function(a) {
              //console.log("resolve!!!!!", a);
            },
            function(b) {
              //console.log("fail", b);
            },
            function(c) {
              //console.log("notify", c);
            }).ensure(function(a) {
              setTimeout(multiplex, 100);
            });
          } else {
            setTimeout(multiplex, 100);
          }
        })();

        var foo = function(config) {
          var socket = {
          };
          var channel = config.channel || this.channel || 'WANGCHUNG';
          outstarted[channel] = config.onmessage;
          console.log("new channel", channel);
          socket.send = function (messageAsObject) {
            var messageAsJson = JSON.stringify({data: messageAsObject});
            //console.log("outbound on channel", channel);
            appendEmail(channel, messageAsJson);
          };
          gmail.addBox('WANGCHUNG', function(err) {
            if (err) {
              //throw err;
              //console.log(err);
            }
            if (config.callback) {
              channels.push({
                box: channel
                //callbackFunc: config.onmessage
              });
              //console.log("CHAN", channels, outstarted);
              setTimeout(config.callback, 1, socket);
            }
          });
        };
        var connection = new RTCMultiConnection();
        connection.session = {
          audio: true,
          video: true
        };
        connection.transmitRoomOnce = true;
        connection.openSignalingChannel = foo;
        connection.onstream = function (e) {
          //if (e.type === 'local') mainVideo.src = e.blobURL;
          //if (e.type === 'remote') document.body.appendChild(e.mediaElement);
          document.body.appendChild(e.mediaElement);
        };
        document.body.className = "connected";
        document.getElementById("baz").onsubmit = function(ev) {
          document.getElementById("baz").className = "disabled";
          return false;
        };
        document.getElementById("foo").onclick = function() {
          connection.open(sessionWang);
        };
        document.getElementById("bar").onclick = function() {
          connection.connect(sessionWang);
          //document.getElementById("baz").className = "disabled";
        };
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
