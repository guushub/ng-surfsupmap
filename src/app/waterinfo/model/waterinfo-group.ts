import { WaterinfoParameter } from "./waterinfo-parameter";

export class WaterinfoGroup {
    label: string;
    defaultFavorite: boolean;
    slug: string;
    parameters: WaterinfoParameter[];
}