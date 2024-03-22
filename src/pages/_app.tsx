import { AppProps } from 'next/app';
import Image from 'next/image';

import { globalStyles } from '../styles/global';
import logoImg from '../assets/logo.svg'
import { Container, Header } from '../styles/pages/_app';

export default function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  return (
    <Container>
        <Header>
            <Image src={logoImg} alt='logo' /> 
        </Header>
      <Component {...pageProps} />;
    </Container>
  );
}
