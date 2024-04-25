
import RankingIcon, { BrandsLogo } from "./BrandsLogo";
import IntraLogo from "./intrLogo";
import DiscordLogo from "./DiscordLogo";
import NotificationLogo from "./NotificationLogo";


const RLinks = [
    {
        name: '',
        href: '../ui/Home/home.tsx',
        // href: '/',
        Icon: IntraLogo
    },
    {
        name: '',
        href: '@/app/ui/Tournaments',
        // href: '/',
        Icon: BrandsLogo
    },
    {
        name: '',
        href: '@/app/ui/Ranking',
        // href: '/',
        Icon: DiscordLogo
    },
	{
        name: '',
        href: '@/app/ui/Ranking',
        // href: '/',
        Icon: NotificationLogo
    },
];

export default RLinks;