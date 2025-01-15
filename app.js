require("dotenv").config();
const express = require('express')
const router = require('./routes');
const { syncModels } = require("./models/sequelize");
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', true);

app.use(router);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: err.message
    })
})

app.listen(port, async () => {
    await syncModels();
    console.log(`Example app listening on port ${port}`)
})