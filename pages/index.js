import Head from 'next/head'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import Layout from '@/src/containers/Layout'
import Content from '@/src/containers/Content'
import Topbar from '@/src/containers/Topbar'
import Overviews from '@/src/components/Overviews';
import Sites from '@/src/components/Sites';
import Map from '@/src/components/Map';
import { fetcher } from '../src/components/fetcher';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyWarn from '@/src/components/notifyWarn'


export default function Home() {
  const { data: session } = useSession()
  const { data: updates, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/update', url => fetcher(url, session?.user.access_token))
	const [activeMap, setActiveMap ] = useState('SITE001')

  function handleClick(siteId) {
    setActiveMap(siteId)
  }

  useEffect(() => {
    const notificationShown = localStorage.getItem('notificationShown');

    // Check if the notification has already been shown
    if (updates && notificationShown !== 'true') {
      let shouldShowNotification = false;
      updates.forEach((update) => {
        if (Number(update.read_update_value) > Number(update.max_norm_value) || Number(update.read_update_value) < Number(update.min_norm_value)) {
          shouldShowNotification = true;
        }
      });

      if (shouldShowNotification) {
        notifyWarn("Peringatan nilai abnormal");
        localStorage.setItem('notificationShown', 'true'); // Mark the notification as shown
      }
    }
  }, [updates]);

  

  return (
    <>
      <Head>
        <title>Dashboard | Soil & Environment Monitoring Systems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Dashboard" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                <div className="text-xl font-semibold">
                  Dashboard
                </div>
            </div>
            <div className="flex flex-col w-full">
                <Overviews/>
                <div className="flex-col h-full my-2">
                  <div className="flex h-full w-full">
                    <div className="w-1/2">
                      <Map activeMap={activeMap} />
                    </div>
                    <div className="w-1/2 overflow-y-scroll p-8 h-full">
                      <Sites activeMap={activeMap} handleClick={handleClick}/>
                    </div>
                </div>
                </div>
            </div>
            {
                updates?.map((update) => {
                    if (Number(update.read_update_value) > Number(update.max_norm_value) || Number(update.read_update_value) < Number(update.min_norm_value)) {
                        notifyWarn(`Peringatan nilai abnormal: ${update.unit_name_idn}`)
                    }
                })
            }
            <ToastContainer position='bottom-left' autoClose={5000} />
          </div>
        </Content>
      </Layout>
    </>
  )
}