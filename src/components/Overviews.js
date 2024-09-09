import useSWR from 'swr'
import Overview from './Overview';
import { Icon } from '@iconify/react';
import Error from './Error';
import CircularIndeterminate from './Loading';
import { useSession } from 'next-auth/react';
import { fetcher } from './fetcher';
import { Courier_Prime } from 'next/font/google';

const errFont = Courier_Prime({
	subsets: ['latin-ext'],
	weight: ['400']
})

function Overviews() {
	const { data: session } = useSession()
	const { data, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/overviews', url => fetcher(url, session?.user.access_token), { refreshInterval: 40000 })

	if (error) return (
		<div className="summary flex justify-around h-1/6">
			<div className="m-2 p-2 flex items-center rounded border-[--contrast-color] border-2 w-1/4">
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
				<div className="w-full flex flex-col justify-between">
					<div>
						<Error text='Error' />
					</div>
					<div className="text-end font-semibold text-sm px-4">
						Update terakhir
					</div>
				</div>
			</div>
			<Overview text="Lokasi" value="">
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Device" value="">
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Sensor" value="">
				<Icon className="mx-4 fill-[--contrast-color]" icon="material-symbols:motion-sensor-active" width="36" />
			</Overview>
		</div>
	)

	if (isLoading) return (
		<div className="summary flex justify-around h-1/6">
			<div className="m-2 p-2 flex items-center rounded border-[--contrast-color] border-2 w-1/4">
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
				<div className="w-full flex flex-col justify-between">
					<div className={"font-semibold text-lg"}>
						{ 'Loading..' }
					</div>
					<div className="text-end font-semibold text-sm px-4">
						Update Terakhir
					</div>
				</div>
			</div>
			<Overview text="Lokasi" value={'Loading..'}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Device" value={'Loading..'}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Sensor" value={'Loading..'}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="material-symbols:motion-sensor-active" width="36" />
			</Overview>
		</div>
	)

	return ( 
		<div className="summary flex justify-around h-1/6">
			<div className="m-2 p-2 flex items-center rounded border-[--contrast-color] border-2 w-1/4">
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
				<div className="w-full flex flex-col justify-between">
					<div className={ data?.last_update ? "font-semibold text-lg" : errFont.className}>
						{ data?.last_update ? data.last_update.slice(0, 10) : 'Error' }
					</div>
					<p className="text-sm">
						{ data?.last_update ? data.last_update.slice(11, 19) : "" }
						{/* { data.last_update && data.last_update.slice(10, 5) } */}
					</p>
					<div className="text-end font-semibold text-sm px-4">
						Update Terakhir
					</div>
				</div>
			</div>
			<Overview text="Lokasi" value={data?.site_count}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Device" value={data?.device_count}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="fluent-mdl2:date-time" width="36" />
			</Overview>
			<Overview text="Sensor" value={data?.sensor_count}>
				<Icon className="mx-4 fill-[--contrast-color]" icon="material-symbols:motion-sensor-active" width="36" />
			</Overview>
		</div>
	 );
}

export default Overviews;