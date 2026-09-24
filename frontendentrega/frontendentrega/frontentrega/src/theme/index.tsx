import React, { useMemo } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider, CustomThemeOptions } from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { ThemeOptions } from '@mui/material/styles/createTheme';

// ----------------------------------------------------------------------
type Props = {
    children?: React.ReactNode;
};

declare module '@mui/material/styles/createPalette' {
    interface PaletteOptions {
        success?: PaletteColorOptions;
        warning?: PaletteColorOptions;
    }
    interface Palette {
        success: PaletteColor;
        warning: PaletteColor;
        chart: {
            violet: string[];
            blue: string[];
            green: string[];
            yellow: string[];
            red: string[];
        };
    }
}

declare module '@mui/material/styles' {
    interface CustomThemeOptions extends ThemeOptions {
        customShadows: {
            z1: string;
            z8: string;
            z12: string;
            z16: string;
            z20: string;
            z24: string;
            primary: string;
            secondary: string;
            info: string;
            success: string;
            warning: string;
            error: string;
        };
    }
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        h0: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        h0?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        h0: true;
    }
}

export default function ThemeProvider({ children }: Props) {
    const themeOptions = useMemo(
        () => ({
            palette,
            shape: { borderRadius: 4 },
            typography,
            shadows,
            customShadows
        }),
        []
    );

    const theme = createTheme(themeOptions as CustomThemeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
}
