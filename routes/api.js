/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var db;
MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, connection) {
  if (err) console.log('Database error: ' + err);
  else {
    //console.log('Successful database connection');
    db = connection.db();
     }
});
module.exports = function (app) {


  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        db.collection('books').aggregate(
           [
              {
                 $project: {
                    title: 1,
                    commentcount: { $size: "$comments" }
                 }
              }
           ]
        ).toArray(function(err, books) {
          if (err) throw err;
          //console.log(books);
          res.json(books);
          //res.json({"_id": book.id, "title": book.title, "commentcount": book.comments });
          //res.send(book);
        });
        /*
        db.collection('books').find().forEach(function(book) {
        
        console.log(book);
        res.json(book);
        //res.json({"_id": book.id, "title": book.title, "commentcount": book.comments });
        //res.send(book);
      });
      /*db.collection('books').find().toArray(function(err, books) {
        if (err) throw err;
        console.log(books);
        res.json(books);
        //res.json({"_id": book.id, "title": book.title, "commentcount": book.comments });
        //res.send(book);
      });
      */
    })
    
    .post(function (req, res, next){
      
      var title = req.body.title;
      if (title === '') {
                      res.send('missing title');
      }else{
      //res.json({"title": title});
      //response will contain new book object including atleast _id and title
      db.collection('books').findOne({ title: req.body.title }, function (err, title) {
                  if(err) {
                      next(err);
                  
                  } else {
                      //console.log("inserted");
                      db.collection('books').insertOne(
                        {"_id": ObjectId(req.body._id), "title": req.body.title,
                         "comments": []},
                        (err, books) => {
                            if(err) {
                                throw err;                                
                            } else {
                                res.json(books.ops[0]);
                            }
                        }
                      )
                  }
              })
      }
    })
    
    .delete(function(req, res){
        db.collection('books').deleteMany( { } )
      
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      db.collection('books').findOne({ "_id": ObjectId(bookid) }, function (err, book) {
                  if(err) {
                      throw err;
                  } else if (book) {
                      res.json(book);
                  } else {                     
                      res.send("no book exists");      
                  }
              });
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      db.collection('books').findOneAndUpdate(
                  { "_id": ObjectId(bookid) },
                  {  $push: { comments: comment }  },
                  { returnOriginal: false }, function (err, book) {
                  if(err) {
                      throw err;
                  } else { 
                      //console.log('callback'+ JSON.stringify(book.value));
                      //console.log(bookid);
                      //res.setHeader('Content-Type', 'application/json');
                      //res.end({a:1});
                      //res.redirect('api/books'+ bookid+'"');
                    //console.log(book);
                    res.json(book.value);
                  }
              });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      db.collection('books').deleteOne({ "_id": ObjectId(bookid) }, function (err, book) {
                  if(err) {
                      throw err;
                  } else {                     
                      res.send("delete successful");
                  }
              });
    });
    
    
 

};
