var should = require('./test/init.js');
var db;

db = getSchema();
UserData = db.define('UserData', {
  name : String,
  email : String,
  role : String,
  order : Number
});
db.automigrate(function () {
  seed(function () {
    UserData.all({
      where : {
        name : [1, '2', 'test', 3],
        or : [{
          name : 'Not a User'
        }, {
          order : '5'
        }]
      }
    }, function (err, users) {
      should.exists(users);
      should.not.exists(err);
      users.should.have.lengthOf(2);
      done();
    });
  });
});




function seed(done) {
  var count = 0;
  var beatles = [{
    name : 'John Lennon',
    mail : 'john@b3atl3s.co.uk',
    role : 'lead',
    order : 2
  }, {
    name : 'Paul McCartney',
    mail : 'paul@b3atl3s.co.uk',
    role : 'lead',
    order : 1
  }, {
    name : 'George Harrison', order : 5
  }, {
    name : 'Ringo Starr', order : 6
  }, {
    name : 'Pete Best', order : 4
  }, {
    name : 'Stuart Sutcliffe', order : 3
  }];
  UserData.destroyAll(function () {
    beatles.forEach(function (beatle) {
      UserData.create(beatle, ok);
    });
  });

  function ok(err) {
    if (++count === beatles.length) {
      done();
    }
  }
}

function setup(done) {
  require('./init.js');
  db = getSchema();

  blankDatabase(db, done);
}

var query = function (sql, cb) {
  db.adapter.query(sql, cb);
};

var blankDatabase = function (db, cb) {
  var dbn = db.settings.database;
  var cs = db.settings.charset;
  var co = db.settings.collation;
  query('DROP DATABASE IF EXISTS ' + dbn, function (err) {
    var q = 'CREATE DATABASE ' + dbn;
    if (cs) {
      q += ' CHARACTER SET ' + cs;
    }
    if (co) {
      q += ' COLLATE ' + co;
    }
    query(q, function (err) {
      query('USE ' + dbn, cb);
    });
  });
};
