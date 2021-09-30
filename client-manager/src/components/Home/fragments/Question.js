import React, { useState } from 'react';
import './Question.css';
import { UploadFile, UploadQuestion, FetchImage } from '../../controllers/API';

const Question = ({ showAlert, setLoading }) => {
	const [data, setData] = useState({
		section: 'Science & Mathematics',
		type: 'Text',
		imagePath: '',
		question: '',
		options: {
			a: '',
			b: '',
			c: '',
			d: '',
		},
		answer: 'A',
	});

	const changeHandler = (e) => {
		setData((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const optionsChangeHandler = (e) => {
		const options = data.options;
		options[e.target.name] = e.target.value;
		setData((prev) => {
			return {
				...prev,
				options: options,
			};
		});
	};

	const uploadImage = async (e) => {
		if (e.target.files[0].size > 204800) {
			showAlert('File should be less than 200 kb');
			e.target.value = null;
			return;
		}
		setLoading(true);
		let data = await UploadFile(e.target.files[0]);
		if (data) {
			setData((prev) => {
				return {
					...prev,
					imagePath: data,
				};
			});
		} else {
			showAlert('Photo Upload Failed. Please try again later.');
		}
		setLoading(false);
	};

	const submitandler = (e) => {
		e.preventDefault();
		if (data.type === 'Text' && !data.question) return alert('Question Cannot be empty');
		if (data.type === 'Image' && !data.imagePath) return alert('Image not uploaded yet');

		UploadQuestion(data);
		setData((prev) => {
			return {
				...prev,
				imagePath: '',
				question: '',
				options: {
					a: '',
					b: '',
					c: '',
					d: '',
				},
				answer: 'A',
			};
		});
		const imageDOM = document.getElementById('image_upload');
		if (imageDOM) imageDOM.value = '';
	};

	return (
		<>
			<h4>Question Panel</h4>
			<div className='question-wrapper'>
				<form onSubmit={submitandler}>
					<div>
						<div className='details-wrapper'>
							<span>Section</span>
							<select name='section' value={data.section} onChange={changeHandler}>
								<option>Science &amp; Mathematics</option>
								<option>English</option>
								<option>General Knowledge</option>
								<option>Technical Reasoning</option>
								<option>Coding and Aptitude</option>
							</select>
						</div>
						<div className='details-wrapper right'>
							<span>Type</span>
							<select name='type' value={data.type} onChange={changeHandler}>
								<option>Text</option>
								<option>Image</option>
							</select>
						</div>
					</div>
					<div>
						<span>Question</span>
						{data.type === 'Text' && (
							<textarea name='question' value={data.question} onChange={changeHandler} rows='10' />
						)}
						{data.type === 'Image' && (
							<>
								<input type='file' id='image_upload' onChange={uploadImage} />
								<img
									src={FetchImage(data.imagePath)}
									alt=''
									style={{ width: '100%', marginTop: '2rem' }}
								/>
							</>
						)}
					</div>
					<div>
						<div className='details-wrapper'>
							<span>Options</span>
							<div className='options'>
								<span>A</span>
								<input
									name='a'
									value={data.options.a}
									onChange={optionsChangeHandler}
									type='text'
								/>
							</div>
							<div className='options'>
								<span>B</span>
								<input
									name='b'
									value={data.options.b}
									onChange={optionsChangeHandler}
									type='text'
								/>
							</div>
							<div className='options'>
								<span>C</span>
								<input
									name='c'
									value={data.options.c}
									onChange={optionsChangeHandler}
									type='text'
								/>
							</div>
							<div className='options'>
								<span>D</span>
								<input
									name='d'
									value={data.options.d}
									onChange={optionsChangeHandler}
									type='text'
								/>
							</div>
						</div>
						<div className='details-wrapper right answer'>
							<span>Answer</span>
							<select name='answer' value={data.answer} onChange={changeHandler}>
								<option>A</option>
								<option>B</option>
								<option>C</option>
								<option>D</option>
							</select>
						</div>
					</div>
					<div className='right'>
						<button className='submit-btn'>Save</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Question;
