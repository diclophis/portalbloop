//

var assert = require('assert')
var util = require('util')
var imap = require('imap');
var secret = require('./secret');

function main() {
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
    console.log("!!!!!!!!!!!!!!!!!!!!!!!", mail);
  });

  gmail.connect(function(err) {
    if (err) {
      throw err;
    } else {
      gmail.openBox('INBOX', true, function(err) {
        if (err) {
          throw err;
        } else {
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
        }
      });
    }
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
    main();
  });
}
