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
		const { data } = await axiosInstance.post(`/auth/manager/login`, credentials);
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
		const { data } = await axiosInstance.post(`/auth/manager/forgot-password`, { username });
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const ResetPassword = async (credentials) => {
	try {
		const { data } = await axiosInstance.put(`/auth/manager/reset-password`, credentials);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const RefreshToken = async () => {
	try {
		const { data } = await axiosInstance.get(`/auth/manager/refresh-token`);
		return data.success;
	} catch (err) {
		return false;
	}
};

export const MyProfile = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/profile`);
		return data;
	} catch (err) {
		return {
			success: false,
		};
	}
};

export const Name = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/profile`);
		return data.profile.name;
	} catch (err) {
		return '';
	}
};

export const UpdateProfile = async (details, passwords) => {
	try {
		const { data } = await axiosInstance.put(`/manager/profile`, {
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

export const FetchSignatureImage = (imageID) => {
	return baseURL + 'manager/signature/' + imageID;
};

export const MyDashboard = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/my-dashboard`);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const Students = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/students`);
		return data;
	} catch (err) {
		return false;
	}
};

export const SaveCandidateDetails = async (details) => {
	try {
		const { data } = await axiosInstance.put(`/manager/update-student-details`, { details });
		return data;
	} catch (err) {
		return false;
	}
};

export const Teams = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/teams`);
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const RegisterTeam = async (details) => {
	try {
		const { data } = await axiosInstance.post(`/auth/team/register`, {
			...details,
		});
		return data;
	} catch (err) {
		return err.response ? err.response.data : { success: false };
	}
};

export const UpdateTeamStatus = async (id, info) => {
	try {
		const { data } = await axiosInstance.put(`/manager/teams`, { id, info });
		return data;
	} catch (err) {
		return err.response.data;
	}
};

export const UploadFile = async (file) => {
	const formdata = new FormData();
	formdata.append('file', file);
	try {
		const { data } = await axiosInstance.post('/fileupload', formdata);
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
		const { data } = await axiosInstance.put(`/manager/update-profile-image`, { photo: file });
		return data;
	} catch (err) {
		return false;
	}
};

export const ExamWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/exam-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const InterviewWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/interview-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const AdmissionWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/admission-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const StateWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/state-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const IndustryWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/industry-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const SourceWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/source-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const AssignedTargets = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/assigned-targets`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const CallWiseReport = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/call-wise-report`);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const UploadQuestion = async (details) => {
	try {
		const { data } = await axiosInstance.post(`/manager/create-question`, details);
		return data;
	} catch (err) {
		return { success: false };
	}
};

export const UpdateCandidatesTeam = async (team_id, candidates) => {
	try {
		const { data } = await axiosInstance.put(`/manager/update-candidates-team`, {
			team_id,
			candidates,
		});
		return data.success;
	} catch (err) {
		return false;
	}
};

export const CreateTargetRecord = async (team_id, targets) => {
	try {
		const { data } = await axiosInstance.post(`/manager/create-target-record`, {
			team_id,
			targets,
		});
		return data.success;
	} catch (err) {
		return false;
	}
};

export const CompanyData = async () => {
	try {
		const { data } = await axiosInstance.get(`/manager/company-details`);
		return data;
	} catch (err) {
		return false;
	}
};

export const SaveCompanyDetails = async (details) => {
	try {
		const { data } = await axiosInstance.post(`/manager/company-details`, { details });
		return data;
	} catch (err) {
		return false;
	}
};
