const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/belajar'


main().catch(err => console.log(err));


async function main() {
    await mongoose.connect(url);
}
