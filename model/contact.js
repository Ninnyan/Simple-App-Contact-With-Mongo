const mongoose = require('mongoose')


const contactSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true
    },
    noHP : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

const Contact = new mongoose.model('Contact',contactSchema)





module.exports = Contact