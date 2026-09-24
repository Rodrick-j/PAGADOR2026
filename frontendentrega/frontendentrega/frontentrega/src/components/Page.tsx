import React, { Ref, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

interface Props {
    children: React.ReactNode;
    title?: string;
    meta?: React.ReactNode;
}

const Page = ({ children, title = '', meta, ...other }: Props, ref: Ref<HTMLInputElement>) => (
    <>
        <Helmet>
            <title>{`${title} | .:: PAGADOR ::.`}</title>
            {meta}
        </Helmet>
        <Box
            ref={ref}
            {...other}
        >
            {children}
        </Box>
    </>
);

export default forwardRef(Page);
