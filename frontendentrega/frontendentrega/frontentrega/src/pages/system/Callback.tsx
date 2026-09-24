import React, { useState, useEffect, useCallback } from 'react';
import { useIsMounted } from 'hooks/useIsMounted';

// @mui
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import CallBackModule from 'modules/system/auth/callback/CallBackModule';

// ----------------------------------------------------------------------

export default function Callback() {
    return (<CallBackModule />);
}

