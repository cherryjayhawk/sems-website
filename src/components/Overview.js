import { Courier_Prime } from 'next/font/google'

const errFont = Courier_Prime({
	subsets: ['latin-ext'],
	weight: ['400']
})

function Overview({ text, value, children }) {
	return ( 
		<div className="m-2 p-2 flex items-center rounded border-[--contrast-color] border-2 w-1/4">
			{ children }
			<div className="w-full flex flex-col justify-between">
				<div className={ value ? "font-semibold text-lg" : errFont.className}>
					{/* { value.includes("T") ? value.slice(0, 10) : value } */}
					{ value ? value : "Error" }
				</div>
				<div className="text-end font-semibold text-sm px-4">
					{ text }
				</div>
			</div>
		</div>
	 );
}

export default Overview;