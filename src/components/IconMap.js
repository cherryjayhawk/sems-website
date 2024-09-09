import { Icon } from "@iconify/react";

function IconMap({siteId, activeMap, handleClick}) {

    return ( 
        <div className={`flex justify-center items-center border-2 border-[--contrast-color] text-left rounded-md m-2 ${ siteId === activeMap ? 'bg-[--button-primary]' : ''} hover:bg-[--button-primary] `}>
                <Icon onClick={handleClick(siteId)} icon="uiw:map" className="mx-2 fill-[--contrast-color] cursor-pointer" width={28} />
        </div>
     );
}

export default IconMap;