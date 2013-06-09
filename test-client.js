//

var assert = require('assert')
var util = require('util')
var imap = require('imap');

/*
var forge = require('node-forge');
var client = forge.tls.createConnection({
  server: false,
  caStore: [],
  sessionCache: {},
  // supported cipher suites in order of preference
  cipherSuites: [
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
  virtualHost: 'imap.gmail.com',
  verify: function(connection, verified, depth, certs) {
    return true;
  },
  connected: function(connection) {
    console.log('connected');
    // send message to server
    //connection.prepare('Hi server!');
  },
  tlsDataReady: function(connection) {
    // TLS data (encrypted) is ready to be sent to the server
    // console.log("tlsDataReady", connection.tlsData.getBytes());
    // if you were communicating with the server below, you'd do:
    // server.process(connection.tlsData.getBytes());
  },
  dataReady: function(connection) {
    // clear data from the server is ready
    console.log('the server sent: ' + connection.data.getBytes());
    // close connection
    connection.close();
  },
  closed: function(connection) {
    console.log('disconnected');
  },
  error: function(connection, error) {
    console.log('uh oh', error);
  }
});
// start the handshake process
client.handshake();
*/

var gmail = new imap({
  user: 'jon.j.mahone@gmail.com',
  password: 'qwerty123',
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
  console.log(mail);
});

function openInbox(cb) {
  gmail.connect(function(err) {
    if (err) die(err);
    gmail.openBox('INBOX', true, cb);
  });
}

if (true) {
  openInbox(function(err, mailbox) {
    if (err) die(err);
    gmail.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
      if (err) die(err);
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
  });
}

if (typeof(chrome) == "undefined") {
  var http = require('http');
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('');
  }).listen(8124, "127.0.0.1");
  console.log('ctrl-c to stop');
}
