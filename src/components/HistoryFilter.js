import { useEffect, useState } from 'react'
import Error from './Error'
import useSWR from 'swr'
import DatetimeFilter from './DatetimeFilter'
import { fetcher } from './fetcher'

export default function HistoryFilter({ startdate = '', endDate = '', activeArea, handleArea, handleSite, handleStartDate, handleEndDate }) {
	const { data: sites, isLoading: isLoadingSites, error: sitesError } = useSWR(`${process.env.WEBSERVICE_URL}/api/sites`, fetcher);
	const { data: areas, isLoading: isLoadingAreas, error: areasError } = useSWR(`${process.env.WEBSERVICE_URL}/api/areas`, fetcher);

	const [activeFilter, setActiveFilter] = useState();
	const [startDt, setStartDt] = useState(startdate)
	const [endDt, setendDt] = useState(endDate)

	if (sitesError || areasError) return (
		<>
			<div className="flex justify-between my-2 font-semibold">        
				<div className="flex justify-end">
					<select disabled name="option" id="option" className="border-2 w-72 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
						<option id="0" value="0" disabled="disabled">--- Terjadi Kesalahan ---</option>
					</select>
				</div>          
			</div>
			<DatetimeFilter text={'Dari'} value='' />
			<DatetimeFilter text={'Ke'} value='' />
			<input type="submit" value="Kirim" className="flex items-center justify-center px-3 py-2 mx-2 cursor-pointer rounded text-gray-300 bg-slate-900 dark:bg-gray-300 dark:text-slate-900" />  
		</>
	)

	if (isLoadingAreas || isLoadingSites) return (
		<>
			<div className="flex justify-between my-2 font-semibold">        
				<div className="flex justify-end">
					<select disabled name="option" id="option" className="border-2 w-72 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
						<option id="0" value="0" className='text-[--contrast-color]'>--- Pilih di sini ---</option>
					</select>
				</div>          
			</div>
			<DatetimeFilter text={'Dari'} value={startDt} />
			<DatetimeFilter text={'Ke'} value={endDt} />
			<input type="submit" value="Kirim" className="flex items-center justify-center px-3 py-2 mx-2 cursor-pointer rounded text-gray-300 bg-slate-900 dark:bg-gray-300 dark:text-slate-900" />  
		</>
	)

	if (sites == null || areas == null) return (
		<>
			<div className="flex justify-between my-2 font-semibold">       
				<div className="flex justify-end">
					<select disabled name="option" id="option" className="border-2 w-72 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
						<option id="0" value="0" className='text-[--contrast-color]'>--- Tidak ditemukan ---</option>
					</select>
				</div>          
			</div>
			<DatetimeFilter text={'Dari'} value={startDt} />
			<DatetimeFilter text={'Ke'} value={endDt} />
			<input type="submit" value="Kirim" className="flex items-center justify-center px-3 py-2 mx-2 cursor-pointer rounded text-gray-300 bg-slate-900 dark:bg-gray-300 dark:text-slate-900" />  
		</>
	)
	
	return (
		<>
			<div className="flex justify-between my-1 font-semibold">       
				<div className="flex items-end">
					<div>
						<select name="area_id" id="option" defaultValue={activeArea} className="border-2 w-72 px-3 py-1 my-1 border-gray-300 dark:bg-slate-900" onChange={handleArea}>
						{
							sites?.map((site) => {
								return (
									areas.map((area) => {
										if (site.id == area.site_id) return (
											// <option value={area.id} onClick={() => setActiveFilter(area.id)} className='text-[--contrast-color]'>{ site.name } - {area.area_name}</option>
											<option value={area.id} className='text-[--contrast-color]'>{ site.name } - {area.area_name}</option>
										)
									})
								)
							})
						}
						</select>
					</div>
				</div>          
			</div>
			<DatetimeFilter text={'Dari'} value={startDt} handleDate={handleStartDate} />
			<DatetimeFilter text={'Ke'} value={endDt} handleDate={handleEndDate} />
			<input type="submit" value="Kirim" className="flex items-center justify-center px-3 py-2 mx-2 cursor-pointer rounded text-gray-300 bg-slate-900 dark:bg-gray-300 dark:text-slate-900" />  
		</>
	)
}