
function Content({ children }) {
	return ( 
		<div className="px-4 flex flex-col items-stretch w-full min-w-fit min-h-dvh">
            { children }
        </div>
	 );
}

export default Content;