
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

describe('GET /api/notes', function () {

    it('should return the default array', function () {
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

describe('GET /api/notes/:id', function () {
    
    it('should return the right note by ID', function () {
        return chai.request(app)
            .get('/api/notes/1001')
            .then(res => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys('id', 'title', 'content');
                expect(res.body.id).to.equal(1001);
            });  
        });                  

    it('should return 404 if ID does not exist', function () {
        return chai.request(app)
            .get('/DOES/NOT/EXIST')
            .then(res => {
                expect(res).to.have.status(404);
                expect(res).to.not.be.NaN;
            });  
    });
});                         

describe('POST /api/notes', function () {

    it('should create and return new item with location header', function() {
       const newItem = { 'title': "Sharks are very cool", 'content': "lorem ipsum" }
       return chai.request(app)
            .post('/api/notes')
            .send(newItem)
            .then (res => {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res).to.have.header('location');
                expect(res.body.id).to.equal(1010);
                expect(res.body.title).to.equal(newItem.title);
                expect(res.body.content).to.equal(newItem.content);
            });   
        });

    it('should return error if title is missing', function() {      
        const newItem = { 'fake': 'fake' };
        return chai.request(app)
            .post('/api/notes')
            .send(newItem)
            .then(res => {
                expect(res).to.have.status(400);
                expect(res).to.be.json;
                expect(res.body.message).to.equal('Missing `title` in request body');
            })
    });
});

describe('PUT /api/notes:id', function (){

    it('should update and return a note when given valid data')

    it('should respond with 404 for invalid id')

    it('should return an object w msg when missing "title" field')
});

describe('DELETE /api/notes/:id', function () {

    it('should delete an item by id')

});