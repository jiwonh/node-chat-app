const path = require('path');
const publicPath = path.join(__dirname, '../../public/');

module.exports = (app, users) => {
  app.get('/partials/*', (req, res) => {
    res.render(publicPath + req.params[0]);
  });

  app.get('/', (req, res) => {
    res.render('index', {
      title: 'Join | Chat App',
      rooms: users.getRoomList()
    });
  });

  app.get('/chat', (req, res) => {
    res.render('chat', {
      title: 'Chat | Chat App'
    });
  });
};
