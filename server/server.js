require('dotenv').config();
require('./config/DB').connect();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');

global.__basedir = __dirname;
//middleware............................................
app.use(express.json());
const allowlist = [
	'http://localhost:3000',
	'http://localhost:3001',
	'http://localhost:3002',
	'http://192.168.1.36:3000',
	'http://192.168.1.36:3001',
	'http://192.168.1.36:3002',
	'https://factory-jobs.com',
	'https://www.factory-jobs.com',
	'https://manager.factory-jobs.com',
	'https://team.factory-jobs.com',
];

const corsOptionsDelegate = (req, callback) => {
	let corsOptions;

	let isDomainAllowed = allowlist.indexOf(req.header('Origin')) !== -1;

	if (isDomainAllowed) {
		// Enable CORS for this request
		corsOptions = { origin: true, credentials: true };
	} else {
		// Disable CORS for this request
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

app.use(cookieParser());
app.use(express.static(__dirname + 'static'));
//Routes.............................................................

// Error Handler...............................................................
app.use(require('./middleware/error'));

app.get('/', async (req, res) => {
	res.status(200).json({
		success: true,
		message: 'API Working',
	});
});

app.use('/auth', require('./routes/auth/auth'));

app.use('/candidate', require('./routes/Candidate'));

app.use('/team', require('./routes/Team'));

app.use('/manager', require('./routes/Manager'));

app.use('/fileupload', require('./utils/FileUpload'));

app.get('/images/:imageID', (req, res) => {
	res.sendFile(__dirname + '/static/uploads/' + req.params.imageID);
});

const server = app.listen(9000, () =>
	console.log(`Server running at ${getIndianTime()} on port 9000 `)
);

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged Error at ${getIndianTime()}: ${err.message}`);
	server.close(() => process.exit(1));
});

const getIndianTime = () => {
	d = new Date();

	utc = d.getTime() + d.getTimezoneOffset() * 60000;

	nd = new Date(utc + 3600000 * +5.5);
	return nd.toLocaleString('en-GB');
};
