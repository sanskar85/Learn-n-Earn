const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
var path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'static/uploads');
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4() + path.extname(file.originalname));
	},
});

const upload = multer({ storage: storage }).single('file');

const FileUpload = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(500).json({
				success: false,
				message: 'File Upload Failed',
			});
		}
		return res.status(201).json({
			success: true,
			message: req.file.filename,
		});
	});
};
module.exports = FileUpload;
