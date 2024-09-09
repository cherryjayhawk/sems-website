import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";
import Provider from '../src/containers/Provider'
import Layout from '../src/containers/Layout'

export default function App({ Component, pageProps }) {
  return (
    <Provider>
        <Component {...pageProps} />
    </Provider>
  )
}