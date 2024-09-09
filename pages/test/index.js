import React from 'react'
import dynamic from 'next/dynamic'
import Layout from '@/src/containers/Layout'
// import { MapComponent } from '../../src/components/MapComponent'
import Head from 'next/head.js'
import 'leaflet/dist/leaflet.css'
// import MapComponent from '../../src/components/MapComponent'
const Map = dynamic(() => import('../../src/components/Map'), { ssr: false})

function Test() {
  return (
    <>
    <Head>
      <title>Dashboard | Soil & Environment Monitoring Systems</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <div className='h-dvh w-full'>
          <Map activeMap={'SITE001'}/>
      </div>
    </Layout>
    </>
  )
}

export default Test