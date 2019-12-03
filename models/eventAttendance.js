const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/final_project', { useNewUrlParser: true });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const EventAttendanceSchema = new Schema({
    user_id: {
        type: ObjectId,
        required: true
    },
    event_id: {
        type: ObjectId,
        required: true
    }     
});

module.exports = mongoose.model('EventAttendance', EventAttendanceSchema);