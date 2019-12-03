var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const Attendance = require('../models/eventAttendance');

exports.test = function(req, res, next){
	res.json("Test is working");
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


exports.attendEvent = function(req,res,next){
	User.findOne({emailAddress: req.body.email})
		.then(user=>{
			Event.findOne({name: req.body.event_name})
				.then(event=>{
					Attendance.findOne({$and:[{user_id: user._id}, {event_id: event._id}]})
						.then(attend=>{
							if (attend){
								let error = "User already attending the event.";
								return res.status(400).json(error);
							}
							else{
								const tempattend = {
									user_id: user._id,
									event_id: event._id
								};
								var newAttendance = new Attendance(tempattend);
								newAttendance.save().then(user => res.json(user))
								.catch(err => res.status(400).json(err));	
							}
			});
		});
	});
};
