//
//"use strict";
/*jslint browser: true, node: true, regexp: true, sloppy: true, indent: 2 */

var assert = require('assert');
var util = require('util');
var imap = require('imap');
var when = require('when');
var RTCMultiConnection = require('./rtcmulticonnection');
var timeout = require('when/timeout');
var sequence = require('when/sequence');
var publicSecret = require('./secret');
var signalMailbox = 'BLOOP_SIGNAL';

var sessionWang = "wtf123333";
var sender = Math.round(Math.random() * 60535) + 5000;
var startDate = Date.now();
var seenMessages = {};
var channels = [];
var outstarted = {};
var broadcastTimeout = null;
var multiplexTimeout = null;
var lastSeq = 1;

var myUserId = null;
var broadcastTimeout = 3000;
var electionTimeout = 5000;
var waitTimeout = 11000;
var promiseToWaitForLeader = null;
var promiseToJoinExistingSession = null;
var waitedForLeader = null;
var leadingSession = true;


var sanitizeSessionWang = function(userEnteredValue) {
  return userEnteredValue.replace(/[^a-zA-Z0-9\-\_\.]/, '');
};


var resizeVideos = function() {
  switch (document.getElementsByTagName("video").length) {
    case 1:
      document.getElementById("content").className = "single-stream";
      break;
    case 2:
      document.getElementById("content").className = "double-stream";
      break;
    case 3:
    case 4:
      document.getElementById("content").className = "quad-stream";
      break;
    case 5:
    case 6:
      document.getElementById("content").className = "six-stream";
      break;
    case 7:
    case 8:
    case 9:
      document.getElementById("content").className = "nine-stream";
      break;
    case 10:
    case 11:
    case 12:
      document.getElementById("content").className = "twelve-stream";
      break;
  }
};


var thingThatMakesAnAppendEmailFun = function(twerpAddress, kwerkAddress, appendedFun) {
  return function(thingThatRespondsToAppend, subject, data, priority) {
    var out = "";
    out += "From: " + twerpAddress + "\r\n";
    out += "To: " + kwerkAddress + "\r\n";
    out += "Subject: " + subject + "\r\n";
    out += "Date: " + new Date() + "\r\n";
    out += "Priority: " + priority + "\r\n";
    out += "\r\n" + data + "\r\n";
    thingThatRespondsToAppend.append(out, {
      mailbox: 'WANGCHUNG'
    }, appendedFun);
  };
};


var thingThatMakesAnOnFetchFun = function (onFetchedEmailFun) {
  return function(fetch) {
    fetch.on("message", function(msg) {
      var body = "";
      var headers = null;
      msg.on('data', function(chunk) {
        body += chunk;
      });
      msg.on('headers', function(hdrs) {
        headers = hdrs;
      });
      msg.on('end', function() {
        console.log("got message", this.seqno, this.uid);
        lastSeq = this.seqno;
        var email = {
          uid: this.uid,
          headers: headers,
          from: headers.from[0],
          subject: headers.subject[0],
          body: body,
          priority: parseInt(headers.priority[0])
        };
        onFetchedEmailFun(email);
      });
    });
  };
};


var thingThatMakesAnOnSearchResultsFun = function(thingThatRespondsToFetch, onFetchedAllEmailsFun) {
  var searchResults = [];
  return function(err, results) {
    if (err) {
      throw err;
    }
    if (results.length == 0) {
    } else {
      var notseen = [];
      for (var i=0; i<results.length; i++) {
        if (typeof(seenMessages[results[i]]) === "undefined") {
          seenMessages[results[i]] = true;
          notseen.push(results[i]);
        }
      }
      if (notseen.length == 0) {
      } else {
        thingThatRespondsToFetch.seq.fetch(notseen, {}, {
          body: true,
          headers: ['Date', 'From', 'Subject', 'Priority'],
          cb: thingThatMakesAnOnFetchFun(function(fetchedEmail) {
            searchResults.push(fetchedEmail);
          })
        },
        function(err) {
          if (err) {
            throw err;
          }
          onFetchedAllEmailsFun(searchResults);
        });
      }
    }
  };
};


