import { AssetsManifest } from "pixi.js";

export const manifest: AssetsManifest = {
	bundles: [
		{
			name: 'game',
			assets: [
				{
					alias: 'arrow-counterclockwise',
					src: 'assets/arrow_counterclockwise.png',
				},
				{
					alias: 'dice',
					src: 'assets/dice_3D_detailed.png',
				},
				{
					alias: 'glass-002',
					src: 'assets/glass_002.ogg',
				},
			],
		},
	],
};
