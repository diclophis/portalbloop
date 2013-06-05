// bloop

var util = require('util')
var Imap = require('imap');

var imap = new Imap({
  user: 'jon.j.mahone@gmail.com',
  password: 'qwerty123',
  host: 'portalbloop.risingcode.com',
  port: 8000,
  secure: false
});

function die(err) {
  console.log('Uh oh: ' + err);
  //process.exit(1);
  throw err;
}


function bloop() {




/*
  imap.connect(function(err) {
    if (err) die(err);
    imap.openBox('INBOX', true, cb);
  });
*/

  function openInbox(cb) {
    return;
    imap.connect(function(err) {
      if (err) die(err);
      imap.openBox('INBOX', true, cb);
    });
  }

  openInbox(function(err, mailbox) {
    if (err) die(err);
    imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], function(err, results) {
      if (err) die(err);
      imap.fetch(results,
        { headers: ['from', 'to', 'subject', 'date'],
          cb: function(fetch) {
            fetch.on('message', function(msg) {
              console.log('Saw message no. ' + msg.seqno);
              msg.on('headers', function(hdrs) {
                console.log('Headers for no. ' + msg.seqno + ': ' + show(hdrs));
              });
              msg.on('end', function() {
                console.log('Finished message no. ' + msg.seqno);
              });
            });
          }
        }, function(err) {
          if (err) throw err;
          console.log('Done fetching all messages!');
          imap.logout();
        }
      );
    });
  });
}
