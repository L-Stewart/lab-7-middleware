'use strict';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 8080;

const errorMiddleware = (error, request, response , next) => {
  console.log('Im an error and something is wrong');
  response.status(500);
  response.send('ERROR');
  next();
};

const my404 = (request, response, next) => {
  console.log('404 Page Not Not');
  response.status(404);
  response.send('The page you are looking for does not exist.')
  response.end();
};

const timeMethodPathMiddleware = (request,response, next) => {
  const date = Date();
  request.requestTime = date.toString();

  console.log(request.method);
  console.log(request.path);
  console.log(request.requestTime);
  next();
};

const cNumber = (request, response, next) => {
  if(request.path === '/c'){
    console.log(Math.random());
    next();
  }
  next();
};

const bSquare = (numberToBeSquared) => {

    return (request, response, next) => {

      if(request.path === '/b'){

        console.log(numberToBeSquared + ' :You want this squared.');
        request.number = Math.sqrt(numberToBeSquared);
        console.log(request.number + ' :The square of ' + numberToBeSquared);
        next();
      }
      next();
    };
};

const middles = [timeMethodPathMiddleware, cNumber, bSquare(64)];

app.get('/a',middles, (request, response, next) => {
  response.status(200).send('Route A');
  next();
});

app.get('/b',middles, (request, response, next) => {
  response.status(200).send('Route B' + response.body.number);
  // console.log(response);
  // response.send(response.body.number);
  next();
});

app.get('/c',middles, (request, response, next) => {
  response.status(200).send('Route C');
  next();
});

app.get('/d',middles, (request, response, next) => {
  response.status(200).send('Route D');
  next();
});


app.use(errorMiddleware);
// app.use(my404);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
