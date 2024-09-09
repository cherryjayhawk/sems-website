import useSWR from 'swr'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router' 

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

export default function Sensors() {
	const { data: session } = useSession()
	const router = useRouter()
	const { data, isLoading, error } = useSWR(`https://sems-webservice-ten.vercel.app/api/sensor?id=${router.query.id}`, url => fetcher(url, session?.user.access_token), { refreshInterval: 40000 });
	const { data: sites, isLoading: isLoadingSites, error: sitesError } = useSWR(`https://sems-webservice-ten.vercel.app/api/sites`, url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 });
	const { data: areas, isLoading: isLoadingAreas, error: areasError } = useSWR(`https://sems-webservice-ten.vercel.app/api/areas`, url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 });
	const [post, setPost] = useState(false)

	const [ID, setID] = useState();
	const [label, setLabel] = useState();
	const [symbol, setSymbol] = useState();
	const [area, setArea] = useState();
	const [active, setActive] = useState();
	const [maxVal, setMaxVal] = useState();
	const [minVal, setMinVal] = useState();

	useEffect(() => {
		if (data) {
			setID(data.id)
			setLabel(data.label)
			setSymbol(data.symbol)
			setArea(data.area)
			setActive(data.active)
			setMaxVal(data.max_norm_value)
			setMinVal(data.min_norm_value)
		}
	}, [data]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setPost(true);
			const response = await fetch(`https://sems-webservice-ten.vercel.app/api/sensors?id=${router.query.id}`, {
				method: 'PUT',
				body: JSON.stringify({
				id: ID, label: label, symbol: symbol, area: area, sts: 1, active: active, max_norm_value: maxVal, min_norm_value: minVal
				}),
				headers: {
				'Content-Type': 'application/json',
				"Authorization": `bearer ${session?.user.access_token}`
				}
			});

			const result = await response.json();

			if (response.status === 200) {
				console.log('yep')
				console.log(result.message)
				notify(result.message);
			} else {
				console.log('nope')
			}
			setPost(false);
		} catch (error) {
			// Handle any other unexpected errors and display an error notification

		}
	}

  if (sitesError || areasError || error) {
    return (
    <>
      <Head>
        <title>Sensor | Soil & Environment Monitoring Systems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Sensor" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                <div className="text-xl font-semibold">
                  Manajemen Perangkat
                </div>
            </div>
            <div className="flex flex-col w-full min-h-[60vh] items-center justify-center">
                  <Error/>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  )}

  if (isLoading || isLoadingSites || isLoadingAreas) return (
    <>
      <Head>
        <title>Sensor | Soil & Environment Monitoring Systems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Sensor" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                <div className="text-xl font-semibold">
                Manajemen Perangkat
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
 
  if (data, sites, areas) return (
    <>
    <Head>
      <title>Sensor | Soil & Environment Monitoring Systems</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <Topbar text="Pengaturan | Sensor" />
      <Content>
        <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
          <div className="flex justify-between mb-4">
              <div className="text-xl font-semibold">
              Manajemen Sensor
              </div>
          </div>
          <div className="flex justify-center items-center text-xl font-semibold my-4">
            Edit Perangkat
          </div>
          <div className="flex w-full min-h-[60vh]">
            <form className='w-1/2 m-4' onSubmit={handleSubmit}>
                <div className="flex flex-col w-full">
                    <div className="flex my-4">
                        <label htmlFor="unit_id" className="w-32 font-semibold">ID</label>
                        <input value={ID} required type="text" name='ID' id="unit_id" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setID(e.target.value)} />
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="label" className="w-32 font-semibold">Label</label>
                        <input value={label} required type="text" name='label' id="label" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setLabel(e.target.value)}/>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="symbol" className="w-32 font-semibold">Simbol</label>
                        <input value={symbol} required type="text" name='symbol' id="symbol" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setSymbol(e.target.value)}/>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="area" className="w-32 font-semibold">Area</label>
                        <select name='area' id="area" defaultValue={area} className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" min="0" onChange={e => setArea(e.target.value)}>
                          {
                            sites.map((site) => {
                              return (
                                areas.map((area) => {
                                  if (site.id == area.site_id) return (
                                    <option key={area.id} value={area.id} className=' text-[--contrast-color] bg-[--button-primary] border-[--button-primary]'>{ site.name } - {area.area_name}</option>
                                  )
                                })
                              )
                            })
                          }
                        </select>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="active" className="w-32 font-semibold">Status</label>
                        <select name='active' id="active" defaultValue={active} className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" min="0" onChange={e => setActive(e.target.value)}>
                            <option value={'0'} className=' text-[--contrast-color] bg-[--button-primary] border-[--button-primary]'>Tidak Aktif</option>
                            <option value={'1'} className=' text-[--contrast-color] bg-[--button-primary] border-[--button-primary]'>Aktif</option>
                        </select>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="max_norm_value" className="w-32 font-semibold">Batas Normal Atas</label>
                        <input value={maxVal} required type="number" name='max_norm_value' id="max_norm_value" min={0} step={0.05} className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setMaxVal(e.target.value)}/>
                        <div className='flex justify-center items-center' title="Batas nilai normal atas pada tanaman terkait. Misal: Bawang merah mempunyai temperatur ideal maximal 32 C">
                          <Icon icon="ph:question" className="bg- mx-2 fill-[--contrast-color] cursor-pointer" width="20"/>
                        </div>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="min_norm_value" className="w-32 font-semibold">Batas Normal Bawah</label>
                        <input value={minVal} required type="number" name='min_norm_value' id="min_norm_value" min={0} step={0.05} className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setMinVal(e.target.value)}/>
                        <div className='flex justify-center items-center' title="Batas nilai normal bawah pada tanaman terkait. Misal: Bawang merah mempunyai temperatur ideal minimal 25 C">
                          <Icon icon="ph:question" className="bg- mx-2 fill-[--contrast-color] cursor-pointer" width="20"/>
                        </div>
                    </div>
                </div>
                <div className="flex my-2">
                    <div className="w-24 h-12 flex justify-center items-center rounded bg-slate-400 mx-2 text-white cursor-pointer" onClick={()=> {router.back()}}>Kembali</div>
                    {
                      post ? (
                        <div className={`w-24 h-12 flex justify-center items-center rounded bg-amber-500 mx-2 text-white cursor-not-allowed`}>
                          <CircularIndeterminate/>
                        </div>
                      ) : (
                        <input type="submit" value="Edit" className={`w-24 h-12 rounded bg-amber-500 mx-2 text-white cursor-pointer`}/>
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