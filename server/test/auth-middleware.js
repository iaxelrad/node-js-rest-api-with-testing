const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleWare = require('../middleware/is-auth');

describe('Auth Middleware', function () {
  // ** a unit test **
  it('should throw an error if no authorization header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
  });

  it('should throw an error if the authorization header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'xyz';
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if the token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer xyz';
      },
    };
    expect(authMiddleWare.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding ', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer jkdshfklah';
      },
    };
    sinon.stub(jwt, 'verify');

    jwt.verify.returns({ userId: 'abc' });
    authMiddleWare(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
