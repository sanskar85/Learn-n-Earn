import EXCEL from '../../assets/excel.svg';
const ExportButton = ({ clickHandler, margin }) => {
	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<button
					onClick={clickHandler}
					style={{
						background: '#88E78C',
						color: '#000',
						fontWeight: '500',
						padding: '0.5rem 1.5rem',
						borderRadius: '5px',
						border: 'none',
						outline: 'none',
						margin: margin || '2rem auto 0',
					}}
				>
					<img src={EXCEL} alt='' />
					Excel Export
				</button>
			</div>
		</>
	);
};
export default ExportButton;
