import { writable } from 'svelte/store';

export type HeroContainerProps = {
	width: string;
	height: string;
	color: string;
};

const HOMEPAGE_HERO_CONTAINER_PROPS: HeroContainerProps = {
	width: 'w-5/6',
	height: 'h-3/6',
	color: 'bg-primary'
};

export { HOMEPAGE_HERO_CONTAINER_PROPS };

export default writable(HOMEPAGE_HERO_CONTAINER_PROPS);
