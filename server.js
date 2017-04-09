/**
 * Created by Rohail Najam on 3/18/2017.
 */

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.json());

router.route('/asyncmethod')
  .get(async function (req, res) {
    try {
      myAsyncFunction()
        .then(function (data) {
          res.send(data);
        }).catch(function (err) {
        res.send(err);
      })
    }catch (ex){
      res.send(ex);
    }
  });

app.use(router);

router.route('*')
  .all(function (req, res) {
    res.status(404).send('404 Man')
  });

app.listen(3000,function () {
  console.log('server listening on Port ',3000);
});


function myPromiseAPI() {
  myAPICall('https://jsonplaceholder.typicode.com/posts/1')
    .then(function (data) {
      // The Code will execute once the promise is resolved. Which is independent to code outside the then function
    });
  // Code that will run parallel to the promise making it a non blocking code.
  let result = 2 + 2;
}

async function myAsyncAPICall(){
  try {
    // Triggered the API Call
    let ApiCallPromise = myAPICall('https://jsonplaceholder.typicode.com/posts/1');
    // the code will not block. you can write your parallel code here
    let result = 2 + 2;
    // When you are done with your code... Wait for promise to resolve
    let data = await ApiCallPromise;
    // The Code will execute once the awaited call is resolved. Which is independent to other code
  }catch (ex){
    return ex;
  }
}



async function multipleAsyncAPICall(){
  try {
    // Triggered the API Call
    let dataPromise1 = myAPICall('https://jsonplaceholder.typicode.com/posts/1');
    // do you work...
    //....
    let dataPromise2 = myAPICall('https://jsonplaceholder.typicode.com/posts/2');
    // do your work
    // ...
    // when done with your other independent code
    // Now await for both Promises
    let [data1,data2] = await Promise.all([dataPromise1,dataPromise2]);
  }catch (ex){
    throw ex;
  }
}

async function myAsyncFunction() {
  try {
    let myPosts = [];
    let data = await myAPICall('https://jsonplaceholder.typicode.com/posts/1');
    myPosts.push(data);
    let data2 = await myAPICall('https://jsonplaceholder.typicode.com/posts/2');
    myPosts.push(data2);
    let data3 = await myAPICall('https://jsonplaceholder.typicode.com/posts/3');
    myPosts.push(data3);
    return myPosts;
  }catch (ex){
    // console.log("here",ex);
    throw ex;
  }
}


async function MultipleAPICalls() {
  try {
    let myPosts = await Promise.all([
      myAPICall('https://jsonplaceholder.typicode.com/posts/1'),
      myAPICall('https://jsonplaceholder.typicode.com/posts/2'),
      myAPICall('https://jsonplaceholder.typicode.com/posts/3')
    ]);
    return myPosts;
  }catch (ex){
    return ex;
  }
}

function myAPICall(url) {
  return new Promise(function (resolve, reject) {
    request.get(url,function (err, res, body) {
      if(err){
        reject(err);
      }else {
        resolve(body);
      }
    })
  });
}