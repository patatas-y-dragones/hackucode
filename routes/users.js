var express = require('express');
var router = express.Router();

/* GET final listing. */
router.get('/final', (req, res) => {
	res.sendFile('final.html', {
		root: path.join(__dirname, '../')
	})
});

module.exports = router;
