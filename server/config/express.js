const express = require('express');
const path = require('path');
const publicPath = path.join(__dirname, '../../public/');

module.exports = (app) => {
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname,'../views'));

  app.use(express.static(publicPath));
};
