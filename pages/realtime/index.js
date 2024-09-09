import 'chart.js/auto'
import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import CircularIndeterminate from '@/src/components/Loading'
import GaugeChart from '../../src/components/GaugeChart'
import Error from '@/src/components/Error' 

export default function Realtime() {
  const { data: session } = useSession();
  
  const [areaList, setAreaList] = useState([]);
  const [area, setArea] = useState('AREA002');
  const [data, setData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [errorArea, setErrorArea] = useState(false)
  const [errorChart, setErrorChart] = useState(false)

  const fetchAreaList = async () => {
      if (session) {
          try {
              const authorizationHeader = `Bearer ${session?.user.access_token}`;
              const headers = new Headers({
                  Authorization: authorizationHeader,
              });
              const response = await fetch('https://sems-webservice-ten.vercel.app/api/areas', { headers });
              const areaData = await response.json();
              setAreaList(areaData);
          } catch (error) {
              console.error('Error fetching area list:', error);
              setIsLoading(false)
              setErrorArea(true)
          }
      }
  };

  // Fungsi untuk melakukan fetch data berdasarkan tanggal dan area
  const fetchData = async () => {
      if (session) {
          try {
              const authorizationHeader = `Bearer ${session?.user.access_token}`;
              const headers = new Headers({
                  Authorization: authorizationHeader,
              });
              // Lakukan permintaan HTTP (misalnya, fetch data dari API) berdasarkan startDate, endDate, dan area
              const response = await fetch(
                  `https://sems-webservice-ten.vercel.app/api/update?area=${area}`,
                  { headers }
              );
              const newData = await response.json();
              setData(newData);
              setIsLoading(false)
          } catch (error) {
              console.error('Error fetching data:', error);
              setIsLoading(false)
              setErrorChart(true)
          }
      }
  };

  // Fungsi untuk menangani klik tombol "Kirim"
  const handleKirimClick = () => {
      setErrorArea(false)
      setErrorChart(false)
      setIsLoading(true)
      fetchData();
  };

  function isoToDate(dt) {
    const date = new Date(dt)
    return date.toLocaleString()
  }

  // Menggunakan useEffect untuk mengambil daftar area saat komponen pertama kali dimuat
  useEffect(() => {
      fetchAreaList();
      fetchData();
  }, [session]);

  return (
    <>
      <Head>
        <title>Realtime | Soil and Environment Monitoring Systems </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Menu | Realtime" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                  <div className="text-xl font-semibold">
                      Monitor Realtime
                  </div>
            </div>
            <div className='flex justify-between gap-2'>
                <div>Update terakhir: <span>{ data[0]?.read_update_date ? isoToDate(data[0]?.read_update_date) : '' }</span></div>
                <div className="flex border-2 w-98 my-1 font-semibold border-gray-300 dark:bg-none dark:bg-slate-900">
                    <span className="bg-gray-300 dark:bg-slate-900 dark:border-r-2 w-12 h-12 flex justify-center items-center px-2">Area:</span>
                    {
                        errorArea ? (
                            <select disabled defaultValue={''} className="w-72 h-12 px-3 py-1  dark:bg-slate-900">
                                <option value={''}>--Terjadi Kesalahan--</option>
                            </select>
                        ) : (
                            <select defaultValue={area} value={area} onChange={(e) => setArea(e.target.value)} className="w-72 h-12 px-3 py-1 dark:bg-slate-900 rounded-none">
                                {
                                areaList.map((areaOption) => {
                                    if (areaOption.type != '') return (
                                    <option key={areaOption.id} value={areaOption.id} className='rounded-none h-10'>
                                        {areaOption.area_name}
                                    </option>)
                                  })
                                }
                            </select>
                        )
                    }
                  <button onClick={handleKirimClick} className='w-24 h-12 font-semibold rounded bg-slate-900 text-white dark:text-slate-900 dark:bg-gray-300'>
                      Kirim
                  </button>
                </div>   
            </div>
            <hr/>
            <div className="flex flex-col">
              <div className="flex justify-center text-xl font-semibold mt-4">
                Tanah
              </div>
              <div className={`${ isLoading || errorArea || errorChart ? 'flex justify-center items-center min-h-[60vh]' :'grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 gap-2 w-full p-4'}`}> 
                {
                    errorChart && (
                            <Error />
                        ) 
                    }
                { 
                  isLoading ? (
                    <CircularIndeterminate/>
                  ) : 
                    data?.map((update) => {
                      if (update.type != 'env') return (
                        <GaugeChart key={update.ds_id} id={update.ds_id} label={update.unit_name_idn} needle={update.read_update_value} min={Number(update.min_norm_value)} max={Number(update.max_norm_value)} metric={update.unit_symbol}/>
                      )
                    })
                }
              </div>
              <div className="flex justify-center text-xl font-semibold mt-4">
                Lingkungan
              </div>
              <div className={`${ isLoading || errorArea || errorChart ? 'flex justify-center items-center min-h-[60vh]' :'grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-2 gap-2 w-full p-4'}`}> 
                {
                    errorChart && (
                            <Error />
                        ) 
                    }
                { 
                  isLoading ? (
                    <CircularIndeterminate/>
                  ) : 
                    data?.map((update) => {
                      if (update.type == 'env') return (
                        <GaugeChart key={update.ds_id} id={update.ds_id} label={update.unit_name_idn} needle={update.read_update_value} min={Number(update.min_norm_value)} max={Number(update.max_norm_value)} metric={update.unit_symbol}/>
                      )
                    })
                }
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </>
  )
}