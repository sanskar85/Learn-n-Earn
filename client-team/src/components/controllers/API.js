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
				window.location.assign('/');
			}
		}
		return Promise.reject(error);
	}
);

export const LoginAPI = async (credentials) => {
	try {
		const { data } = await axiosInstance.post(`/auth/team/login`, credentials);
		return data;
	} catch (err) {
		if (err.response) return err.response.data;
		return {
			success: false,
		};
	}
};
export const ForgotPassword = async (username) => {
	try {
		const { data } = await axiosInstance.post(`/auth/team/forgot-password`, {
			username,
		});
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const ResetPassword = async (credentials) => {
	try {
		const { data } = await axiosInstance.put(`/auth/team/reset-password`, credentials);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const RefreshToken = async () => {
	try {
		const { data } = await axiosInstance.get(`/auth/team/refresh-token`);
		return data.success;
	} catch (err) {
		return false;
	}
};

export const MyProfile = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/profile`);
		return data;
	} catch (err) {
		return {
			success: false,
		};
	}
};

export const Name = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/profile`);
		return data.profile.name;
	} catch (err) {
		return '';
	}
};

export const UpdateProfile = async (details, passwords) => {
	try {
		const { data } = await axiosInstance.put(`/team/profile`, {
			...details,
			...passwords,
		});
		return data;
	} catch (err) {
		return err.response ? err.response.data : { success: false };
	}
};

export const FetchImage = (imageID) => {
	return baseURL + 'images/' + imageID;
};

export const MyDashboard = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/my-dashboard`);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const Students = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/students`);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const UpdateStudentStatus = async (id, status) => {
	try {
		const { data } = await axiosInstance.put(`/team/students`, { id, status });
		return data.success;
	} catch (err) {
		return false;
	}
};

export const ExamNotResponding = async (id) => {
	try {
		const { data } = await axiosInstance.put(`/team/students-exam-not-responding`, { id });
		return data.success;
	} catch (err) {
		return false;
	}
};

export const InterviewNotResponding = async (id) => {
	try {
		const { data } = await axiosInstance.put(`/team/students-interview-not-responding`, { id });
		return data.success;
	} catch (err) {
		return false;
	}
};

export const AdmissionNotResponding = async (id) => {
	try {
		const { data } = await axiosInstance.put(`/team/students-admission-not-responding`, { id });
		return data.success;
	} catch (err) {
		return false;
	}
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
		return '';
	}
};

export const UpdateProfilePhoto = async (file) => {
	try {
		const { data } = await axiosInstance.put(`/team/update-profile-image`, {
			photo: file,
		});
		return data;
	} catch (err) {
		return false;
	}
};

export const Examination_Details = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/examination-details`);
		return data;
	} catch (err) {
		if (err && err.response) return err.response.data;
		else
			return {
				success: false,
				message: 'Server Error',
			};
	}
};

export const Notify_Candidate = async (id, methods) => {
	try {
		await axiosInstance.post(`/team/notify-candidate`, { id, methods });
	} catch (err) {}
};

export const Interview_Details = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/interview-details`);
		return data;
	} catch (err) {
		if (err && err.response) return err.response.data;
		else
			return {
				success: false,
				message: 'Server Error',
			};
	}
};

export const OfferLetter_Details = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/offer-letter-details`);
		return data;
	} catch (err) {
		if (err && err.response) return err.response.data;
		else
			return {
				success: false,
				message: 'Server Error',
			};
	}
};

export const IssueLetter = async (offer_id, details) => {
	try {
		const { data } = await axiosInstance.post(`/team/issue-offer-letter`, {
			offer_id: offer_id,
			details: details,
		});
		
		return data.success;
	} catch (err) {
		return false;
	}
};

export const ScheduleMeeting = async (id, details) => {
	try {
		const { data } = await axiosInstance.post(`/team/create-meeting`, {
			id,
			details,
		});
		return data.success;
	} catch (err) {
		return false;
	}
};

export const CreateInterviewResponse = async (id, details) => {
	try {
		const { data } = await axiosInstance.post(`/team/create-interview-response`, { id, details });
		return data.success;
	} catch (err) {
		return false;
	}
};

export const FetchTarget = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/targets`);
		return data;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const UpdateTarget = async (target_id, details) => {
	try {
		const { data } = await axiosInstance.put(`/team/update-target`, { target_id, details });
		return data.success;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const Admission_Allowed = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/admission-allowded`);
		if (data.success) return data.message;
		return false;
	} catch (error) {
		return false;
	}
};

export const Admission_Details = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/admission-details`);
		return data;
	} catch (error) {
		return false;
	}
};

export const Save_Admission_Details = async (offer_id, details) => {
	try {
		const { data } = await axiosInstance.post(`/team/save-admission-details`, {
			offer_id,
			details,
		});
		return data.success;
	} catch (error) {
		return false;
	}
};

export const FetchIndustries = async () => {
	try {
		const { data } = await axiosInstance.get(`/team/industries`);
		return data;
	} catch (error) {
		return false;
	}
};
