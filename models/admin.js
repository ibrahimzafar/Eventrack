const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/final_project', { useNewUrlParser: true });

const Schema = mongoose.Schema;
const AdminUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    emailAddress:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('AdminUser', AdminUserSchema);