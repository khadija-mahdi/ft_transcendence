import * as React from "react";
import HomeIcon from "./HomeIcon";
import TournamentsIcon from "./TournamentsIcon";
import RankingIcon from "./RankingIcon";

const Links = [
    {
        name: 'Home',
        // href: '../ui/Home/home.tsx',
        href: '/',
        Icon: HomeIcon
    },
    {
        name: 'Tournaments',
        href: '@/app/ui/Tournaments',
        // href: '/',
        Icon: TournamentsIcon
    },
    {
        name: 'Ranking',
        href: '@/app/ui/Ranking',
        // href: '/',
        Icon: RankingIcon
    },
];

export default Links;
