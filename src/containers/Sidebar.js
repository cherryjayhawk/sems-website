import { useRouter, usePathname } from 'next/navigation'
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { Icon } from '@iconify/react';
import SideItem from "../components/SideItem";
import LogoutConfirm from '../components/LogoutConfirm';
import { signIn, useSession } from 'next-auth/react';
import { fetcher } from '../components/fetcher';
import useSWR from 'swr'

function Sidebar() {
    const { data: session } = useSession()
    // console.log(session?.user.token_type + ' ' + session?.user.access_token)
    const { data: updates, error, isLoading } = useSWR('https://sems-webservice-ten.vercel.app/api/update', url => fetcher(url, session?.user.access_token))
    const [open, setOpen] = useState(true);
    const pathname = usePathname()

	return ( 
		<div className={`main flex-col h-full shadow-xl shadow-gray-400 pl-2 overflow-y-auto relative duration-300 ${ open ? 'w-96' : 'w-24'}`} >
            <div className={`absolute cursor-pointer top-9 left-8`}>
                <Icon icon="ic:outline-double-arrow"  className={`duration-300 " + ${open ? '-scale-x-100' : ''}`} width={30} height={0} alt="" onClick={() => setOpen(!open)}  />
            </div>
            <div className="logo my-6 ml-14 h-12 flex items-center">
                <Link href='/?site_id=SITE001'>
                    <Image src="/sems-logo.png" className={`bg-transparent duration-200 ${ !open ? 'opacity-0' : ''}`} width={open ? 240 : 0} height={0} alt="" />
                </Link>
            </div>
            <div className="menu m-2 h-auto p-2">
                <div className="h-full">
                    <SideItem link="/" text={open ? "Dashboard" : ''} pathname={pathname}>
                        <Icon icon="material-symbols:dashboard-outline" className="bg- mx-2 fill-[--contrast-color]" width="28" />
                    </SideItem>
                </div>
            </div>
            <div className="menu m-2 h-auto p-2">
                <hr />
                <div className="h-full">
                    <SideItem link="/realtime" text={open ? "Realtime" : ''} pathname={pathname}>
                        <Icon icon="fluent:gauge-24-regular" className="mx-2 fill-[--contrast-color]" width="28" />
                    </SideItem>
                    <SideItem link="/history" text={open ? "Riwayat" : ''} pathname={pathname}>
                        <Icon icon="ph:chart-line" className="mx-2 fill-[--contrast-color]" width="28" />
                    </SideItem>
                </div>
            </div>
            <div className="references m-2 h-auto p-2">
                <hr />
                <div className="h-full">
                { session?.user.access_token ? (
                    <>
                        <SideItem link="/sensors" text={open ? "Sensor" : ''} pathname={pathname}>
                            <Icon icon="material-symbols:motion-sensor-active" className="mx-2 fill-[--contrast-color]" width="28" />
                        </SideItem>
                        <SideItem link="/areas" text={open ? "Area" : ''} pathname={pathname}>
                            <Icon icon="ph:plant" className="mx-2 fill-[--contrast-color]" width="28" />
                        </SideItem>
                        <SideItem link="/profile" text={open ? "Profile" : ''} pathname={pathname}>
                            <Icon icon="gg:profile" className="mx-2 fill-[--contrast-color]" width="28" />
                        </SideItem>
                        <LogoutConfirm sideOpen={open} />
                    </>
                ) : (
                    <>
                        <button  className={`h-1/4 w-full py-2 flex items-center hover:bg-[--button-primary] font-medium`} onClick={() => signIn()}>
                            <Icon icon="ic:outline-logout" className="mx-2 fill-[--contrast-color]" width="28" />   
                            <p>{open ? "Login" : ''}</p>
                        </button>
                    </>
                )
                }
                </div>
            </div>
        </div>
	 );
}

export default Sidebar;