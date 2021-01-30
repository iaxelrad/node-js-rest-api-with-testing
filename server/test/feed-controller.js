const { PASSWORD } = require('../config');

const expect = require('chai').expect;
const mongoose = require('mongoose');
const sinon = require('sinon');

const io = require('../socket');
const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
  before(function (done) {
    mongoose
      .connect(`mongodb+srv://iaxelrad:${PASSWORD}@shopcluster.3k5qt.mongodb.net/test-messages`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(result => {
        const user = new User({
          email: 'test@example.com',
          password: 'tester',
          name: 'Test',
          posts: [],
          _id: '5c0f66b979af55031b34728a',
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function () {});

  afterEach(function () {});

  it('should add a created post to the posts of the creator', function (done) {
    const stub = sinon.stub(io, 'getIO').callsFake(() => {
      return {
        emit: function () {},
      };
    });

    const req = {
      body: { title: 'Test Post', content: 'A Test Post' },
      file: { path: 'abc' },
      userId: '5c0f66b979af55031b34728a',
    };

    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    FeedController.createPost(req, res, () => {}).then(savedUser => {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      stub.restore();
      done();
    });
  });
});

after(function (done) {
  User.deleteMany({})
    .then(() => {
      return mongoose.disconnect();
    })
    .then(() => {
      done();
    });
});
