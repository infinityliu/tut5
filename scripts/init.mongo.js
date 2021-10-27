/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.issues.remove({});

const issuesDB = [
  {
    id: 1, name: 'Harry', phoneNum: '11111111', created: new Date('2021-10-02T08:06:29'),
  },
  {
    id: 2, name: 'Henry', phoneNum: '22222222', created: new Date('2021-10-02T08:07:31'),
  },
  {
    id: 3, name: 'John', phoneNum: '33333333', created: new Date('2021-10-02T08:11:14'),
  }
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');

db.counters.remove({ _id: 'issues' });
db.counters.insert({ _id: 'issues', current: count });

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ name: 1 });
db.issues.createIndex({ phoneNum: 1 });
db.issues.createIndex({ created: 1 });
