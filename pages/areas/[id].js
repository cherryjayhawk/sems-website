import useSWR from 'swr'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import CircularIndeterminate from '@/src/components/Loading'
import Error from '@/src/components/Error'
import { fetcher } from '@/src/components/fetcher'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notify from '@/src/components/notify'

function Area() {
	const router = useRouter()
	const { data: session} = useSession()
	const { data, error, isLoading } = useSWR(`https://sems-webservice-ten.vercel.app/api/area?area_id=${router.query.id}`, url => fetcher(url, session?.user.access_token), { refreshInterval: 40000 })
	const { data: sites, isLoading: isLoadingSites, error: sitesError } = useSWR(`https://sems-webservice-ten.vercel.app/api/sites`, url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 });
	const [post, setPost] = useState(false);

	const [ID, setID] = useState();
	const [site, setSite] = useState();
	const [area, setArea] = useState();
	const [type, setType] = useState();

	useEffect(() => {
		if (data) {
			setID(data.id)
			setSite(data.site_id)
			setArea(data.name)
			setType(data.type)
		}
	}, [data])

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setPost(true);
			const response = await fetch(`https://sems-webservice-ten.vercel.app/api/areas?id=${router.query.id}`, {
				method: 'PUT',
				body: JSON.stringify({
					id: ID, site_id: site, name: area, type: type
				}),
				headers: {
					'Content-Type': 'application/json',
					"Authorization": `bearer ${session?.user.access_token}`
				}
			});
			const result = await response.json();

			if (response.ok) {
				notify(result.message);
			}
			setPost(false);
		} catch (error) {
			console.log(error)
		}
	  }

	if (error) return (
		<>
			<Head>
				<title>Area | Soil & Environment Monitoring Systems</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Topbar text="Pengaturan | Area" />
				<Content>
					<div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
					<div className="flex justify-between mb-4">
						<div className="text-xl font-semibold">
							Manajemen Area
						</div>
					</div>
					<div className="flex flex-col w-full min-h-[60vh] items-center justify-center">
						<Error />
					</div>
					</div>
				</Content>
			</Layout>
		</>
	)

	if (data === null) return (
			<>
				<Head>
					<title>Area | Soil & Environment Monitoring Systems</title>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Layout>
					<Topbar text="Pengaturan | Area" />
					<Content>
						<div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
						<div className="flex justify-between mb-4">
							<div className="text-xl font-semibold">
								Manajemen Area
							</div>
						</div>
						<div className="flex flex-col w-full min-h-[60vh] items-center justify-center">
							<Error text={`Error | Sensor \'${router.query.id}\' Tidak Ditemukan`}/>
						</div>
						</div>
					</Content>
				</Layout>
			</>
		)


	if (isLoading) return ( 
		<>
			<Head>
				<title>Area | Soil & Environment Monitoring Systems</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Topbar text="Pengaturan | Area" />
				<Content>
					<div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
					<div className="flex justify-between mb-4">
						<div className="text-xl font-semibold">
							Manajemen Area
						</div>
					</div>
					<div className="flex flex-col w-full min-h-[60vh] items-center justify-center">
						<CircularIndeterminate></CircularIndeterminate>
					</div>
					</div>
				</Content>
			</Layout>
		</>
	 )

	if (data && sites) return (
		<>
			<Head>
				<title>Area | Soil & Environment Monitoring Systems</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Layout>
				<Topbar text="Pengaturan | Area" />
				<Content>
					<div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
					<div className="flex justify-between mb-4">
						<div className="text-xl font-semibold">
							Manajemen Area
						</div>
					</div>
					<div className="flex justify-center items-center text-xl font-semibold my-4">
						Edit Area
					</div>
					<div className="flex w-full min-h-[60vh]">
						<form className='w-1/2 m-4' onSubmit={handleSubmit}>
							<div className="flex flex-col w-full">
								<div className="flex my-4">
									<label htmlFor="unit_id" className="w-32 font-semibold">ID</label>
									<input value={ID} required type="text" name='ID' id="unit_id" className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setID(e.target.value)} />
								</div>
								<div className="flex my-4">
									<label htmlFor="area" className="w-32 font-semibold">Nama Area</label>
									<input value={area} required type="text" name='area' id="area" className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setArea(e.target.value)}/>
								</div>
								<div className="flex my-4">
									<label htmlFor="site" className="w-32 font-semibold">Lokasi</label>
									<select name='site' id="site" defaultValue={site} className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setSite(e.target.value)}>
									{
										sites?.map((site) => {
											return (
												<option key={site.id} value={site.id}>{ site.name }</option>
											)
										})
									}
									</select>
								</div>
								<div className="flex my-4">
									<label htmlFor="type" className="w-32 font-semibold">Tipe</label>
									<select required name='type' defaultValue={type} className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setType(e.target.value)}>
										<option value={'soil'}>Tanah</option>
										<option value={'env'}>Lingkungan</option>
									</select>
								</div>
							</div>
							<div className="flex my-2">
								<div className="w-24 h-12 flex justify-center items-center rounded bg-slate-400 mx-2 text-white cursor-pointer font-semibold" onClick={()=> {router.back()}}>Kembali</div>
								{
									post ? (
										<div className={`w-24 h-12 flex justify-center items-center rounded bg-amber-500 mx-2 text-white cursor-not-allowed`}>
											<CircularIndeterminate/>
										</div>
									) : (
										<input type="submit" value="Edit" className={`w-24 h-12 rounded bg-amber-500 mx-2 text-white cursor-pointer font-semibold`}/>
									)
								}
							</div>
						</form>  
						<ToastContainer hideProgressBar position='bottom-right' />
					</div>
					</div>
				</Content>
			</Layout>
		</>
	)
}

export default Area;