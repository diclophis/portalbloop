//

var assert = require('assert');
var util = require('util');
var imap = require('imap');
var when = require('when');
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

var myUserId = null;


var sanitizeSessionWang = function(userEnteredValue) {
  return userEnteredValue.replace(/[^a-zA-Z0-9\-\_\.]/, '');
};


var resizeVideos = function() {
  switch(document.getElementsByTagName("video").length) {
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
  };
};


var thingThatMakesAnAppendEmailFun = function(twerpAddress, kwerkAddress, appendedFun) {
  return function(thingThatRespondsToAppend, subject, data) {
    var out = "From: " + twerpAddress + "\r\nTo: " + kwerkAddress + "\r\nSubject: " + subject + "\r\nDate: " + new Date() + "\r\n\r\n" + data + "\r\n";
    thingThatRespondsToAppend.append(out, {
      mailbox: 'WANGCHUNG'
    }, appendedFun);
  };
};


var thingThatMakesAnOnFetchFun = function (onFetchedEmailFun) {
  return function(fetch) {
    fetch.on('message', function(msg) {
      var body = "";
      var headers = null;
      msg.on('data', function(chunk) {
        body += chunk;
      });
      msg.on('headers', function(hdrs) {
        headers = hdrs;
      });
      msg.on('end', function() {
        //console.log("inbound on channel", thingy);
        //var date = headers['date'] ? headers.date[0] : '01/01/01';
        //var thingy = headers.subject[0];
        var email = {
          uid: this.uid,
          headers: headers,
          body: body
        };
        //if (startDate < Date.parse(date)) {
          //var messageAsJson = body;
          //var messageAsObject = JSON.parse(messageAsJson);
          //console.log(outstarted);
          //if (wangs[thingy]) {
          //  wangs[thingy](messageAsObject.data);
          //}
        //}
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
      //future.resolve(needsafun2);
      //onFetchedAllEmailsFun(null);
    } else {
      var notseen = [];
      for (var i=0; i<results.length; i++) {
        if (typeof(seenMessages[results[i]]) === "undefined") {
          seenMessages[results[i]] = true;
          notseen.push(results[i]);
        }
      }
      if (notseen.length == 0) {
        //future.resolve(needsafun2);
        //onFetchedAllEmailsFun(null);
      } else {
        thingThatRespondsToFetch.fetch(notseen, {}, {
          body: true,
          headers: ['Date', 'Subject'],
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


var search = function(notFromThisAddress, thingThatRespondsToSearch) {
  var abc = when.defer();
  var needsafun = function() {};
  var signalHandlingFun = thingThatMakesAnOnSearchResultsFun(outstarted, thingThatRespondsToSearch, abc, needsafun);
  thingThatRespondsToSearch.search(['UNSEEN', ['!HEADER', 'From', notFromThisAddress]], signalHandlingFun);
  return abc.promise;
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
          thingThatIsGmail4.search([['HEADER', 'To', fromAddress]], userIdHandlingFun);
        }
      });
    }
  });
  appendUserIdEmailFun(thingThatIsGmail4, null, null);
  return efg.promise;
};


var multiplex = function(addressToIgnore) {
  if (channels.length > 0) {
    var searches = [];
    var prom = search(addressToIgnore);
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
      //setTimeout(multiplex, 1000 / 24, addressToIgnore);
      console.log("search assured");
    });
  }

  setTimeout(multiplex, 1000 / 24, addressToIgnore);
};


var foo = function(fartStarted2, appenderFun, twerkAddress, thingThatRespondsToOpenBox) {
  return function(config) {
    var socket = {
    };
    var channel = config.channel || this.channel || 'WANGCHUNG';
    outstarted[channel] = config.onmessage;
    console.log("new channel", channel);
    socket.send = function (messageAsObject) {
      var messageAsJson = JSON.stringify({data: messageAsObject});
      appenderFun(thingThatRespondsToOpenBox, channel, messageAsJson, function(err) {
        if (err) {
          throw err;
        }
      });
    };
    if (channels.length == 0) {
      thingThatRespondsToOpenBox.openBox('WANGCHUNG', false, function(err) {
        if (err) {
          throw err;
        } else {
          if (config.callback) {
            setTimeout(function() {
              channels.push({
                box: channel
              });
              // HACK multiplex();
              config.callback(socket);
            }, 1000 / 24);
          }
        }
      });
    } else {
      setTimeout(function() {
        config.callback(socket);
      }, 1000 / 24);
    }
  };
};


var thingThatMakesARetryFun = function(thingThatRespondsToDelBox, sanitizedSession2, connectionCreationFun) {
  return function() {
    console.log("retrying");
    document.getElementById("retry-form").className = "";
    thingThatRespondsToDelBox.delBox('WANGCHUNG/' + sanitizedSession2, function(err) {
      console.log('deleted', sanitizedSession2, err);
      createdConnection = connectionCreationFun();
    });
    //bloopConnection.open(sanitizeSessionWang(sessionWang));
  };
};


var thingThatMakesAnOnOpenOrConnectFun = function(fartStarted3, appendEmailFun2, fwerkAddress, thingThatIsGmail) {
  return function(sanitizedSession) {
    var createConnection = function() {
      var connection = new RTCMultiConnection();
      connection.session = {
        audio: true,
        video: true
      };
      connection.interval = 2500; //re-broadcast
      connection.transmitRoomOnce = false; // if this is false
      //function(fartStarted2, appenderFun, twerkAddress, thingThatRespondsToOpenBox)
      connection.openSignalingChannel = foo(fartStarted3, appendEmailFun2, fwerkAddress, thingThatIsGmail);
      connection.onstream = function (e) {
        console.log("clearing retry timer");
        clearTimeout(broadcastTimeout);
        document.getElementById("retry-form").className = "";
        document.getElementById("content").appendChild(e.mediaElement);
        resizeVideos();
      };

      /*
      var retry = thingThatMakesARetryFun(thingThatIsGmail, sanitizedSession, createConnection);
      var currentMinute = new Date().getMinutes();
      console.log("attempting to lock", currentMinute, sanitizedSession);
      thingThatIsGmail.addBox('WANGCHUNG/' + sanitizedSession, function(err) {
        if (err && err.code != 'ALREADYEXISTS') {
          throw err;
        } else if (err) {
          console.log("joining!!!", currentMinute, err);
          connection.connect(sanitizeSessionWang(sessionWang));
          broadcastTimeout = setTimeout(function() {
            retry();
          }, (60 * 1000) + (Math.random() * 10000));
        } else {
          console.log("opening!!!", currentMinute);
          connection.open(sanitizeSessionWang(sessionWang));
        }
      });
      //return connection;
      */

      //TODO: impl. err
      createPromiseToReturnUserId(fwerkAddress, thingThatIsGmail).then(function() {
        console.log(myUserId);
      });
    };
    //var bloopConnection = createConnection();
    createConnection();
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
        //function(fartStarted3, appendEmailFun, fwerkAddress, thingThatIsGmail) {

        var appendEmailFun = thingThatMakesAnAppendEmailFun(myAddress, toAddress);
        var openOrConnectToSession = thingThatMakesAnOnOpenOrConnectFun(outstarted, appendEmailFun, myAddress, gmail);
        openOrConnectToSession(sanitizeSessionWang(sessionWang));
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
            //if (e.type === 'local') mainVideo.src = e.blobURL;
            //if (e.type === 'remote') document.body.appendChild(e.mediaElement);
          // first person
          //   new channel wtf12333
          //   idles ... waits for ??? (new sidechannels)
          //   opens sidechannel for new guest
          // second person
          //   new channel wtf12333
          //   new channel GX71UN17-C4BO6R 
            /*
            document.getElementById("retry-form").onsubmit = function(ev) {
              document.getElementById("retry-form").className = "";
              return false;
            };
            document.getElementById("retry-button").onclick = function(ev) {
              retry();
            };
            */

            //retryFormTimeout = setTimeout(function() {
            //  document.getElementById("retry-form").className = "enabled";
            //}, 1000);
            //console.log("mkdir", sanitizedSession);
