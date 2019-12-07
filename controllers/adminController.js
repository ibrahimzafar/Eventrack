var express = require('express');
//var router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const Attendance = require('../models/eventAttendance');
const AdminUser = require('../models/admin');

//imports the adminuser model and the BcryptJS Library
// BcryptJS is a no setup encryption tool
const bcrypt = require('bcryptjs');

//require('dotenv').config();
const secret = process.env.SECRET || 'mysecret';
//gives us access to our environment variables 
//and sets the secret object.
const passport = require('passport');
const jwt = require('jsonwebtoken');
//imports Passport and the JsonWebToken library for some utilities


exports.test = function(req, res, next){
	res.json("Test is working");
};
exports.home = function(req, res, next) {
    res.render('index', { title: 'Express', email: req.session.email, token: req.session.token });
};
exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    AdminUser.findOne({ emailAddress: email }, (errors, user) => {
        if (!user) {
            let errors = "No Account Found";
            return res.status(404).json(errors);
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user._id,
                        name: user.name
                    };
                    jwt.sign(payload, secret, { expiresIn: 36000 },
                        (err, token) => {
                            if (err) res.status(500)
                                .json({
                                    error: "Error signing token",
                                    raw: err
                                });
                            //                               res.json({ success: true, token: `Bearer ${token}` });
                            req.session.token = `Bearer ${token}`;
                            req.session.email = email;
                            console.log('req.session');
                            console.log(req.session);
                            res.redirect('/home');
                        });
                } else {
                    let errors = "Password is incorrect";
                    res.status(400).json(errors);
                }
            });
    })
};
exports.logout = function(req, res, next){
    req.session.destroy(function(err) {
        // cannot access session here
        //logic to return to homepage
        res.redirect('/');

    });
};
exports.createEvent = function(req, res, next){
	console.log("hi");
    User.findOne({ name: req.body.name })
        .then(user => {
            if (user) {
                let error = 'Event Exists in Database.';
                return res.status(400).json(error);
            } 
            else {
				const myEvent = {
				    name: req.body.name,
				    start_date: req.body.start_date,
				    end_date: req.body.end_date,
				    details: req.body.details,
				    registration_link: req.body.registration_link,
				    address: req.body.address,
				    latitude: req.body.latitude,
				    longitude: req.body.longitude,
				    category: req.body.category,
				    creator_name: req.body.creator_name,
				    creator_email: req.body.creator_email,
				    creator_mobile: req.body.creator_mobile,
				    creator_CNIC: req.body.creator_CNIC,
				    approved: false
				};
				var newEvent = new Event(myEvent);
				newEvent.save().then(user => res.json(user))
			    .catch(err => res.status(400).json(err));				
            }
        });

};
exports.userEvents = function(req, res, next){
	console.log("userEvent in controller");
	
	User.findOne({ name: req.params.name })
	.then(user => {
		if (user){
			Attendance.find({ user_id: user._id }, (errors, attendances) => {
				console.log(attendances);
				res.status(200).json(attendances);
			})
		}
		else{
			res.status(200).json("User not in database.");
		}
	});
};
exports.adminRegister = (req, res) => {
    if (!req.body.emailAddress || !req.body.password) {
        return res.send('Must include email and password')
    }
    AdminUser.findOne({ emailAddress: req.body.emailAddress })
        .then(user => {
            if (user) {
                let error = 'Email Address Exists in Database.';
                return res.status(400).json(error);
            } else {
                const newUser = new AdminUser({
                    name: req.body.name,
                    emailAddress: req.body.emailAddress,
                    password: req.body.password,
                    mobile: req.body.mobile
                });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        console.log("Hash generated");
                        newUser.save().then(user => res.json(user))
                            .catch(err => res.status(400).json(err));
                    });
                });
            }
        });
};
/*
routes to define

get eventAttendees
get viewUnapprovedEvents
get viewEventDetails
post approveEvent

*/
//issue in this
exports.eventAttendees = function(req, res, next){
    //input event name
    //output user list
    console.log('hi');
    console.log(req.body)
    Event.findOne({ name: req.params.eventname})
    .then(theevent => {
        let allusers=[];
        let eventid = theevent._id;
        console.log('inside then');
        console.log(theevent);
        Attendance.aggregate([
            { $lookup:
                {
                    from:"User",
                    localField:"_id",
                    foreignField:"user_id",
                    as: theevent.name
                }
            },
            { $match:
                {
                    event_id: eventid
                }
            }
        ])/*.forEach(element => {
            let us = User.findOne({_id: element.user_id}).exec();
            allusers.push(us);
        })*/
        .then(results => {
            if (results){
                res.status(200).json({data:results});
            }
            else{
                res.status(200).json({"msg":'No Attendees'});
            }
        });
    });
};
exports.viewUnapprovedEvents = function(req, res, next){
    Event.find({ approved: false })
    .then(events =>{
        if (events){
            res.status(200).json({data:events});
        }
        else{
            let msg = 'No unapproved events';
            res.status(200).json({"msg":msg});
        }
    })
};
exports.approveEvent = function(req, res, next){
    console.log(req.body.name);
    Event.findOneAndUpdate({name: req.body.name},{approved: true})
    .then(done =>
        {
            if (done){
                let msg = 'Event Approved'
                res.status(200).json(msg);
            }
            else{
                let msg = 'Unable to approve event'
                res.status(200).json(msg);
            }
        }
    )
};
exports.viewEventDetails = function(req, res, next){
    Event.find({name: req.query.name})
    .then(eventt => {
        if (eventt){
            res.status(200).json({data:eventt});
        }
        else{
            msg='No event details found';
            res.status(200).json({"msg":msg});
        }
    })
};
exports.searchEventByName = function(req,res,next){
    //partialQuery
    console.log(req.params);
    console.log(req.params.partialQuery);
    var regex = new RegExp(req.params.partialQuery, "i")
	Event.find({name: regex})
	.then(doc=>{
		if(doc){
			res.status(200).json({data:doc});
		}
		else{
			let msg = 'No event found';
			res.status(200).json({"msg":msg});
		}
	});
};
exports.searchEventByLocation = function(req,res,next){
    //city 	
    var regex = new RegExp(req.params.location, "i")
	Event.find({address: regex})
	.then(doc=>{
		if(doc){
			res.status(200).json({data:doc});
		}
		else{
			let msg = 'No event found';
			res.status(200).json({"msg":msg});
		}
	});
};
exports.searchEventByDates = function(req,res,next){
    //startdate, enddate
	Event.find({start_date:{$gte:new Date(req.params.lower), $lte:new Date(req.params.upper)}})
	.then(doc=>{
		if(doc){
			res.status(200).json({data:doc});
		}
		else{
			let msg = 'No events found';
			res.status(200).json({"msg":msg});
		}
	});
};
exports.searchEventByCategory = function(req,res,next){
	//category
	Event.find({category:req.params.category})
	.then(doc=>{
		if(doc){
			res.status(200).json({data:doc});
		}
		else{
			let msg = 'No events found';
			res.status(200).json({"msg":msg});
		}
	});
};