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

app.get('/initiate', async (req, res) => {
	const company_name = 'ABC Pvt';
	const application_id = '1234ABCD56';
	const years = '2';
	const stipend = '12300';
	const timing = '4th Oct 2021 9:30 am';
	const doc = new PDFDocument({ autoFirstPage: false });
	doc.pipe(res);
	// doc.pipe(fs.createWriteStream(__basedir + `/static/offer-letters/${offer.application_id}.pdf`));
	doc.addPage({
		margins: {
			top: 50,
			bottom: 50,
			left: 30,
			right: 0,
		},
	});

	doc.image(__basedir + '/static/assets/d934ed8b-dd96-440e-9491-7523302dab8f.png', 30, 25);
	doc.image(__basedir + '/static/assets/0ecd73f8-dad7-40c3-aea7-086063fa6dec.png', 435, 25, {
		width: 130,
	});
	doc.text(`Dear, `, 30, 100);
	doc.text(`Date: 27-Sep-2021`, 450, 100);
	doc.text(`F/N Mr. `, 30, 115);
	doc.text(`Applicant ID : ${application_id}`, 450, 115);
	doc.text(`Highest Qualification `, 30, 130);
	doc.text(`Aadhaar Number : `, 30, 145);
	doc.text(`Mobile Number  : `, 30, 160);
	doc.text(`District :, State : `, 30, 175);
	doc.text(`Pincode : `, 30, 190);

	doc.text(`Subject: Provisional Offer for NEEM Training Program`, 30, 220, { underline: true });

	doc.text(
		`Nettur Technical Training Foundation (NTTF), one of the premier technical training institutions in the country, partnering with ${company_name} has announced the admissions to the “National Employability Enhancement Mission” – ‘NEEM’ Program under the aegis of AICTE. The objective of this training is “Skill building through on-the-job training at the designated industry” conducted as per NTTF’s LEARN AND EARN training model.`,
		30,
		250,
		{
			width: 535,
		}
	);
	doc.text(
		`With reference to your application and the screening/ counselling session you attended, we are pleased to provisionally select you for consideration of ${years} Years Learn and Earn programme leading to “Diploma in Manufacturing Technology” certification conducted by Nettur Technical Training Foundation, Bangalore. Please note that this training to you is free of cost. Upon admission to this programme you are entitled to get monthly stipend amount Rs. ${stipend}/- approx. in your bank account. This program does not guarantee any sort of employment either in the Partner industry or in NTTF and this is only a skill-oriented Technical Training program conducted at our partner industry to enable you to acquire the industry employable skills.`,
		30,
		350,
		{
			width: 535,
		}
	);
	doc
		.text(
			'NTTF’s ‘Learn and Earn’ programme will be conducted through on-the-job training at ',
			30,
			490,
			{
				continued: true,
			}
		)
		.font('Times-Bold')
		.text(company_name, {
			continued: true,
		})
		.font('Times-Roman')
		.text(' along with regular theory sessions, by NTTF.');
	// doc.rect(10, 90, 590, 0.1).stroke();
	doc
		.font('Times-Bold')
		.text(`The Programme will commence from ${timing}. Please report on time .`, 30, 530);

	doc.rect(30, 550, 535, 20).stroke();
	doc.fontSize(10);
	doc.text(`Initial Rope-In / Induction Classes / Theory will be conducted at`, 40, 555);
	doc.text(`OJT / Practical classes will be conducted at`, 350, 555);
	doc.rect(30, 550, 300, 200).stroke();
	doc.rect(330, 550, 235, 200).stroke();

	doc
		.fontSize(12)
		.font('Times-Roman')
		.text('rope_in_1', 30, 580, {
			width: 300,
			align: 'center',
		})
		.text('rope_in_2', 30, 595, {
			width: 300,
			align: 'center',
		})
		.text('rope_in_3', 30, 610, {
			width: 300,
			align: 'center',
		})
		.text('rope_in_4', 30, 625, {
			width: 300,
			align: 'center',
		})
		.font('Times-Italic')
		.fillColor('blue')
		.text(`Google Location - `, 30, 640, {
			width: 300,
			align: 'center',
		})
		.font('Times-Roman')
		.fillColor('black')
		.text('for any assistance', 30, 665, {
			width: 300,
			align: 'center',
		})
		.text('assistance', 30, 675, {
			width: 300,
			align: 'center',
		})
		.text('or email ', 30, 685, {
			width: 300,
			align: 'center',
		});

	doc
		.fontSize(12)
		.font('Times-Roman')
		.text('rope_in_1', 330, 580, {
			width: 235,
			align: 'center',
		})
		.text('rope_in_2', 330, 595, {
			width: 235,
			align: 'center',
		})
		.text('rope_in_3', 330, 610, {
			width: 235,
			align: 'center',
		})
		.text('rope_in_4', 330, 625, {
			width: 235,
			align: 'center',
		});
	doc
		.font('Times-BoldItalic')
		.text('(Smart Phone Not Allowed inside the classroom or plant)', 30, 700, {
			width: 300,
			align: 'center',
		});
	doc
		.font('Times-BoldItalic')
		.text('(Smart Phone Not Allowed inside the classroom or plant)', 330, 700, {
			width: 235,
			align: 'center',
		});

	doc.addPage({
		margins: {
			top: 50,
			bottom: 50,
			left: 30,
			right: 0,
		},
	});
	doc.fontSize(12).font('Times-Roman');
	doc.text(
		`Please note at the time of admission, you must give a declaration that you will complete admission in any Bachelor course at IGNOU/or at any distance education University, at your cost, failing which you will not be considered for continuing the program.`,
		30,
		10,
		{ width: 535 }
	);
	doc.text(
		`Please bring all original certificates, ID proof, address proof (Aadhar card preferred) and six passport size photographs. These original documents will be returned after taking copies with an affidavit.  Please provide your bank account details- Preferable banks are ICICI/ SBI/ SVCB. Your selection is subject to fulfilling the admission formalities of NTTF, mainly your physical fitness and credentials in all respects duly certified by competent authorities. During the programme you are entitled to receive a consolidated monthly stipend, which is subject to your 100% attendance for the theory and practical classes and your performance in terms of your attitude towards industrial working conditions. In addition, you will be covered under personal accident insurance, Mediclaim insurance and you will be provided uniform, safety shoes & subsidised working lunch during the programme.`,
		30,
		60,
		{ width: 535 }
	);
	doc
		.text(
			`During on-the-job training, you may be required to work in shifts, as needed. It is mandatory to attain 100% attendance for the theory classes at NTTF and the practical sessions. It is expected that you devote the necessary time, ability, and attention to the programme for its successful completion `,
			30,
			190,
			{ width: 535, continued: true }
		)
		.font('Times-Bold')
		.text(company_name, {
			continued: true,
		})
		.font('Times-Roman')
		.text(
			'. management has the right to withdraw your admission without any kind of compensation at any future date, in case any of the information provided by you is found incorrect or if you fail to demonstrate acceptable performance levels or found to violate the rules and regulations of the programme or the company allocated to you during the programme duration.'
		);
	doc
		.font('Times-Bold')
		.text(
			`Please note that you need to stay in the PG for one month from the date of your arrival. Accommodation & food may be provided to you only for the first month for which you will be charged @ Rs.5,000/- `,
			30,
			295,
			{ width: 535, continued: true }
		)
		.font('Times-Roman')
		.text(
			'which need to be payable by you to the PG owner and accordingly you may come with adequate money for the same. Alternately, you can also make your own accommodation arrangements for stay.'
		);
	doc.text(
		`We congratulate you on your provisional selection and welcome you to NTTF and look forward to your active participation in this programme. Please confirm your acceptance with return mail.`,
		30,
		365,
		{ width: 535 }
	);

	doc.text(`Thanking you,`, 30, 420);
	doc.text(`Regards,`, 30, 450);

	doc.fillColor('#000080').text(`Alok Kumar`, 30, 480);
	doc.fillColor('black').text(`Deputy Manager – Business Development`, 30, 500);

	doc.image(__basedir + '/static/assets/0ecd73f8-dad7-40c3-aea7-086063fa6dec.png', 30, 530, {
		width: 100,
	});

	doc.fillColor('#000080').text(`NETTUR TECHNICAL TRAINING FOUNDATION`, 30, 570);
	doc
		.fontSize(10)
		.font('Times-Bold')
		.fillColor('black')
		.text(`An IMS Certified Training Institute`, 30, 585);
	doc.text(`[ISO 21001, ISO 9001, ISO 14001, ISO 45001]`, 30, 600);
	doc.font('Times-Roman').fillColor('Gray').text(`# 23/24, II Phase,`, 30, 615);
	doc.fillColor('Gray').text(`Peenya Industrial Area,`, 30, 630);
	doc.text(`Bangalore - 560 058`, 30, 645);
	doc.fillColor('red').text(`Mob: 9901126888	`, 30, 660);
	doc
		.fillColor('black')
		.text(`Website: `, 30, 675, { continued: true })
		.fillColor('blue')
		.text(' www.nttftrg.com ', { link: 'www.nttftrg.com' });

	doc.end();
});

app.use('/auth', require('./routes/auth/auth'));

app.use('/candidate', require('./routes/Candidate'));

app.use('/team', require('./routes/Team'));

app.use('/manager', require('./routes/Manager'));

app.use('/fileupload', require('./utils/FileUpload'));

app.get('/images/:imageID', (req, res) => {
	res.sendFile(__dirname + '/static/uploads/' + req.params.imageID);
});

const server = app.listen(9000, () => console.log(`Server running on port 9000 `));

process.on('unhandledRejection', (err, promise) => {
	console.log(`Logged Error: ${err.message}`);
	server.close(() => process.exit(1));
});
