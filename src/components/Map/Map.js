'use client'

import { useState, useEffect } from 'react';
import CircularIndeterminate from '../Loading';
import Error from '@/src/components/Error';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useSession } from 'next-auth/react';

function Map({ activeMap }) {
	const { data: session } = useSession()
	// const [siteId, setSiteId] = useState(activeMap)
	const [map, setMap] = useState();
	const [isLoading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	useEffect(() => {
		fetch(`https://sems-webservice-ten.vercel.app/api/sites?site_id=${activeMap}`, {
			'headers': {
				'Authorization': `bearer ${session?.user.access_token}`
			}
		})
		.then((res) => res.json())
		.then((data) => {
			!data && setError(true)
			setMap(data)
			setLoading(false)
		}).catch((error) => {
			setError(true)
		})
	  }, [])
	
	if (error) return (
		<>
			<div id="map" className="flex justify-center items-center w-full h-[60vh] p-8 bg-slate-300">
				<Error/>
			</div>
			<div className="font-semibold text-center my-2">
				Lokasi: <span id="mapName">
					<Error text="Tidak ditemukan" />
				</span>
			</div>
		</>
	)

	if (isLoading) return (
		<>
			<div id="map" className="flex justify-center items-center w-full h-[60vh] p-8 bg-slate-300">
				<CircularIndeterminate />
			</div>
			<div className="font-semibold text-center my-2">
				Lokasi: <span id="mapName"></span>
			</div>
		</>
	);

	return ( 
		<>
			<div id="map" className="w-full h-[60vh] p-8">
				<MapContainer center={[map.lat, map.long]} zoom={15} scrollWheelZoom={false} className='w-full h-full'>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<Marker position={[map.lat, map.long]}>
						<Popup>
							Lokasi: {map.name} <br />
							<a href={`http://maps.google.com/maps?z=12&t=m&q=loc:${map.lat}+${map.long}`}>Buka di Google Maps</a>
						</Popup>
					</Marker>
				</MapContainer>
			</div>
			<div className="font-semibold text-center my-2">
				Lokasi: <span id="mapName">{ map.name }</span>
			</div>
		</>
	 );
}

export default Map;