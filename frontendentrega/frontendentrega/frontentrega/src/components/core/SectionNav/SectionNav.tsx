import { AppBar, BottomNavigation, BottomNavigationAction, Box, Hidden, makeStyles, Tab, Theme, useTheme } from '@mui/material';
import React, { forwardRef, ReactElement, useImperativeHandle } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
//import { useHistory } from 'react-router';

export type SectionItem = {
    id: string;
    label: string;
    shortName?: string;
    icon?: string;
    color?: string;
    content: ReactElement;
};

export type SectionNavRefProps = {
    getTabSelected: () => string;
    setTabSelected: (id: string) => void;
};

type Props = {
    sections: SectionItem[];
};

const SectionNavComponent = (props: Props, ref: React.Ref<SectionNavRefProps>): ReactElement => {
    const sections = props.sections;
    const theme = useTheme();
    const INITIAL_TAB_SELECTED = sections.length > 0 ? sections[0].id : '-1';

    const [tabSelected, setTabSelected] = React.useState(INITIAL_TAB_SELECTED);

    function handleChange(evt: React.ChangeEvent<{}>, value: string) {
        setTabSelected(value);
        //window.history.replaceState(null, '', `${history.location.pathname}?section=${value}`);
    }

    const refHandler: () => SectionNavRefProps = () => ({
        getTabSelected: () => tabSelected,
        setTabSelected: (id: string) => setTabSelected(id)
    });

    useImperativeHandle(ref, refHandler, [tabSelected]);

    return (
        <div>
            {sections.map((s) => s.id).includes(tabSelected) && (
                <TabContext value={tabSelected}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList value={tabSelected} variant="scrollable" onChange={handleChange}>
                            {sections.map((section, index) => {
                                return <Tab key={index} label={section.label} value={section.id} icon={section.icon ? <img src={section.icon} alt="icon" width="32px" /> : undefined} />;
                            })}
                        </TabList>
                    </Box>
                    {sections.map((section, index) => (
                        <TabPanel key={index} value={section.id} sx={{ p: theme.spacing(1)}}>
                            {section.content}
                        </TabPanel>
                    ))}
                </TabContext>
            )}
        </div>
    );
};

export const SectionNav = forwardRef(SectionNavComponent);
