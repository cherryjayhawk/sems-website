function Main({ children }) {
	return ( 
		<div className="content flex-col w-full h-auto overflow-y-scroll">
			{ children }
		</div>
	 );
}

export default Main;