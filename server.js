require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const shortid = require('shortid');
const cors = require('cors');

app.use(express.json())
app.use(cors())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));


app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    const urls = ShortUrl.find()
    res.json(urls)
});

console.log("Test")


//shorten url and add to db
app.post('/shorturl', async (req, res) => {
    const shortUrl = await new ShortUrl({
        original_url: req.body.url,
        short_url: shortid.generate()
    })

    try {
        await shortUrl.save();
        res.status(201).json({ message: 'Short url created', shortUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/:shortUrl', async (req, res) => {
    res.redirect((await ShortUrl.findOne({ short_url: req.params.shortUrl })).original_url)
})



//start server
app.listen(process.env.PORT, () => {
    console.log('Server started');
})
