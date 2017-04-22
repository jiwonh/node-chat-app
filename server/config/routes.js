const path = require('path');
const publicPath = path.join(__dirname, '../../public/');

module.exports = (app) => {
  app.get('/partials/*', (req, res) => {
    res.render(publicPath + req.params[0]);
  });

  app.get('/', (req, res) => {
    res.render('index');
  });
};
