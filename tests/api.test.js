const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = require('chai');

const should = chai.should();
chai.use(chaiHttp);

const hostName = 'http://localhost:8080';

describe('/GET random route', () => {
  it('it should return 404', done => {
    chai
      .request(hostName)
      .get('/badroute')
      .end((err, res) => {
        res.should.have.status(404);
        // res.should.have.text("Sorry can't find that!");
        done();
      });
  });
});

let authToken;

describe('/GET a protected random route', () => {
  before(done => {
    chai
      .request(hostName)
      .post('/api/v1/auth/login')
      .type('form')
      .send({
        username: 'nomad1072',
        password: 'myRandomPassword'
      })
      .end((err, res) => {
        res.should.have.status(200);
        const text = JSON.parse(res.text);
        authToken = text.token;
        done();
      });
  });

  it('it should return 404 when protected bad route is accessed', done => {
    chai
      .request(hostName)
      .get('/api/v1/badroute')
      .set('x-jwt-token', authToken)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('should return JSONWebtoken error without access token', done => {
    chai
      .request(hostName)
      .get('/api/v1/badRoute')
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });
});

describe('testing api endpoints', () => {
  before(done => {
    chai
      .request(hostName)
      .post('/api/v1/auth/login')
      .type('form')
      .send({
        username: 'nomad1072',
        password: 'myRandomPassword'
      })
      .end((err, res) => {
        res.should.have.status(200);
        const text = JSON.parse(res.text);
        authToken = text.token;
        done();
      });
  });

  it('should return 200 with correct GET /api/v1/image/:id', done => {
    const name = encodeURI('Gingerseer Scale.jpg');
    chai
      .request(hostName)
      .get(`/api/v1/image/${name}`)
      .set('x-jwt-token', authToken)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('return 401 on invalid GET /api/v1/image/:id', done => {
    const name = 'Invalid name';
    chai
      .request(hostName)
      .get(`/api/v1/image/${name}`)
      .set('x-jwt-token', authToken)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
  });

  it('should return 200 on correct PATCH /api/v1/resource', done => {
    const patchObject = {
      resource: {
        name: 'Siddharth',
        username: 'nomad1072',
        place: 'Bangalore',
        random: 'bale'
      },
      patch: [
        { op: 'add', path: '/name', value: 'Siddharth Lanka' },
        { op: 'remove', path: '/random' }
      ]
    };
    chai
      .request(hostName)
      .patch('/api/v1/resource')
      .set('x-jwt-token', authToken)
      .send(patchObject)
      .end((err, res) => {
        res.should.have.status(200);
        const obj = JSON.parse(res.text);
        expect(obj.document).to.not.have.property('random');
        expect(obj.document.name).to.equal('Siddharth Lanka');
        expect(obj.document.username).to.equal('nomad1072');
        done();
      });
  });

  it('should return 400 on invalid PATH /api/v1/resource', done => {
    const patchObject = {
      resource: {
        name: 'Siddharth',
        username: 'nomad1072',
        place: 'Bangalore',
        random: 'bale'
      },
      patch: [
        { op: 'add', path: '/name', value: 'Siddharth Lanka' },
        { op: 'remove', path: '/random' },
        { op: 'random', path: '/something/random', value: 'something else' }
      ]
    };
    chai
      .request(hostName)
      .patch('/api/v1/resource')
      .set('x-jwt-token', authToken)
      .send(patchObject)
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });
});
