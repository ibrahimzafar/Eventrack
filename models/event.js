const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/final_project', { useNewUrlParser: true });
//"<YYYY-mm-dd>"
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    registration_link: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    creator_name: {
        type: String,
        required: true
    },
    creator_email:{
        type: String,
        required: true,
        unique: true,
    },
    creator_mobile:{
        type: String,
        unique: true
    },
    creator_CNIC: {
        type: String,
        required: false
    },
    approved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Event', EventSchema);