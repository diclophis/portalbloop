// bloop

function die(err) {
  console.log('Uh oh: ' + err);
  //process.exit(1);
  throw err;
}

function bloop() {
  var util = require('util')
  var Imap = require('imap');

  var imap = new Imap({
    user: 'jon.j.mahone@gmail.com',
    password: 'qwerty123',
    host: 'imap.gmail.com',
    port: 993,
    secure: true
  });

  console.log(imap);

  imap.connect(function(err) {
    if (err) die(err);
    imap.openBox('INBOX', true, cb);
  });
}
