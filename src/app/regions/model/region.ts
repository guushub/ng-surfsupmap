import { Type, TypeDecorator } from '@angular/core';
import { RegionName } from "./region-name";

export interface Region {
	componentId: string;
	isActive: boolean;
	component: Type<{}>;
	region: RegionName;
	postToggleBehavior?: {(isActive: boolean): void};

}