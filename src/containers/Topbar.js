import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import { Icon } from "@iconify/react";

function Topbar({ text }) {
    const router = useRouter()

	return ( 
		<div className="header m-2 h-12 px-4 flex justify-between items-center">
            <div className="flex font-semibold">
                <Icon icon="ion:chevron-back" className="mx-2 fill-[--contrast-color] cursor-pointer" width="28" onClick={()=> {router.back()}}/>
                { text }
            </div>
            <div className="font-bold">
                <div>Soil and Environment Monitoring System</div>
            </div>
        </div>
	 );
}

export default Topbar;