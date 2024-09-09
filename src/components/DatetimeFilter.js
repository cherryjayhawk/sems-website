import { useState } from "react";

function DatetimeFilter({text, value}) {
	const [dtValue, setDtValue] = useState(value)

	return (       
		<div className="flex border-2 w-72 my-1 font-semibold border-gray-300 dark:bg-slate-900">
			<span className="bg-gray-300 w-12 flex justify-center items-center px-2">{ text }</span>
			<input value={dtValue} className="pl-2 w-60 text-[--contrast-color] my-1 border-gray-300 dark:bg-slate-900" type="datetime-local" id="end_datetime" name="end_datetime" onChange={(e) => setDtValue(e.target.value)} />
		</div>          
	 );
}

export default DatetimeFilter;