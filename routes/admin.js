var express = require('express');
var router = express.Router();
const adminController = require('../controllers/adminController');



router.post('/adminRegister', adminController.adminRegister);
router.post('/login', adminController.login);
/* GET home page. */
router.get('/home', adminController.home);

//router.method('/path', passport.authenticate('jwt', {session: false}), (req,res) => ... );
router.post('/logout', adminController.logout);
router.get('/eventAttendees/:eventname', adminController.eventAttendees);
router.get('/viewUnapprovedEvents', adminController.viewUnapprovedEvents);
router.get('/viewEventDetails', adminController.viewEventDetails);
router.post('/approveEvent',adminController.approveEvent);

router.get('/userEvents/:name', adminController.userEvents);
/*
routes to define

get userEvents
get EventAttendees
get viewUnapprovedEvents
get viewEventDetails
post approveEvent

*/
router.get('/searchByName/:partialQuery',adminController.searchEventByName);
router.get('/searchByLocation/:location',adminController.searchEventByLocation);
router.get('/searchByDates/:lower/:upper',adminController.searchEventByDates);
router.get('/searchByCategory/:category',adminController.searchEventByCategory);

module.exports = router;