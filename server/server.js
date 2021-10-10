require('dotenv').config();
require('./config/DB').connect();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Question = require('./models/exam/Question');
const { QuestionType, QuestionSubject, Answer } = require('./utils/Enums');

global.__basedir = __dirname;
//middleware............................................
app.use(express.json({ limit: '50mb' }));
const allowlist = [
	'http://localhost:3000',
	'http://localhost:3001',
	'http://localhost:3002',
	'http://192.168.1.37:3000',
	'http://192.168.1.37:3001',
	'http://192.168.1.37:3002',
	'https://candidate.factory-jobs.com',
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
app.get('/addquestions', async (req, res) => {
	await Question.insertMany([
		{
			type: QuestionType.TEXT,
			text: 'A triangle whose all 3 sides are equal is called as',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: [
				'Isosceles triangle',
				'Obtuse angle triangle',
				'Equilateral triangle',
				'Right angle triangle',
			],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '...............revolves around the sun.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Pluto', 'Moon', 'Earth', 'Mars'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Lime contains........... Acid',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Chloric', 'Sulphuric', 'Citric', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Acid found in Milk is ...........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Citric', 'Lactic', 'Sulphuric', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Moon is bright due to its own light',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['True', 'False', 'Both', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'There are 8 planets are in the solar system?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['True', 'False', 'Both', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: '.......... planet has a ring.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Pluto', 'Neptune', 'Mars', 'Saturn'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Bulb filament is made of ...........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['vanadium', 'Sodium', 'Tungsten', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '............ Is the best conductor of electricity?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['plastic', 'rubber', 'Wood', 'Copper'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'H2O is .............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Acid', 'Water', 'Gas', 'alkaline'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which is the planet closest to the earth?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Pluto', 'Moon', 'Sun', 'Mars'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which of the following is used in pencils?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Graphite', 'charcoal', 'Silicon', 'Phosphorus'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which of the following is not used in pencils?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['phosphorus', 'charcoal', 'Silicon', 'All'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Milk contains........... Acid',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Citric', 'lactic', 'Chloric', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Present day lighting uses',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['LED', 'LCD', 'Fluorescent tube', 'incandescent lamp'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'The best insulator of electricity is ................. .',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Copper', 'Wood', 'steel', 'salt water'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'The hardest material available on earth is...............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'The filament of an electric bulb is made of ...............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Tungsten', 'Nichrome', 'Graphite', 'Iron'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Unit of electricity is ................',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Kilowatt hour', 'Kilowatt min', 'Kilowatt sec', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Thermometer uses ................ liquid',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Mercury', 'Alcohol', 'Water', 'Kerosene'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which is the biggest planet in our solar system?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Jupiter', 'Mars', 'Pluto', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which is the chemical symbol for the element oxygen?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['H', 'P', 'R', 'O'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Pears contains........... Acid',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Citric', 'Lactic', 'Malic', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which color of light is deviated less?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Red', 'Blue', 'violet', 'Green'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Human body is a good .................of electricity.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Conductor', 'Insulator', 'Semi-conductor', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Force X velocity=.................',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Work', 'Power', 'Energy', 'Momentum'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'The lens used in a simple microscope is............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Concave', 'Convex', 'Cylindrical', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Value of gravity is ...........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['9.81', '8.81', '7.81', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Green plants make food by',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['photo-oxidation', 'photorespiration', 'photosynthesis', 'All'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'A man presses more weight on the earth at:',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Sitting position', 'standing position', 'Lying position', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'With the increase of pressure, the boiling point of any substance..........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['increases', 'decreases', 'remain same', 'becomes zero'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which law of Newton is called law of inertia',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['1st Law', '2nd Law', '3rd Law', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: '...............Is used to measure temperature.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Bolometer', 'Thermometer', 'Galvanometer', 'none'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Heavy metal pollution of water is caused by:',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Acid plants', 'paints', 'wood', 'domestic sewage'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Due to rusting the weight of iron ..............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['increases', 'decreases', 'remain same', 'becomes zero'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Phosphorus is mainly extracted from',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['sand', 'ash', 'bone ash', 'fertilizer'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'A triangle prism has how many faces............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['3', '6', '9', '1'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'The range of acute angle is between..............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['0 to 80°', '0 to 55°', '0 to 90°', 'none'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'A Square consists of ......... sides',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['6', '4', '3', '2'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: '(5 x 6) + 4 =?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['15', '17', '34', '16'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '(5 x 6) - 4 =?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['15', '32', '26', '16'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Add the following (0011 + 2299 + 6633)',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['8943', '8439', '8943', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find 10% of ₹600',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 15', '₹ 60', '₹ 90', '₹ 120'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find 20% of ₹600',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 15', '₹ 60', '₹ 90', '₹ 120'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the place value of 4 in 70504',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['ones', 'hundred', 'thousand', '5000'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the cost of 50 m cloth at the rate of ₹ 5 per meter',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 250', '₹ 350', '₹ 3.30', '₹ 5'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Any angle which measure 90 degree is known as..............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['right angle', 'acute angle', 'obtuse angle', 'none'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'IF X=5, Y=4, Z=6, Find 3X + 4Y + 5Z',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['52', '50', '61', '1'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '(5 x 5) + 4 =?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['15', '29', '42', '46'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Add the following (350+489+699) =...............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['1500', '1538', '1638', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Add the following 5m 70cm + 3m 20cm + 4m 30cm =...............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['10m', '13m 20cm', '12m 40cm', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find 50% of ₹600',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 300', '₹ 50', '₹ 90', '₹ 120'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the cost of 2.0 m cloth at the rate of ₹ 50 per meter',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 60', '₹ 65', '₹ 125', '₹100'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the cost of 2.5 m cloth at the rate of ₹ 50 per meter',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['₹ 60', '₹ 65', '₹ 125', '₹100'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the place value of 5 in 70504',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['50000', '500', '500,000', '5000'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Find the value of x; if x= (2x3) +11',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['55', '192', '17', '66'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'What is the greatest two digit number?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['10', '90', '11', '99'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: '1 cm is equal to ..............mm.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['100', '10', '1000', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: '1 Metre is equal to ............ millimeters',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['100', '1000', '1', '0.01'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'The area of a rectangle is calculated by',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['h x l', 'a<sub>2</sub>', 'l x b', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'In a city 20 plots were sold for ₹500000. Calculate the cost of each plot',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['10000', '10100', '25000', '50000'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '(a + b) <sub>2</sub> = ......',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: [
				'a<sub>2</sub> - 2ab - b<sub>2</sub>',
				'a<sub>2</sub> + b<sub>2</sub> = 2ab',
				'a<sub>2</sub> + 2ab + b<sub>2</sub>',
				'b<sub>2</sub> + 2ab = a<sub>2</sub>',
			],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '(a - b) <sub>2</sub> = ......',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: [
				'a<sub>2</sub> - 2ab - b<sub>2</sub>',
				'a<sub>2</sub> + b<sub>2</sub> = 2ab',
				'a<sub>2</sub> + 2ab + b<sub>2</sub>',
				'b<sub>2</sub> + 2ab = a<sub>2</sub>',
			],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: '50% of 1500 is ...........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['1500', '750', '60', '80'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'The number of milliliters in 1 litre is',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['100', '10,00', '0.1', '1000'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Square root of 144 is ................',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['11', '12', '10', '9'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'A pentagon consists of ......... Faces.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['5', '6', '3', '14'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Acid found in curd is ...........',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Citric', 'Lactic', 'Sulphuric', 'None of these'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Black hole is an object to be found',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['in the ocean', 'In the sky', 'in the jungle', 'None of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Laws of motion were stated by ..........................',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Isaac Newton', 'C. V. Raman', 'Galileo', 'Albert Einstein'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which planet is also called as red planet?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Pluto', 'Neptune', 'Mars', 'Saturn'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '........................... is called liquid metal.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Vanadium', 'Sodium', 'Mercury', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '............ Is the bad conductor of electricity?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Plastic', 'Gold', 'Silver', 'Copper'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: '.............is a mixture.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Acid', 'Water', 'Gas', 'Alkaline'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: '...............revolves around the sun.',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Pluto', 'Moon', 'Earth', 'Mars'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which of the following is the color of charcoal?',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['Black', 'White', 'Blue', 'Red'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'If selling prize is greater than cost prize than profit is .............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: [
				'Selling Prize - Profit',
				'Cost Prize -Selling Prize',
				'Selling Prize- Cost Prize',
				'None of these',
			],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: '1 Meter is equal to ............ millimeters',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['100', '1000', '1', '0.01'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: '1523 + 425 = ............',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['1948', '1984', '1845', '8546'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'The volume of a Cube is calculated by',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['l x b', 'a<sup>2</sup>', 'a<sup>3</sup>', 'None of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Two angles of a triangle measure 15° and 85 ° then the third angle is',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['90°', '45°', '60°', '80°'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Two angles of a triangle measure 25° and 85 ° then the third angle is',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['80°', '55°', '70°', '50°'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'A cube consist of ......... faces',
			subject: QuestionSubject.SCIENCE_MATHS,
			options: ['5', '6', '8', '4'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Select the odd one out',
			subject: QuestionSubject.ENGLISH,
			options: ['John', 'Mary', 'Sitting', 'Job'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'She is.........good girl.',
			subject: QuestionSubject.ENGLISH,
			options: ['an', 'the', 'a', 'none'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Adjective describes a ...........',
			subject: QuestionSubject.ENGLISH,
			options: ['noun', 'pronoun', 'verb', 'interjectione'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Preposition relates a noun or pronoun to another word like.............. ',
			subject: QuestionSubject.ENGLISH,
			options: ['and', 'if', 'but', 'on'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Opposite word for happiness is .................',
			subject: QuestionSubject.ENGLISH,
			options: ['sadness', 'joyful', 'cheerful', 'none'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'We had our house.........white.',
			subject: QuestionSubject.ENGLISH,
			options: ['paints', 'painting', 'painted', 'paint'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'She is.........in the garden',
			subject: QuestionSubject.ENGLISH,
			options: ['walking', 'to walk', 'walked', 'walk'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'My house is as ......... as your house ',
			subject: QuestionSubject.ENGLISH,
			options: ['bigges', 'big', 'bigger', 'the biggest'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'We were caught .........a showers on our way home.',
			subject: QuestionSubject.ENGLISH,
			options: ['in', 'by', 'at', 'with'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'I am very ......... to meet you',
			subject: QuestionSubject.ENGLISH,
			options: ['delight', 'delighting', 'delighted', 'delight'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'My name ......... S Shyam.',
			subject: QuestionSubject.ENGLISH,
			options: ['is', 'was', 'the', 'with'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'I am ........... Mysore.',
			subject: QuestionSubject.ENGLISH,
			options: ['is', 'for', 'from', 'on'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'i..........completed 10th standard.',
			subject: QuestionSubject.ENGLISH,
			options: ['had', 'have', 'been', 'on'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'There are 3000 students studying ....my school.',
			subject: QuestionSubject.ENGLISH,
			options: ['from', 'at', 'in', 'on'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'She .......TV when her husband came',
			subject: QuestionSubject.ENGLISH,
			options: ['watch', 'was watching', 'is watching', 'watched'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Select correct word',
			subject: QuestionSubject.ENGLISH,
			options: ['Acceleration', 'Aceeleration', 'Accelaration', 'Acceleration'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'The boy was cured ........ typhoid.',
			subject: QuestionSubject.ENGLISH,
			options: ['from', 'of', 'for', 'through'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Select the proper suffix for king',
			subject: QuestionSubject.ENGLISH,
			options: ['er', 'dom', 'ing', 'with'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Select the odd one out',
			subject: QuestionSubject.ENGLISH,
			options: ['hardware', 'keyboard', 'ink', 'monitor'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Opposite word for alike is............',
			subject: QuestionSubject.ENGLISH,
			options: ['same', 'different', 'duplicates', 'a gentle man'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Opposite word for negative is............',
			subject: QuestionSubject.ENGLISH,
			options: ['affirmative', 'againts', 'deface', 'all'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: "I'll arrive sometime ........... 8 and 9 am.",
			subject: QuestionSubject.ENGLISH,
			options: ['in', 'next to', 'on', 'between'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Abbreviation of cc is ..............',
			subject: QuestionSubject.ENGLISH,
			options: ['carbon copy', 'copy carbon', 'cab copy', 'none'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'The opposite gender for the word ‘gentlewomen’ is:',
			subject: QuestionSubject.ENGLISH,
			options: ['Gentel-woman', 'lady', 'Gentle-man', 'none of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Re-arrange the given words and make a meaningful sentence    (1) the accounts    (2) in checking     (3) me     (4) he assisted',
			subject: QuestionSubject.ENGLISH,
			options: ['1 2 3 4', '3 2 1 4', '2 4 1 3', '4 3 2 1'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Re-arrange the given words and make a meaningful sentence    (1) immediately     (2) must be     (3) attended to     (4) patient     (5) the',
			subject: QuestionSubject.ENGLISH,
			options: ['5 4 2 1 3', '5 4 2 3 1', '5 4 1 2 3', '5 4 3 1 2'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'An associate in the office is a',
			subject: QuestionSubject.ENGLISH,
			options: ['Ally', 'Partner', 'Companion', 'Colleague'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'One who cannot die is..........',
			subject: QuestionSubject.ENGLISH,
			options: ['Stable', 'Immortal', 'God', 'Perpetual'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Bear in mind that .......... of speech is one of our fundamental right.',
			subject: QuestionSubject.ENGLISH,
			options: ['Liberty', 'Freedom', 'Loyalty', 'Necessory'],
			answer: Answer.B,
		},
		{
			type: QuestionType.TEXT,
			text: 'The capital city of India is ......',
			subject: QuestionSubject.GK,
			options: ['New Delhi', 'Mumbai', 'Kolkata', 'Ahemdabad'],
			answer: Answer.A,
		},
		{
			type: QuestionType.TEXT,
			text: 'The national tree of our county is .......',
			subject: QuestionSubject.GK,
			options: ['mango', 'banyan', 'banana', 'apple'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who was the first woman president of India?',
			subject: QuestionSubject.GK,
			options: ['Pratibha Patil', 'sarojini Naidu', 'Mother Teresa', 'Annie Besant'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: "Who is called as ‘Iron man of India'?",
			subject: QuestionSubject.GK,
			options: ['Nehru', 'V.P. Singh', 'M K Gandhi', 'Sardar Patel'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which scientist discovered the radioactive element Radium?',
			subject: QuestionSubject.GK,
			options: ['Albert Einstein', 'Benjamin Franklin', 'Marie Curie', 'Issac Newton'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'The Prime Minister of India is ............',
			subject: QuestionSubject.GK,
			options: ['Vajpayee', 'Pranab Mukhrejee', 'Manmohan Singh', 'Narendra Modi'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'For which field, Sri Rabindranath Tagore was awarded the with Nobel Prize',
			subject: QuestionSubject.GK,
			options: ['Literature', 'Peace', 'Peace', 'Physics'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who was the first president of India?',
			subject: QuestionSubject.GK,
			options: ['M K Gandhi', 'Lal Bahadur Sahstri', 'Rajendra Prasad', 'Moraji Desai'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'The animal with the longest life span is',
			subject: QuestionSubject.GK,
			options: ['Lion', 'Elephant', 'Tortoise', 'Tiger'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Our solar system has ....... planets',
			subject: QuestionSubject.GK,
			options: ['9', '7', '10', '11'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'How many days are there in a year?',
			subject: QuestionSubject.GK,
			options: ['365', '366', '364', '360'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'The national bird of our county is .......',
			subject: QuestionSubject.GK,
			options: ['pigeon', 'peacock', 'parrot', 'none of these'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who was the first woman finance minister of India?',
			subject: QuestionSubject.GK,
			options: ['Nirmala Sitharaman', 'Sarojini Naidu', 'Mother Teresa', 'Annie Besant'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Founder of Microsoft are......',
			subject: QuestionSubject.GK,
			options: ['Bill Gates', 'Paul Allen', 'both', 'none of these'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which is the smallest state of India?',
			subject: QuestionSubject.GK,
			options: ['Goa', 'Delhi', 'Rajasthan', 'Maharashtra'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'GST stands for......',
			subject: QuestionSubject.GK,
			options: [
				'goods and service tax',
				'goods and sense tax',
				'good and service tax',
				'none of these',
			],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Swachh Bharat mission was started in the year ............',
			subject: QuestionSubject.GK,
			options: ['2016', '2014', '2008', '2011'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Vallabhai Patel ’s tallest statue is named as ..............',
			subject: QuestionSubject.GK,
			options: ['Statue of peace', 'Statue of mind', 'Statue of unity', 'Statue of color'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Vallabhai Patel ’s tallest statue is named as ..............',
			subject: QuestionSubject.GK,
			options: ['Statue of peace', 'Statue of mind', 'Statue of unity', 'Statue of color'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'The national game of India is .........',
			subject: QuestionSubject.GK,
			options: ['Kabaddi', 'Cricket', 'Hockey', 'Kho Kho'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Green color in leaves is due to the presence of ............',
			subject: QuestionSubject.GK,
			options: ['Chlorophyll', 'Butene', 'Propyl', 'Methane'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who is called as Lady with the Lamp?',
			subject: QuestionSubject.GK,
			options: ['Indira Gandhi', 'Rani Laxmibai', 'Florence Nightingale', 'Annie Besant'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'The rover which landed on Mars is...........',
			subject: QuestionSubject.GK,
			options: ['Diversity', 'Animosity', 'Porosity', 'Curiosity'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'On which planet do we live?',
			subject: QuestionSubject.GK,
			options: ['mercury', 'earth', 'mars', 'none'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who was the first actor to get Oscar Award?',
			subject: QuestionSubject.GK,
			options: ['Montgomery', 'Fairbanks', 'Janet Gayner', 'Charlie Chaplin'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Who was the first Indian to receive a Nobel Prize?',
			subject: QuestionSubject.GK,
			options: ['Mother Teresa', 'Hargobind Tagore', 'CV Raman', 'Rabindranath Tagore'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'The percentage of irrigated land in India is about.',
			subject: QuestionSubject.GK,
			options: ['45', '65', '35', '25'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Boat race is a famous festival game of',
			subject: QuestionSubject.GK,
			options: ['Tamil Nadu', 'Kerela', 'Goa', 'Assam'],
			answer: Answer.B,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which of the following is not a mosquito borne disease?',
			subject: QuestionSubject.GK,
			options: ['Dengue fever', 'Malaria', 'Sleeping sickness', 'Filariasis'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which of the following cities is known as Electronic City of India?',
			subject: QuestionSubject.GK,
			options: ['Mumbai', 'Gurgaon', 'Bangalore', 'Hydrabad'],
			answer: Answer.C,
		},

		{
			type: QuestionType.TEXT,
			text: 'Hawa Mahal is in which of the following cities?',
			subject: QuestionSubject.GK,
			options: ['Jaipur', 'Indore', 'Bhopal', 'Hydrabad'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Which is the first country to prepare a constitution?',
			subject: QuestionSubject.GK,
			options: ['U.S.A', 'India', 'UA', 'UK'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Hima das is an Indian ..............',
			subject: QuestionSubject.GK,
			options: ['Runner', 'hockey player', 'football player', 'none'],
			answer: Answer.A,
		},

		{
			type: QuestionType.TEXT,
			text: 'Mumbai was formerly called has.............',
			subject: QuestionSubject.GK,
			options: ['Bangalore', 'Lucknow', 'Delhi', 'Bombay'],
			answer: Answer.D,
		},

		{
			type: QuestionType.TEXT,
			text: 'Mumbai was formerly called has.............',
			subject: QuestionSubject.GK,
			options: ['Bangalore', 'Lucknow', 'Delhi', 'Bombay'],
			answer: Answer.D,
		},
	]);
	res.status(200).json({
		success: true,
		message: 'Questions Added',
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
