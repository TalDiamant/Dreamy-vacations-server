var express = require("express");
var router = express.Router();
var mySocketHelper = require('../utilities/mysockethelper');
const db = require("../DB/db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
db.sequelize.sync();

const cors = require("cors");
router.use(cors());

//data-tables required
const AllVacations = require("../models/vacations");
const AllUserVacations = require("../models/user-vacations");

// End points

router.get("/", async (req, res) => {

  let userid = req.query.userid;

  if (userid == 0) {
    res.json({
      userFavoriteVacations: [],
      allWebVacations: []
    });
  }

  else {
    AllUserVacations.findAll({ //find user's vacations by his userid
      where: {
        userid: userid
      }
    })
      .then(alluservacations => {

        let usersVacationsObj = {};

        let usersVacationsIds = [];
        for (let i = 0; i < alluservacations.length; i++) {
          usersVacationsIds.push(alluservacations[i].dataValues.vacationid);
        }

        AllVacations.findAll({
          where: {
            id: {
              [Op.in]: usersVacationsIds
            }
          }
        }).then(favoriteVacation => {
          usersVacationsObj.userFavoriteVacations = favoriteVacation;

          AllVacations.findAll({
            where: {
              id: {
                [Op.notIn]: usersVacationsIds
              }
            }
          })
            .then(allWebVacation => {
              usersVacationsObj.allWebVacations = allWebVacation;

              res.json(usersVacationsObj);
            })
            .catch(err => {
              res.json(err);
              console.log(err);
            });
        });
      })
      .catch(err => {
        res.json(err);
        console.log(err);
      });
  }
});

router.post("/followvacation", async (req, res) => {

  followedVacation = {
    userid: req.body.userid,
    vacationid: req.body.vacationid,
    destination: req.body.destination
  };

  await AllUserVacations.create(followedVacation);

  let alluservacations = await AllUserVacations.findAll({});

  res.json({ alluservacations, status: "Vacation is followed now!" });

});

router.post("/unfollowvacation", async (req, res) => {
  
  unfollowedVacation = {
    userid: req.body.userid,
    vacationid: req.body.vacationid,
    destination: req.body.destination
  };

  await AllUserVacations.destroy(
    {
      where: {
        userid: unfollowedVacation.userid,
        vacationid: unfollowedVacation.vacationid,
        destination: unfollowedVacation.destination
      }
    });

  let alluservacations = await AllUserVacations.findAll({});

  res.json({ alluservacations, status: "Vacation is unfollowed now!" });
});

router.get('/adminvacations', async (req, res) => {
  AllVacations.findAll({})
    .then(allvacations => {
      res.json(allvacations);
    })
    .catch(err => {
      res.json(err);
      console.log(err);
    })
})

router.delete("/deletevacation", async (req, res) => {

  deletedVacation = { id: req.body.id };
  deletedSpecVacation = { vacationid: req.body.vacationid };

  //for socket updates//
  AllUserVacations.findAll({
    where: {
      vacationid: deletedSpecVacation.vacationid
    }
  }).then(resp => {
    if (resp == 0) {
      mySocketHelper.sendMessage("One of our vacations was deleted!");
    }
    else {
      mySocketHelper.sendMessage("One of your vacations was deleted!");
    }
  }).catch(err => {
    res.json(err);
    console.log(err);
  })
  //for socket updates//


  await AllVacations.destroy(
    {
      where: {
        id: deletedVacation.id
      }
    });

  await AllUserVacations.destroy(
    {
      where: {
        vacationid: deletedSpecVacation.vacationid
      }
    });

  let allvacations = await AllVacations.findAll({});
  let alluservacations = await AllUserVacations.findAll({});

  res.json({ allvacations, alluservacations, status: "Vacation was deleted" });

});

router.put('/updatevacation', async (req, res) => {

  await AllVacations.update({
    description: req.body.description,
    destination: req.body.destination,
    picture: req.body.picture,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price
  },
    {
      where: {
        id: req.body.id
      }
    });

  let allvacations = await AllVacations.findAll({});

  res.json({ allvacations, status: "Vacation was updated" });

  //for socket updates//
  updatedVacation = req.body.id;
  let resp = await AllUserVacations.findAll({
    where: {
      vacationid: updatedVacation
    }
  });

  if (resp == 0) {
    mySocketHelper.sendMessage( "One of our vacations was updated!");
  }
  else {
    mySocketHelper.sendMessage( "One of your vacations was updated!");
  }
  //for socket updates//

})

router.get('/followedvacations', async (req, res, next) => {
  AllUserVacations.findAll({})
    .then(followedVacations => {
      res.json(followedVacations);
    })
    .catch(err => {
      res.json(err);
      console.log(err);
    })
});

router.get('/countfollowers', async (req, res, next) => {
  AllUserVacations.findAll({
    group: ['vacationid'],
    attributes: ['vacationid', [Sequelize.fn('COUNT', 'vacationid'), 'followersCount']],
  }).then(resp => {
    res.json(resp);
  })
    .catch(err => {
      res.json(err);
      console.log(err);
    })
});

router.post('/add', async (req, res) => {

  newVacation = {
    description: req.body.destination,
    destination: req.body.description,
    picture: req.body.picture,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    price: req.body.price
  };

  await AllVacations.create(newVacation);

  let vacationswithnew = await AllVacations.findAll({});

  res.json({ vacationswithnew, status: "New vacation was added!" });

  //for socket updates//
  mySocketHelper.sendMessage("New vacation was added!");

});

module.exports = router;

