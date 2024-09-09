import { useEffect, useState } from 'react'
import Progress from '@/src/components/Progress'
import Error from './Error'
import useSWR from 'swr'

const fetcher = async url => {
	const res = await fetch(url, {"headers":{ "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGVycnlqYXloYXdrIiwiZXhwIjoxNjk3NjE5MzQxfQ.KwFOoF_NK48pjgCooe-d8nprbUUDBx54ixKskjN8BwQ" }})
	const data = res.json()
	return data
  }

export default function RealtimeFilter() {
	const { data: sites, isLoading: isLoadingSites, error: sitesError } = useSWR("https://sems-webservice-ten.vercel.app/api/sites", fetcher);
	const { data: areas, isLoading: isLoadingAreas, error: areasError } = useSWR("https://sems-webservice-ten.vercel.app/api/areas", fetcher);

	const [activeFilter, setActiveFilter] = useState();

	if (sitesError || areasError) return (
		<div className="flex justify-between my-2 font-semibold">
			<div className='flex w-96 items-end'>
				Update Terakhir: <span><Error/></span>
			</div>          
			<div className="flex justify-end">
				<select disabled name="option" id="option" className="border-2 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
					<option id="0" value="0" disabled="disabled" ><Error /></option>
				</select>
			</div>          
		</div>
	)

	if (isLoadingAreas || isLoadingSites) return (
		<div className="flex justify-between my-2 font-semibold">
			<div className='flex w-96 items-end'>
				<Progress/>
			</div>          
			<div className="flex justify-end">
				<select disabled name="option" id="option" className="border-2 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
					<option id="0" value="0" className='text-[--contrast-color]'>--- Pilih di sini ---</option>
				</select>
			</div>          
		</div>
	)

	if (sites == null || areas == null) return (
		<div className="flex justify-between my-2 font-semibold">
			<div className='flex w-96 items-end'>
				Update Terakhir: <Error/>
			</div>          
			<div className="flex justify-end">
				<select name="option" id="option" className="border-2 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
					<option id="0" value="0" className='text-[--contrast-color]'><Error text='Tidak Ditemukan'/></option>
				</select>
			</div>          
		</div>
	)
	
	return (
		<div className="flex justify-between my-2 font-semibold">
			<div className='flex w-96 items-end'>
				Update Terakhir: <span></span>
			</div>          
			<div className="flex justify-end">
				<select name="option" id="option" className="border-2 px-3 py-1 bg-gray-300 border-[--contrast-color] dark:bg-slate-900">
				{
					sites.map((site) => {
						return (
							areas.map((area) => {
								if (site.id == area.site_id) return (
									<option value={area.id} selected={ area.id == activeFilter ? 'selected' : '' } onClick={() => setActiveFilter(area.id)} className='text-[--contrast-color]'>{ site.name } - {area.area_name}</option>
								)
							})
						)
					})
				}
				</select>
			</div>          
		</div>
	)
}