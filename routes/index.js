const plnRouter = require('./pln-pasca.route');

const router = require('express').Router();

router.use('/pln-pasca', plnRouter);

module.exports = router;