var createPromiseToReturnUserId = function(fromAddress, thingThatIsGmail4) {
  var efg = when.defer();
  var doneFetchingUserIdEmails = function(userIdEmails) {
    if (userIdEmails && userIdEmails.length) {
      myUserId = userIdEmails[0].uid;
      efg.resolve();
    }
  };
  var appendUserIdEmailFun = thingThatMakesAnAppendEmailFun(fromAddress, fromAddress, function(err, info) {
    if (err) {
      throw err;
    } else {
      thingThatIsGmail4.openBox('WANGCHUNG', false, function(err) {
        if (err) {
          throw err;
        } else {
          var userIdHandlingFun = thingThatMakesAnOnSearchResultsFun(thingThatIsGmail4, doneFetchingUserIdEmails);
          thingThatIsGmail4.seq.search([['HEADER', 'To', fromAddress]], userIdHandlingFun);
        }
      });
    }
  });
  appendUserIdEmailFun(thingThatIsGmail4, null, null);
  return efg.promise;
};


var foo = function(twerkAddress, thingThatRespondsToOpenBox) {
  return function(config) {
    var socket = {
    };
    var channel = config.channel || this.channel || 'WANGCHUNG';
    outstarted[channel] = config.onmessage;
    var appenderFun = thingThatMakesAnAppendEmailFun(twerkAddress, twerkAddress, function(err, info) {
      if (err) {
        throw err;
      }
    });
    socket.send = function (messageAsObject) {
      var messageAsJson = JSON.stringify({data: messageAsObject});
      appenderFun(thingThatRespondsToOpenBox, channel, messageAsJson, myUserId);
    };
    if (config.callback) {
      setTimeout(function() {
        channels.push({
          box: channel
        });
        config.callback(socket);
      }, 1000 / 24);
    }
  };
};


var createPromiseToConnectToExistingSession = function(rtcSignallingConnection) {
  var hij = when.defer();
  rtcSignallingConnection.connect(sanitizeSessionWang(sessionWang));
  waitingToJoinExistingSession = hij.resolver;
  return timeout(waitTimeout, hij.promise);
};


var createPromiseToInquireAboutLeader = function(fromAddress, thingThatIsGmail5) {
  var klm = when.defer();
  var appendElectionMessageFun = thingThatMakesAnAppendEmailFun(fromAddress, fromAddress, function(err, info) {
    if (err) {
      throw err;
    }
    console.log("waiting for alive message from leader");
  });
  appendElectionMessageFun(thingThatIsGmail5, "inquiry", null, myUserId);
  waitedForLeader = klm.resolver;
  return timeout(electionTimeout, klm.promise);
};


var createPromiseToBroadcastLeadership = function(fromAddress, thingThatIsGmail6) {
  var nop = when.defer();
  var appendLeaderMessageFun = thingThatMakesAnAppendEmailFun(fromAddress, fromAddress, function(err, info) {
    if (err) {
      throw err;
    }
    nop.resolve();
  });
  appendLeaderMessageFun(thingThatIsGmail6, "leader", null, myUserId);
  return nop.promise; 
};


var woop = function(a, b, c, d) {
  a.then( // this needs to be raised up
    function() { // leader is present
      console.log("conceding election higher prio present", myUserId, "?");
      b.connect(sanitizeSessionWang(sessionWang));
      leadingSession = false;
      promiseToWaitForLeader = null;
      waitForLeader = null;
    },
    function() { // I am the new leader
      console.log("broadcasting leadership");
      createPromiseToBroadcastLeadership(c, d).then(
        function() { // 
          b.open(sanitizeSessionWang(sessionWang));
          console.log("broadcasted leadership");
          //woop(a, b, c, d);
        }
      );
    }
  );
};


var thingThatMakesAnOnOpenOrConnectFun = function(fwerkAddress, thingThatIsGmail) {
  return function(sanitizedSession) {
    var createConnection = function() {
      var connection = new RTCMultiConnection();
      connection.session = {
        audio: true,
        video: true
      };
      connection.interval = broadcastTimeout; //re-broadcast
      connection.transmitRoomOnce = false; // if this is false
      //function(fartStarted2, appenderFun, twerkAddress, thingThatRespondsToOpenBox)
      connection.openSignalingChannel = foo(fwerkAddress, thingThatIsGmail);
      connection.onstream = function (e) {
        console.log("onstream");
        if (promiseToJoinExistingSession && waitingToJoinExistingSession) {
          waitingToJoinExistingSession.resolve();
        }
        //clearTimeout(broadcastTimeout);
        //document.getElementById("retry-form").className = "";
        document.getElementById("content").appendChild(e.mediaElement);
        resizeVideos();
      };
      //TODO: impl. err
      createPromiseToReturnUserId(fwerkAddress, thingThatIsGmail).then(
        function() { // got the highest process ID
          console.log("established prio", myUserId);
          promiseToJoinExistingSession = createPromiseToConnectToExistingSession(connection);
          promiseToJoinExistingSession.then(
            function() { // joined existing session
              console.log("started local video, joined session");
            },
            function() { // begin re-election
              console.log("begining election");
              // When a process P determines that the current coordinator is down because of message timeouts or failure of the coordinator to initiate a handshake,
              // it performs the following sequence of actions:
              // P broadcasts an election message (inquiry) to all other processes with higher process IDs, expecting an "I am alive" response from them if they are alive.
              // If P hears from no process with a higher process ID than it, it wins the election and broadcasts victory.
              // If P gets an election message (inquiry) from another process with a lower ID it sends an "I am alive" message back and starts new elections.
              // If P hears from a process with a higher ID, P waits a certain amount of time for that process to broadcast itself as the leader.
              // If it does not receive this message in time, it re-broadcasts the election message.
              promiseToWaitForLeader = createPromiseToInquireAboutLeader(fwerkAddress, thingThatIsGmail);
              woop(promiseToWaitForLeader, connection, fwerkAddress, thingThatIsGmail);
            }
          );
        }
      );
      return connection;
    };
    return createConnection();
  };
};


