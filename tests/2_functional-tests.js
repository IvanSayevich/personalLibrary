/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var randomstring = require('randomstring');

var testId = randomstring.generate({
  length: 24,
  charset: 'hex',
  capitalization: 'lowercase'
});

var wrongId = 'ac1265cc884c550ea5e96192';
chai.use(chaiHttp);

suite('Functional Tests', function() {
    
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .delete('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        done();
      });
  });
  
   ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ "_id": testId, "title": 'test'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isEmpty(res.body.comments, 'comments array  should be empty');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.equal(res.body.title, 'test', 'res.body.title should be "test"');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: ''})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing title', 'response should be "missing title"');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        
        chai.request(server)   
          .get('/api/books/' + wrongId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists', 'response should be "no book exists"');
            done();
         });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
            .get('/api/books/' + testId)
            
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'application/json', "Response should be json");
              assert.property(res.body, 'comments', 'Book should contain comments');
              assert.property(res.body, 'title', 'Book should contain title');
              assert.property(res.body, '_id', 'Book should contain _id');
              done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testId)
          .send({comment: 'comment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.isNotEmpty(res.body.comments, 'comments array should not be empty');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.property(res.body, '_id', 'Book should contain _id');
            assert.equal(res.body.title, 'test', 'res.body.title should be "test"');
            done();
          });
      });
      
    });

  });

});
