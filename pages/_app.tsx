import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { AppRouter } from './api/trpc/[trpc]'
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (<>
        <Head>
            <link rel="shortcut icon" href="/santa-hat.png" />
        </Head>
        <Component {...pageProps} />
    </>
    );
}

export default withTRPC<AppRouter>({
    config({ ctx }) {
        const url = process.env.NEXT_PUBLIC_VERCEL_URL ?
            `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc` :
            `http://localhost:3000/api/trpc`;

        return {
            url,
        };
    },
    ssr: true,
})(MyApp);
