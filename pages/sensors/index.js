// 'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';

import Layout from '@/src/containers/Layout'
import Head from 'next/head'
import Topbar from '@/src/containers/Topbar'
import Content from '@/src/containers/Content'
import CircularIndeterminate from '@/src/components/Loading'
import Error from '@/src/components/Error'
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react'
import { fetcher } from '../../src/components/fetcher';

 
export default function Sensors() {
  // const router = useRouter();
  const { data: session} = useSession()

  const { data: sensors, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/sensors', url => fetcher(url, session?.user.access_token), { refreshInterval: 30000 })
  
  if (error) {
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

  if (isLoading) return (
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
          <div className="flex flex-col w-full min-h-screen">
            <div className="w-full flex justify-end my-2">
              <Link href={'/sensors/add'} className="w-24 h-12 font-semibold flex justify-center items-center rounded bg-green-500 text-white" title="Daftarkan perangkat baru">
                  Register
              </Link>
            </div>
            <table className="w-full border-2 border-slate-300">
              <thead>
                  <tr>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">ID Sensor</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Label</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Simbol</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Lokasi</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Area</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Batas Normal Atas</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Batas Normal Bawah</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Status</td>
                      <td className="bg-[--button-primary] font-semibold text-center border-2 border-[--contrast-color] px-4 py-2">Aksi</td>
                  </tr>
              </thead>
              <tbody id="sensors">
                  {
                      sensors?.map((sensor) => {
                          return (
                          <tr key={sensor.id}>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.id }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.label }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.symbol }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.site_name }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.area_name }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.max_norm_value }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.min_norm_value }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">{ sensor.active == 1 ? 'Aktif' : 'Tidak Aktif' }</td>
                              <td className="font-semibold border-2 border-[--contrast-color] px-4 py-1">
                                  <Link href={`/sensors/${sensor.id}`}>
                                      <button className="p-2 rounded bg-amber-500 mx-2" title="Edit sensor">
                                        <Icon icon="iconamoon:edit-bold" color='#ffffff' className="mx-2" width="28" />
                                      </button>
                                  </Link>
                              </td>
                          </tr>
                          )
                      })
                  }  
              </tbody>
            </table>
          </div>
        </div>
      </Content>
    </Layout>
  </>
  )
}