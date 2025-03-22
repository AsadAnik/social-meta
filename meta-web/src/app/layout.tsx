import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/components/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "react-hot-toast";
import "../styles/main.scss";
import Notification from "@/components/Notification";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Move InitColorSchemeScript inside head */}
        <InitColorSchemeScript attribute="class" />
        {/* Move Google Fonts to head */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 5000,
                }}
                containerStyle={{
                  top: 80,
                }}
              />
              <Notification />
              {props.children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
