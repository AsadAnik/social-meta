import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/components/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
// import { ModeSwitch } from '@/components/widgets';
import ReduxProvider from '@/redux/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" />
        <ReduxProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon.author */}
              <CssBaseline />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 5000,
                }}
                containerStyle={{
                  top: 80,
                }}
              // containerClassName="toast-container by author"
              />
              {/* <ModeSwitch /> */}
              {props.children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
