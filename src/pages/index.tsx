import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('../Map/Leaflet'), {
  ssr: false,
}
);

export default function Home() {
  return <>
   <DynamicMap/>
   </>
  
}