var connectToImapServer = function(secret) {
  var myAddress = secret.user + '+' + sender; // + '@gmail.com';
  var toAddress = secret.user; // + '@gmail.com';
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
    xxdebug: function(w) { console.log(w); }
  });

  var openOrConnectToSession = thingThatMakesAnOnOpenOrConnectFun(myAddress, gmail);
  var wha = null

  gmail.on("mail", function(args) {
    var doneFetchingNewMessages = function(newMessages) {
      if (newMessages && newMessages.length) {
        for (var i=0; i<newMessages.length; i++) {
          var newMessage = newMessages[i];
          //console.log(newMessage);
          //console.log("got something", newMessage);
          if (outstarted[newMessage.subject]) {
            if (newMessage.from != myAddress) {
              var messageAsJson = newMessage.body;
              var messageAsObject = JSON.parse(messageAsJson);
              outstarted[newMessage.subject](messageAsObject.data);
              console.log("got signal", messageAsObject);
            }
          } else if (newMessage.subject == "inquiry" || newMessage.subject == "leader" || newMessage.subject == "alive") {
            if (newMessage.from != myAddress) {
              if (newMessage.priority > myUserId) {
                // clear election timeout
                if (waitedForLeader && promiseToWaitForLeader && promiseToWaitForLeader.inspect().state == "pending") {
                  console.log("clearing");
                  waitedForLeader.resolve();
                }
                // clear waiting for leader timeout, fail restarts election, this case is success
                console.log("got higher prio inq, suceeding and clearing timeouts");
                //if (leadingSession) {
                  console.log("retry!");
                  promiseToWaitForLeader = createPromiseToInquireAboutLeader(myAddress, gmail);
                  woop(promiseToWaitForLeader, wha, myAddress, gmail);
                //}
                //promiseToSuceedElection.
              } else {
                console.log("need to respond to inq with alive");
                var appendAliveMessageFun = thingThatMakesAnAppendEmailFun(myAddress, myAddress, function(err, info) {
                  if (err) {
                    throw err;
                  }
                  console.log("send alive");
                });
                appendAliveMessageFun(gmail, "alive", null, myUserId);
              }
            }
          }
        }
      }
    };
    var newMessageHandlingFun = thingThatMakesAnOnSearchResultsFun(gmail, doneFetchingNewMessages);
    var range = (lastSeq) + ':*';
    //console.log("searching starting at", range);
    gmail.seq.search([[range]], newMessageHandlingFun);
  });
  gmail.connect(function(err) {
    if (err) {
      gmail._state.conn._socketInfo.socketId = null;
      showIndex(err.toString());
      throw err;
    } else {
      document.body.className = "connected";
      document.getElementById("baz").className = "enabled";
      document.getElementById("baz").onsubmit = function(ev) {
        document.getElementById("baz").className = "";
        return false;
      };
      document.getElementById("join-button").onclick = function() {
        wha = openOrConnectToSession(sanitizeSessionWang(sessionWang));
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
    document.getElementById("user-input").value = defaults['user'] ? defaults.user : "";
    document.getElementById("public-rooms").className = "enabled";
    document.getElementById("private-room").className = "enabled";
  });
  document.getElementById("public-rooms").onsubmit = function(ev) {
    hideIndexForms();
    connectToImapServer(publicSecret);
    return false;
  };
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
  };
  document.getElementById("msg").innerText = msg ? msg : "";
};


if (typeof(chrome) == "undefined") {
  throw "requires chrome";
} else {
  document.addEventListener("DOMContentLoaded", function() {
    showIndex();
  });
}
