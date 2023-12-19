// Get dashboard
exports.login = async (req, res) => {
  const locals = {
    title: 'NebulaNex | Login.',
    description: 'Note all with nebulanex',
  };
  res.render('login', {
    locals,
    layout: '../views/layouts/login',
  });
};
