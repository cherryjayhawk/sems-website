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

export default function Profile() {
	const { data: session } = useSession()
	const router = useRouter()
	const { data, isLoading, error } = useSWR(`https://sems-webservice-ten.vercel.app/users/me`, url => fetcher(url, session?.user.access_token), { refreshInterval: 5000 });
	const [post, setPost] = useState(false)

	const [username, setUsername] = useState();
	const [email, setEmail] = useState();
	const [phone, setPhone] = useState();

	useEffect(() => {
		if (data) {
			setUsername(data.username)
			setEmail(data.email)
			setPhone(data.phone)
		}
	}, [data]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setPost(true);
			const response = await fetch(`https://sems-webservice-ten.vercel.app/api/Profiles?id=${router.query.id}`, {
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
				console.log(result.message)
				notify(result.message);
			} else {
				console.log('nope')
			}
			setPost(false);
		} catch (error) {
      console.log(error)
		}
	}

  if (error) {
    return (
    <>
      <Head>
        <title>Profile | Soil & Environment Monitoring Systems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Profile" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                <div className="text-xl font-semibold">
                  Profile Pengguna
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
        <title>Profile | Soil & Environment Monitoring Systems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Topbar text="Profile" />
        <Content>
          <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
            <div className="flex justify-between mb-4">
                <div className="text-xl font-semibold">
                Profil Pengguna
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
 
  if (data) return (
    <>
    <Head>
      <title>Profile | Soil & Environment Monitoring Systems</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Layout>
      <Topbar text="Pengaturan | Profile" />
      <Content>
        <div className="px-8 py-8 my-4 border-2 border-[--contrast-color] rounded">
          <div className="flex justify-between mb-4">
              <div className="text-xl font-semibold">
              Profile Pengguna
              </div>
          </div>
          <div className="flex justify-center items-center text-xl font-semibold my-4">
              
          </div>
          <div className="flex w-full min-h-[60vh]">
            <form className='w-1/2 m-4' onSubmit={handleSubmit}>
                <div className="flex flex-col w-full">
                    <div className="flex my-4">
                        <label htmlFor="username" className="w-32 font-semibold">Nama Pengguna</label>
                        <input disabled value={username} required type="text" name='username' id="username" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="label" className="w-32 font-semibold">Email</label>
                        <input disabled value={email} required type="text" name='label' id="label" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="flex my-4">
                        <label htmlFor="symbol" className="w-32 font-semibold">Nomor Telp.</label>
                        <input disabled value={phone} required type="text" name='symbol' id="symbol" className="border-2 px-4 py-1 w-96  text-[--contrast-color] bg-[--button-primary] border-[--button-primary]" onChange={e => setPhone(e.target.value)}/>
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
                        <input disabled type="submit" value="Edit" className={`w-24 h-12 rounded bg-amber-500 mx-2 text-white cursor-not-allowed`}/>
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