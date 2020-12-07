module.exports = function (app) {
  app.get('/', function (req, res) {
    // res.send('hello expressjs');
    res.render('home');
  })

  app.get('/about', function (req, res) {
    res.render('about');
  })

  app.get('/bs', function (req, res) {
    // res.sendFile(__dirname + '/bs.html');
    res.render('bs', {
      layout: false
    });
  })

  app.use('/admin/categories', require('../routes/category.route'));
  app.use('/admin/products', require('../routes/product.route'));
  app.use('/account', require('../routes/_account.route'));
  app.use('/products', require('../routes/_product.route'));
  app.use('/demo', require('../routes/_demo.route'));
};
