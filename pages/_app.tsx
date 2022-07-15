import '../styles/globals.css'
import 'material-icons/iconfont/material-icons.css';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
