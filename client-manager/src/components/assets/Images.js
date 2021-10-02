import LOGO from './logo.png';
import USER from './user.png';
import UP from './arrow-up.svg';
import DOWN from './arrow-down.svg';
import FLAME from './flame.svg';
import CLOSE from './close.svg';

export const LogoIcon = (props) => {
	return (
		<>
			<img
				src={LOGO}
				alt=''
				className={props.className}
				style={{ ...props.style, visibility: 'hidden' }}
			/>
		</>
	);
};
export const UserIcon = (props) => {
	return (
		<>
			<img
				src={props.src.includes('undefined') ? USER : props.src}
				alt=''
				className={props.className}
				style={props.style}
			/>
		</>
	);
};
export const ArrowUp = (props) => {
	return (
		<>
			<img src={UP} alt='' className={props.className} style={props.style} />
		</>
	);
};
export const ArrowDown = (props) => {
	return (
		<>
			<img src={DOWN} alt='' className={props.className} style={props.style} />
		</>
	);
};
export const FlameIcon = (props) => {
	return (
		<>
			<img src={FLAME} alt='' className={props.className} style={props.style} />
		</>
	);
};
export const CloseIcon = (props) => {
	return (
		<>
			<img
				src={CLOSE}
				alt=''
				className={props.className}
				style={props.style}
				onClick={props.onClick}
			/>
		</>
	);
};
