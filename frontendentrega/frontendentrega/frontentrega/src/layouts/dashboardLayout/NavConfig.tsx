// component
import Iconify from 'components/Iconify';
import { ENUM_OPTIONS_MENU } from 'constants/enums';
// ----------------------------------------------------------------------
export type NavConfigType = {
    id          : number;
    title       : string;
    descripcion?: string;
    path        : string;
    icon        : JSX.Element;
    children    : React.ReactNode[];
    info        : string;
};

interface Options {
    [key: string]: string;
}
interface Option {
    name: string;
    description: string;
}

const optionsData: Option[] = ENUM_OPTIONS_MENU;

const options: Options = optionsData.reduce((acc: Options, option: Option) => {
    acc[option.name] = option.description;
    return acc;
}, {});

export type menuType = {
    [key: string]: string;
};

const getIcon = (name: string) => <Iconify icon={name} width={22} height={22} />;

const navConfig = (menu: any): NavConfigType[] => {
    const sections = Array.from(new Set(menu.map((route: any) => route.path.split('/')[1])));

    const subRoutes = (routes: any, section: any) => routes
                                                    .filter((route: any) => route.path.split('/')[1] === section)
                                                    .map((n: any) => ({
                                                        ...n,
                                                        icon: getIcon(n.icon)
                                                    }));

    const menu_aux = sections.map((item: any, index) => {
                        const sub_menu = subRoutes(menu, item);
                        const i: keyof Options = item;
                        const title = options[i];
                        const filteredChildren = sub_menu.filter((m: any) => m.is_client === false || m.is_client == null);

                        if (filteredChildren.length > 0) {
                            return {
                                id      : index,
                                title   : title,
                                path    : item,
                                icon    : getIcon('la:braille'),
                                info    : item,
                                children: filteredChildren
                            };
                        }

                        return null;
                    }).filter((item): item is NavConfigType => item !== null);

    return menu_aux.sort((a:any, b: any) => a.id > b.id ? 1 : -1);
};

export default navConfig;
