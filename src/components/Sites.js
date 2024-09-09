import { Courier_Prime } from '@next/font/google'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import CircularIndeterminate from './Loading'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Error from '@/src/components/Error'
import IconMap from './IconMap'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { fetcher } from './fetcher'

function Sites({ activeMap, handleClick }) {
	const { data: session } = useSession()
	const { data, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/sites', url => fetcher(url, session?.user.access_token), { refreshInterval: 10000 })
	
	if (error) return (
		<div className='min-h-[60vh] flex justify-center items-center'>
			<Error/>
		</div>
	)

	if (isLoading) return (
		<div className='min-h-[60vh] flex justify-center items-center'>
			<CircularIndeterminate></CircularIndeterminate>
		</div>
	)

	if (!data) return (
		<div className='min-h-[60vh] flex justify-center items-center'>
			<Error text="Tidak Ditemukan"/>
		</div>
	)

	return ( 
		<>
		{
			data?.map((site) => {
				return (
					<div className="flex" key={site.id}>
						<IconMap siteId={site.id} activeMap={activeMap} handleClick={handleClick} />
						<Link href={`/${site.id}`} className="border-2 border-[--contrast-color] w-full text-left rounded-md my-2 px-3 py-1 hover:bg-[--button-primary] cursor-pointer">
							<span>{ site.id } - { site.name }</span> <br />
							<span>{ site.address }</span>
						</Link>
					</div>
				)
			})
		}
		</>
	)
}

export default Sites;