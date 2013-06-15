//

var assert = require('assert');
var util = require('util');
var imap = require('imap');
var when = require('when');
var sequence = require('when/sequence');
var publicSecret = require('./secret');
var signalMailbox = 'BLOOP_SIGNAL';

var sessionWang = "wtf12333";
var sender = Math.round(Math.random() * 60535) + 5000;
var startDate = Date.now();
var seenMessages = {};
var channels = [];
var outstarted = {};

if (typeof(chrome) == "undefined") {
  throw "requires chrome";
} else {
  document.addEventListener("DOMContentLoaded", function() {
    var connectToImapServer = function(secret) {
    var myAddress = secret.user + '+' + sender + '@gmail.com';
    var toAddress = secret.user + '@gmail.com';
    console.log(secret);
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
      var out = "From: " + myAddress + "\r\nTo: " + toAddress + "\r\nSubject: " + box + "\r\nDate: " + new Date() + "\r\n\r\n" + data + "\r\n";
      gmail.append(out, {
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
            'UNSEEN',
            ['!HEADER', 'From', myAddress]
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
                  headers: ['Date', 'Subject'],
                  cb: function(fetch) {
                    fetch.on('message', function(msg) {
                      var body = "";
                      var headers = null;
                      msg.on('data', function(chunk) {
                        body += chunk;
                      });
                      msg.on('headers', function(hdrs) {
                        headers = hdrs; //.subject[0];
                      });
                      msg.on('end', function() {
                        //console.log("inbound on channel", thingy);
                        var date = headers['date'] ? headers.date[0] : '01/01/01';
                        var thingy = headers.subject[0];
                        if (startDate < Date.parse(date)) {
                          var messageAsJson = body;
                          var messageAsObject = JSON.parse(messageAsJson);
                          //console.log(outstarted);
                          if (outstarted[thingy]) {
                            outstarted[thingy](messageAsObject.data);
                          }
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

    var multiplex = function() {
      if (channels.length > 0) {
        var searches = [];
        var prom = search();
        searches.push(prom);
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
          setTimeout(multiplex, 1000 / 24);
        });
      } else {
        setTimeout(multiplex, 1000 / 24);
      }
    };

    var foo = function(config) {
      var socket = {
      };
      var channel = config.channel || this.channel || 'WANGCHUNG';
      outstarted[channel] = config.onmessage;
      console.log("new channel", channel);
      socket.send = function (messageAsObject) {
        var messageAsJson = JSON.stringify({data: messageAsObject});
        appendEmail(channel, messageAsJson);
      };
      gmail.addBox('WANGCHUNG', function(err) {
        if (err && err.code != 'ALREADYEXISTS') {
          throw err;
        }
        if (config.callback) {
          channels.push({
            box: channel
          });
          setTimeout(config.callback, 1000 / 24, socket);
        }
      });
    };

      gmail.connect(function(err) {
        if (err) {
          gmail._state.conn._socketInfo.socketId = null;
          showIndex(err.toString());
          throw err;
        } else {
          multiplex();
          var connection = new RTCMultiConnection();
          connection.session = {
            audio: true,
            video: true
          };
          connection.transmitRoomOnce = true;
          connection.openSignalingChannel = foo;
          connection.onstream = function (e) {
            document.body.appendChild(e.mediaElement);
          };
          document.body.className = "connected";
          document.getElementById("baz").className = "enabled";
          document.getElementById("baz").onsubmit = function(ev) {
            document.getElementById("baz").className = "";
            return false;
          };
          document.getElementById("foo").onclick = function() {
            connection.open(sessionWang);
          };
          document.getElementById("join-button").onclick = function() {
            connection.connect(sessionWang);
          };
        }
      });
    };

    var hideIndexForms = function() {
      document.getElementById("about").className = "";
      document.getElementById("public-rooms").className = "";
      document.getElementById("private-room").className = "";
      document.getElementById("msg").innerText = "";
    };

    var showIndex = function(msg) {
      document.getElementById("about").className = "enabled";

      chrome.storage.sync.get(function(defaults) {
        console.log(defaults);
        document.getElementById("user-input").value = defaults['user'] ? defaults.user : "";
        document.getElementById("public-rooms").className = "enabled";
        document.getElementById("private-room").className = "enabled";
      });

      document.getElementById("public-rooms").onsubmit = function(ev) {
        hideIndexForms();
        connectToImapServer(publicSecret);
        return false;
      }
      document.getElementById("private-room").onsubmit = function(ev) {
        hideIndexForms();
        var user = document.getElementById("user-input").value;
        var pass = document.getElementById("pass-input").value;
        chrome.storage.sync.set({user: user});
        connectToImapServer({
          user: user,
          pass: pass
        });
        return false;
      }

      document.getElementById("msg").innerText = msg ? msg : "";
    }

    showIndex();
  });

}
            //if (e.type === 'local') mainVideo.src = e.blobURL;
            //if (e.type === 'remote') document.body.appendChild(e.mediaElement);
