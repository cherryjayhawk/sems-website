import useSWR from 'swr'
import Link from 'next/link'

import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import CircularIndeterminate from '@/src/components/Loading'
import Error from '@/src/components/Error'
import IconButton from '@mui/material/IconButton';
import GaugeChart from '../components/GaugeChart'
import fetcher from '../components/fetcher'

function RealtimeSection() {
	const { data, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/update?area=AREA002', fetcher, { refreshInterval: 30000 })

	if (error) return (
		<div className="flex flex-col">
			<div className="flex justify-center text-xl font-semibold mt-4">
				Tanah
			</div>
			<div className="flex justify-center items-center" id="area">
				<Error />
			</div>
		</div>
	)

	if (isLoading) return (
		<div className="flex flex-col">
			<div className="flex justify-center text-xl font-semibold mt-4">
				Tanah
			</div>
			<div className="flex justify-center items-center" id="area">
				<CircularIndeterminate/>
			</div>
		</div>
	)

	return ( 
		<div className="flex flex-col">
			<div className="flex justify-center text-xl font-semibold mt-4">
				Tanah
			</div>
			<div className="grid grid-cols-6 gap-2 w-full p-4" id='area'>
				<GaugeChart id="gauge2" label="Gauge 2" needle={50} min={0} max={100} metric="Unit2"/>
				{ 
					data.map((update) => {
						return (
					
							gauge(update.ds_id, update.unit_name_idn, update.read_update_value, Number(update.min_norm_value), Number(update.max_norm_value), update.unit_symbol, 'area')
						)
					})
				}
			</div>
		</div>
	 );
}

export default RealtimeSection;