// Get homepage
exports.homepage = async (req, res) => {
  const locals = {
    title: 'NebulaNex',
    description: 'Note all with nebulanex',
  };
  res.render('index', locals);
};
