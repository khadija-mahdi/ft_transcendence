import Link from 'next/link';
import * as React from "react";
import { usePathname } from 'next/navigation'

function NavBtn({href, name, Icon}: {
	href:string;
	name:string;
	Icon: any;
	flag: boolean;
}) {
	
	const pathname = usePathname()
	const selected = pathname == href;

  return (
	<Link href={href} className='underline-none'>
  
	<span className={`flex items-center space-x-1 cursor-pointer ${selected? "border-b-2 border-[#FF3D00]  text-[#FF3D00]" : "text-[#A2A2A2] border-none"} pb-2`}>
		<Icon className="h-7 w-7" color={selected?'#FF3D00' : '#A2A2A2'} />
		<div>{name}</div>
	</span>
  </Link>
  )
}

export default NavBtn;

  
