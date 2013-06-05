chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
  /*
var ImapConnection = require('./imap').ImapConnection, util = require('util'),
    imap = new ImapConnection({
      username: 'mygmailname@gmail.com',
      password: 'mygmailpassword',
      host: 'imap.gmail.com',
      port: 993,
      secure: true
    });

function die(err) {
  console.log('Uh oh: ' + err);
  process.exit(1);
}

var box, cmds, next = 0, cb = function(err) {
  if (err)
    die(err);
  else if (next < cmds.length)
    cmds[next++].apply(this, Array.prototype.slice.call(arguments).slice(1));
};

cmds = [
  function() { imap.connect(cb); },
  function() { imap.openBox('INBOX', false, cb); },
  function(result) { box = result; imap.search([ 'UNSEEN', ['SINCE', 'May 20, 2010'] ], cb); },
  function(results) {
    var fetch = imap.fetch(results, { request: { headers: ['from', 'to', 'subject', 'date'] } });
    fetch.on('message', function(msg) {
      console.log('Got message: ' + util.inspect(msg, false, 5));
      msg.on('data', function(chunk) {
        console.log('Got message chunk of size ' + chunk.length);
      });
      msg.on('end', function() {
        console.log('Finished message: ' + util.inspect(msg, false, 5));
      });
    });
    fetch.on('end', function() {
      console.log('Done fetching all messages!');
      imap.logout(cb);
    });
  }
];
cb();
*/

});
