import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const res = await RefreshToken();
			if (res) return axiosInstance(originalRequest);
			else {
				window.location.assign('/login');
			}
		}
		return Promise.reject(error);
	}
);

export const LoginAPI = async (credentials) => {
	try {
		const { data } = await axiosInstance.post(`/auth/candidate/login`, credentials);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const RegisterAPI = async (credentials) => {
	try {
		const { data } = await axiosInstance.post(`/auth/candidate/register`, credentials);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const ForgotPassword = async (username) => {
	try {
		const { data } = await axiosInstance.post(`/auth/candidate/forgot-password`, { username });
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const ResetPassword = async (credentials) => {
	try {
		const { data } = await axiosInstance.put(`/auth/candidate/reset-password`, credentials);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const RefreshToken = async () => {
	try {
		const { data } = await axiosInstance.get(`/auth/candidate/refresh-token`);
		return data.success;
	} catch (err) {
		return false;
	}
};

export const ProfileStatus = async () => {
	try {
		const { data } = await axiosInstance.get(`/auth/candidate/profile-status`);
		return data;
	} catch (err) {
		return false;
	}
};

export const VerificationAPI = async () => {
	try {
		const { data } = await axiosInstance.get(`/auth/candidate/request-verification`);
		return data;
	} catch (err) {
		return false;
	}
};

export const VerifyUserAPI = async (otp) => {
	try {
		const { data } = await axiosInstance.post(`/auth/candidate/verify-user`, {
			otp,
		});
		return data;
	} catch (err) {
		return err.response.data;
	}
};
export const Logout = async () => {
	try {
		const { data } = await axiosInstance.post(`/auth/candidate/logout`);
		return data.success;
	} catch (err) {
		return false;
	}
};

export const MyDashboard = async () => {
	try {
		const { data } = await axiosInstance.get(`/candidate/my-dashboard`);
		return data;
	} catch (error) {
		return false;
	}
};

export const FetchPinCode = async (pincode) => {
	try {
		const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`, {}, {});
		if (data[0].Status) {
			return {
				state: data[0].PostOffice[0].State,
				district: data[0].PostOffice[0].District,
			};
		}
		return { state: '', district: '' };
	} catch (error) {
		return { error: 'error' };
	}
};

export const FetchImage = (imageID) => {
	return baseURL + 'images/' + imageID;
};

export const UploadFile = async (file) => {
	const formdata = new FormData();
	formdata.append('file', file);
	try {
		const { data } = await axios.post(baseURL + 'fileupload', formdata);
		if (data.success) {
			return data.message;
		} else {
			return '';
		}
	} catch (error) {
		console.log(error.response.data);
		return '';
	}
};

export const CreateProfile = async (cred) => {
	try {
		const { data } = await axiosInstance.post(`/candidate/create-profile`, cred);
		return data;
	} catch (error) {
		return error.response.data;
	}
};

export const StartExam = async () => {
	try {
		const { data } = await axiosInstance.get(`/candidate/start-exam`);
		return data;
	} catch (error) {
		return error.response.data;
	}
};

export const SubmitExam = async (answers) => {
	try {
		const { data } = await axiosInstance.post(`/candidate/submit-exam`, {
			answers,
		});
		return data;
	} catch (error) {
		return error.response.data;
	}
};

export const FetchExamDetails = async (resultID) => {
	try {
		const { data } = await axiosInstance.get(`/candidate/exam-details/${resultID}`);
		return data;
	} catch (error) {
		return error.response.data;
	}
};

export const DownloadOfferLetter = async () => {
	try {
		const response = await axiosInstance.get(`/candidate/download-offer-letter`, {
			responseType: 'blob',
		});

		const fileURL = window.URL.createObjectURL(new Blob([response.data]));
		const fileLink = document.createElement('a');
		fileLink.href = fileURL;
		fileLink.setAttribute('download', `Offer-Letter.${response.data.type.split('/')[1]}`);
		document.body.appendChild(fileLink);
		fileLink.click();
		fileLink.remove();
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};
