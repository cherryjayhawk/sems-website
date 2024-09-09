import useSWR from 'swr'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router' 

import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import CircularIndeterminate from '@/src/components/Loading'
import Error from '@/src/components/Error'
import { fetcher } from '../../../src/components/fetcher'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notify from '../../../src/components/notify'

export default function Sensors() {
  const { data: session } = useSession()
  const router = useRouter()
	const { data: sites, isLoading: isLoadingSites, error: sitesError } = useSWR(`https://sems-webservice-ten.vercel.app/api/sites`, url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 });
	const { data: areas, isLoading: isLoadingAreas, error: areasError } = useSWR(`https://sems-webservice-ten.vercel.app/api/areas`, url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 });
  const [activeFilter, setActiveFilter] = useState();
  const [post, setPost] = useState(false)

  const [ID, setID] = useState();
  const [label, setLabel] = useState();
  const [symbol, setSymbol] = useState();
  const [area, setArea] = useState('AREA001');
  const [maxVal, setMaxVal] = useState();
  const [minVal, setMinVal] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setPost(true);
      const response = await fetch(`https://sems-webservice-ten.vercel.app/api/sensors`, {
        method: 'POST',
        body: JSON.stringify({
          id: ID, label: label, symbol: symbol, area: area, sts: 1, max_norm_value: maxVal, min_norm_value: minVal
        }),
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `bearer ${session?.user.access_token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message)
        notify(result.message);
      } else {
        console.log('Error')
      }
      setPost(false);
    } catch (error) {
      // Handle any other unexpected errors and display an error notification

    }
  }

  if (sitesError || areasError) {
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

  if (isLoadingSites || isLoadingAreas) return (
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
 
  return (
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
            Registrasi Perangkat
          </div>
          <div className="flex w-full min-h-[60vh]">
            <form className='w-1/2 m-4' onSubmit={handleSubmit}>
                <div className="flex flex-col w-full">
                    <div className="flex my-4">
                        <label for="unit_id" className="w-32 font-semibold">ID</label>
                        <input required type="text" name='ID' id="unit_id" className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setID(e.target.value)} />
                    </div>
                    <div className="flex my-4">
                        <label for="label" className="w-32 font-semibold">Label</label>
                        <input required type="text" name='label' id="label" className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setLabel(e.target.value)}/>
                    </div>
                    <div className="flex my-4">
                        <label for="symbol" className="w-32 font-semibold">Simbol</label>
                        <input required type="text" name='symbol' id="symbol" className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setSymbol(e.target.value)}/>
                    </div>
                    <div className="flex my-4">
                        <label for="area" className="w-32 font-semibold">Area</label>
                        <select name='area' id="area" defaultValue={area} className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" min="0" onChange={e => setArea(e.target.value)}>
                          {
                            sites.map((site) => {
                              return (
                                areas.map((area) => {
                                  if (site.id == area.site_id) return (
                                    <option key={area.id} value={area.id} onClick={() => setActiveFilter(area.id)} className='text-[--contrast-color]'>{ site.name } - {area.area_name}</option>
                                  )
                                })
                              )
                            })
                          }
                        </select>
                    </div>
                    <div className="flex my-4">
                        <label for="max_norm_value" className="w-32 font-semibold">Batas Normal Atas</label>
                        <input required type="number" name='max_norm_value' id="max_norm_value" min={0} step={0.05} className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setMaxVal(e.target.value)}/>
                        <div className='flex justify-center items-center' title="Batas nilai normal atas pada tanaman terkait. Misal: Bawang merah mempunyai temperatur ideal maximal 32 C">
                          <Icon icon="ph:question" className="bg- mx-2 fill-[--contrast-color] cursor-pointer" width="20"/>
                        </div>
                    </div>
                    <div className="flex my-4">
                        <label for="min_norm_value" className="w-32 font-semibold">Batas Normal Bawah</label>
                        <input required type="number" name='min_norm_value' id="min_norm_value" min={0} step={0.05} className="border-2 px-4 py-1 w-96 text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setMinVal(e.target.value)}/>
                        <div className='flex justify-center items-center' title="Batas nilai normal bawah pada tanaman terkait. Misal: Bawang merah mempunyai temperatur ideal minimal 25 C">
                          <Icon icon="ph:question" className="bg- mx-2 fill-[--contrast-color] cursor-pointer" width="20"/>
                        </div>
                    </div>
                </div>
                <div className="flex my-2">
                    <div className="w-24 h-12 flex justify-center items-center rounded bg-slate-400 mx-2 text-white cursor-pointer" onClick={()=> {router.back()}}>Kembali</div>
                    {
                      post ? (
                        <div className={`px-3 py-1 rounded bg-green-500 mx-2 text-white cursor-not-allowed`}>
                          <CircularIndeterminate/>
                        </div>
                      ) : (
                        <input type="submit" value="Register" id="register" className={`w-24 h-12 rounded bg-green-500 mx-2 text-white cursor-pointer`}/>
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