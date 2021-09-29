import LOGO from "./logo.png";
import UPLOAD from "./upload.png";
import PASSWORDRESET from "./password_reset.png";
import SUCCESS from "./success.png";
import FAILED from "./failed.png";
import USER from "./user.png";
import LOGOUT from "./logout.png";
import ATTENTION from "./attention.png";
import PHONE from "./phone.png";
import PHONE_WHITE from "./phone_white.png";
import GOOGLE from "./google.png";
import ALARM from "./alarm.png";
import ERROR_OUTLINE from "./error_outline.png";
import ERROR_RED_OUTLINE from "./error_outline_red.png";
import CALENDER from "./calendar.png";
import BOOK from "./book.png";
import DOWNLOAD from "./download.png";
import ONLINETEST from "./onlinetest.svg";
import TESTRESULT from "./test_result_icon.png";
import SEARCH from "./search.png";
import CLOSE from "./close.png";
import GLOBE from "./globe.png";

export const GlobeIcon = (props) => {
	return (
		<>
			<img src={GLOBE} alt={props.alt} style={props.style} />
		</>
	);
};

export const CloseIcon = (props) => {
	return (
		<>
			<img src={CLOSE} alt={props.alt} style={props.style} />
		</>
	);
};
export const SearchIcon = (props) => {
	return (
		<>
			<img
				src={SEARCH}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};

export const TestResultIcon = (props) => {
	return (
		<>
			<img
				src={TESTRESULT}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};

export const OnlineTestImage = (props) => {
	return (
		<>
			<img
				src={ONLINETEST}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};

export const DownloadIcon = (props) => {
	return (
		<>
			<img src={DOWNLOAD} alt='' className={props.className} />
		</>
	);
};

export const BookIcon = (props) => {
	return (
		<>
			<img src={BOOK} alt='' className={props.className} />
		</>
	);
};

export const ErrorIcon = (props) => {
	return (
		<>
			<img src={ERROR_OUTLINE} alt='' className={props.className} />
		</>
	);
};

export const ErrorRedIcon = (props) => {
	return (
		<>
			<img src={ERROR_RED_OUTLINE} alt='' className={props.className} />
		</>
	);
};

export const CalenderIcon = (props) => {
	return (
		<>
			<img src={CALENDER} alt='' className={props.className} />
		</>
	);
};

export const AlarmIcon = (props) => {
	return (
		<>
			<img src={ALARM} alt='' className={props.className} />
		</>
	);
};

export const LogoIcon = (props) => {
	return (
		<>
			<img src={LOGO} alt='' className={props.className} />
		</>
	);
};
export const UploadIcon = (props) => {
	return (
		<>
			<img
				src={UPLOAD}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const PasswordResetIcon = (props) => {
	return (
		<>
			<img
				src={PASSWORDRESET}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const SuccessIcon = (props) => {
	return (
		<>
			<img
				src={SUCCESS}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const FailedIcon = (props) => {
	return (
		<>
			<img
				src={FAILED}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const UserIcon = (props) => {
	return (
		<>
			<img
				src={!props.src || props.src.includes("undefined") ? USER : props.src}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const LogoutIcon = (props) => {
	return (
		<>
			<img
				src={LOGOUT}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const AttentionIcon = (props) => {
	return (
		<>
			<img
				src={ATTENTION}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const PhoneWhiteIcon = (props) => {
	return (
		<>
			<img
				src={PHONE_WHITE}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const PhoneIcon = (props) => {
	return (
		<>
			<img src={PHONE} alt='' className={props.className} style={props.style} />
		</>
	);
};
export const GoogleIcon = (props) => {
	return (
		<>
			<img
				src={GOOGLE}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
