import './globals.css';
import Script from 'next/script';
import { CsrfProvider } from './context/CsrfContext';

export const metadata = {
    title: 'RestoFlowing',
    description: 'Restaurant Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className="light-style layout-menu-fixed"
            data-theme="theme-default"
            data-template="vertical-menu-template-free"
        >
        <head>
            {/* ✅ Favicon */}
            <link rel="icon" href="/img/favicon/favicon.png" />

            {/* ✅ Sneat CSS */}
            <link rel="stylesheet" href="/css/vendor/core.css" />
            <link rel="stylesheet" href="/css/vendor/theme-default.css" />
            <link rel="stylesheet" href="/css/demo.css" />
            <link rel="stylesheet" href="/css/libs/perfect-scrollbar/perfect-scrollbar.css" />
            <link rel="stylesheet" href="/css/libs/apex-charts/apex-charts.css" />

            {/* ✅ JS: helpers → config 순서 중요 */}
            <script src="/js/vendor/helpers.js" defer></script>
            <script src="/js/config.js" defer></script>
        </head>
        <body>
        <CsrfProvider>
            {children}
        </CsrfProvider>

        {/* ✅ Sneat 관련 JS */}
        <Script src="/js/libs/jquery/jquery.js" strategy="afterInteractive" />
        <Script src="/js/libs/popper/popper.js" strategy="afterInteractive" />
        <Script src="/js/vendor/bootstrap.js" strategy="afterInteractive" />
        <Script src="/js/libs/perfect-scrollbar/perfect-scrollbar.js" strategy="afterInteractive" />
        <Script src="/js/vendor/menu.js" strategy="afterInteractive" />
        <Script src="/js/libs/apex-charts/apexcharts.js" strategy="afterInteractive" />
        <Script src="/js/main.js" strategy="afterInteractive" />
        <Script src="/js/dashboards-analytics.js" strategy="afterInteractive" />
        </body>
        </html>
    );
}