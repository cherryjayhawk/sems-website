'use-client'

import Link from "next/link";
import { useCallback } from "react"
import { useSearchParams, usePathname } from 'next/navigation'


function SideItem({ link = '', text, pathname, children }) {
	// const path = usePathname()
	const searchParams = useSearchParams()

	const createQueryString = useCallback(
		(name, value) => {
		  const params = new URLSearchParams(searchParams)
		  params.set(name, value)
	 
		  return params.toString()
		},
		[searchParams]
	  )

	return ( 
		<Link href={ link } className={`h-1/4 py-2 my-1 flex items-center hover:bg-[--button-primary] font-medium ${pathname == link ? 'bg-[--button-primary]' : ''}`}>
			{ children }
			<p>{ text }</p>
		</Link>
	 );
}

export default SideItem;