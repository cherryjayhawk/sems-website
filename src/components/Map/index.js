import dynamic from 'next/dynamic'
 
// Server Component:
const Map = dynamic(() => import('./Map'), { ssr: false})
 
export default Map