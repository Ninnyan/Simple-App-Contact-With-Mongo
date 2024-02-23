const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult } = require('express-validator');
const Contact = require('./model/contact')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const mongoose = require('mongoose');
const { ObjectId } = require('bson');

require('./utils/db')

const app = express()
const port = 3000


// Environment
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({extended:true}))

// Third Party Konfigurasi Flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())


// Main`
app.get('/', (req,res) => {
    const mahasiswa = [
        {
            nama: 'Ichihou Ririka',
            email: 'Ririka@mail.com'
        },
        {
            nama: 'Noel',
            email: 'Noel@mail.com'
        },
        {
            nama: 'Kazusa',
            email: 'Kazusa@mail.com'
        },
    ]


    res.render('index', { 
        nama: 'Ichijou Ririka',
        title: 'Welcome Home',
        mahasiswa,
        layout: 'layouts/main'

    })

})

app.get('/about', (req,res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'Welcome About'
    })
})


app.get('/contact', async (req,res) => {

    const contacts = await Contact.find()
    
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Welcome Contact',
        contacts,
        msg: req.flash('msg')
    })
})


app.get('/contact/add', (req,res) => {
    res.render('add-contact', {
        layout: 'layouts/main',
        title: 'Tambah Contact',
    })
})


app.post('/contact', [
    body('nama').custom(async (value) => {
        // console.log(value);
        const cek = await Contact.findOne({nama: value})
        if (cek) {
            throw new Error('Nama Sudah Dipakai, Mohon Masukan Nama lain')
        }
        return true
    }),
    body('email').isEmail().withMessage('Email Tidak Sesuai'),
    body('noHP').isMobilePhone('id-ID').withMessage(`noHP Bukan Termasuk no Indonesia, Silahkan Input sesuai Pedoman no Seluler yang berlaku di Indonesia ~~! `)
    ],

    async (req,res) => {
    
    const result = validationResult(req);  

    if(!result.isEmpty()) {
        res.render('add-contact', {
            layout: 'layouts/main',
            title: 'Tambah Contact',
            result: result.array()
        })
    } else { 

        await Contact.create(req.body)

        req.flash('msg', 'Data Contact Berhasil Ditambahkan !')
        res.redirect('/contact')
    }

    
})


app.get('/contact/delete/:id', async (req,res) => {
    const id = await Contact.findOne({_id: new ObjectId(req.params.id)})

    if (!id) {
        res.status(404).send('<h1>404</h1>')
    } else {
        await Contact.deleteOne({_id: new ObjectId(req.params.id)})
        req.flash('msg', `Data Contact ${id.nama} Berhasil Dihapus !!`)
        res.redirect('/contact')
    }
})

app.get('/contact/edit/:id', async (req,res) => {
    const id = await Contact.findOne({_id: new ObjectId(req.params.id)})


    res.render('edit-contact', {
        layout: 'layouts/main',
        title: 'Tambah Contact',
        id
    })
})

app.post('/contact/update', [
    body('nama').custom(async (value, {req}) => {

        const cek = await Contact.findOne({nama: value})
        if (value !== req.body.oldNama && cek) {
            throw new Error('Nama Sudah Dipakai, Mohon Masukan Nama lain')
        }
        return true
    }),
    body('email').isEmail().withMessage('Email Tidak Sesuai'),
    body('noHP').isMobilePhone('id-ID').withMessage(`noHP Bukan Termasuk no Indonesia, Silahkan Input sesuai Pedoman no Seluler yang berlaku di Indonesia ~~! `)
    ],

    async (req,res) => {
        
    const result = validationResult(req);  

    if(!result.isEmpty()) {
        res.render('edit-contact', {
            layout: 'layouts/main',
            title: 'Update Contact',
            result: result.array(),
            id: req.body
        })
    } else {
        const id = await Contact.findById(req.body.oldId)
        
        await Contact.findByIdAndUpdate(req.body.oldId, req.body)
        
        req.flash('msg', `Data Contact ${id.nama} Berhasil Diubah, Menjadi ${req.body.nama} !`)
        res.redirect('/contact')
    }
})



app.get('/contact/:id', async (req,res) => {
    const id = await Contact.findOne({_id: new ObjectId(req.params.id)})
    
    res.render('detail', {
        layout: 'layouts/main',
        title: 'Detail Contact',
        id
    })

})


app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`)
  })