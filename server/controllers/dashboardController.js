const Note = require('../models/Notes');
const mongoose = require('mongoose');

// Get dashboard
exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: 'NebulaNex Note.',
    description: 'Note all with nebulanex',
  };

  try {
    Note.aggregate([
      {
        $sort: { updatedAt: -1 },
      },
      {
        $match: { user: mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $project: {
          title: { $substr: ['$title', 0, 30] },
          body: { $substr: ['$body', 0, 100] },
          updatedAt: {
            $dateToString: {
              format: '%H:%M:%S | %d-%m-%Y',
              date: '$updatedAt',
              timezone: 'Asia/Jakarta', // Adjust the timezone as needed
            },
          },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function (err, notes) {
        Note.count().exec(function (err, count) {
          if (err) return next(err);

          res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            layout: '../views/layouts/dashboard',
            notes,
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();

  if (note) {
    res.render('dashboard/view-note', {
      userName: req.user.firstName,
      NoteID: req.params.id,
      note,
      layout: '../views/layouts/view-layout',
    });
  } else {
    res.send('Somthing went wrong.');
  }
};

exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, body: req.body.body, updatedAt: Date.now() }).where({ user: req.user.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardAddNote = async (req, res) => {
  res.render('dashboard/add', {
    layout: '../views/layouts/view-layout',
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardSearch = async (req, res) => {
  try {
    res.render('dashboard/search', {
      searchResult: '',
      layout: '../views/layouts/search',
    });
  } catch (error) {
    console.log(error);
  }
};

exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    // Menghapus special character yang ada dalam input search
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

    // Mencari sensitiv data yang ada di body dan tittle
    const searchResult = await Note.find({
      $or: [{ title: { $regex: new RegExp(searchNoSpecialChars, 'i') } }, { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } }],
    }).where({ user: req.user.id });
    res.render('dashboard/search', {
      searchResult,
      layout: '../views/layouts/search',
    });
  } catch (error) {
    console.log(error);
  }
};
