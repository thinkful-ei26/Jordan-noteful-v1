
const app = require('../server');
const chai = require('chai');
const chaiHttp = require ('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);


describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  
});
  
describe('404 handler', function () {
  
    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  
});

describe('Notes Default', function () {

    it('GET request "/api/notes" should return the default array', function () {
        return chai.request(app)
            .get('/api/notes')
            .then (function (res) {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res).to.be.an('object').that.includes(res);
                expect(res).to.not.be.undefined;
        });
    });  
});      

describe('Notes by ID', function () {
    
    it ('GET request on "/api/notes/:id" should return given ID object')
        return chai.request(app)
            .get('/api/notes:id')
            .then (function (res) {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res).to.be.an('object').that.includes(res);
            });
});

describe('Notes by ID 404 handler', function() {

    it('GET request on "/api/notes/:id" should return 404 for invalid id')
        return chai.request(app)
            .get('/DOES/NOT/EXIST')
            .then(res => {
                expect(res).to.have.status(404);
            });
});

