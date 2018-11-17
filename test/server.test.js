
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
            .then (res => {
                expect(res).to.exist;
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res).to.be.an('object').that.includes(res);
        });
    });    
    
    it('should include all the right fields', function () {
        return chai.request(app)
            .get('/api/notes')
            .then(res => {
                expect(res).to.have.status(200);
                res.body.forEach(item => {
                    expect(item).to.include.keys('id', 'title', 'content');
                });
            }); 
    });        
    
    it('should return correct result for a valid query', function () {
        return chai.request(app)
            .get('/api/notes?searchTerm=about%20cats')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(4);
            });
    });

    it('should return empty array for incorrect query', function () {
        return chai.request(app)
            .get('/api/notes?searchTerm=Not%20a%20Valid%20Search')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.length(0);
            });
    });
            
});           

describe('Notes by ID', function () {
    
    it ('GET request on "/api/notes/:id" should return given ID object')
        const id = 1001
        return chai.request(app)
            .get('/api/notes:id')
            .send(id)
            .then (res => {
                expect(Object.keys({id})).to.satisfy(function() {
                    return id;
                })
                expect(res).to.have.status(200);
                expect(res.body.id).to.exist;
                expect(res).to.be.an('object').that.includes(res);
            });
});

describe('Notes by ID 404 handler', function() {

    it('GET request on "/api/notes/:id" should return 404 for invalid id')
       const id = 3001
        return chai.request(app)
            .get('/DOES/NOT/EXIST')
            .send(id)
            .then(res => {
                expect(res).to.have.status(404);
                expect(res).to.not.be.NaN;
            });    
});

describe('New Note with Location Header', function () {

    it('POST request on "api/notes" should create and return new item with location header')
       const newItem = { id: 1011, title: "sharks", content: "lorem ipsum" }
        return chai.request(app)
            .post('/api/notes')
            .send(newItem)
            .then (function (res) {
                expect(res).to.have.header('x-api-key');
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body.title).to.exist;
            });   
});

describe('New Note with Missing Title', function () {
    
    it('POST request on "api/notes" should return an object with message when no title')
    const missingTitle = "";
    return chai.request(app)
            .post('/api/notes')
            .send(missingTitle)
            .then(function (res) {
                expect(res).to.include(missingTitle);
                expect(res.body.title).to.satisfy(function(obj) {
                    return obj = { msg: "Missing title in request body"};
                });
            });
});