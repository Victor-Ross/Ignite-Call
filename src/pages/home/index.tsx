import { Heading, Text } from '@ignite-ui/react';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { Container, Hero, Preview } from './styles';

import previewImage from '../../assets/appPreview.png';
import { ClaimUsernameForm } from './components/ClaimUsernameForm';

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda / Ignite Call"
        description="Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Container>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>
          <Text size="xl">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo
          </Text>
          <ClaimUsernameForm />
        </Hero>
        <Preview>
          <Image
            src={previewImage}
            height={400}
            quality={100}
            priority
            alt="Calendário simbolizando aplicação em funcionamento"
          />
        </Preview>
      </Container>
    </>
  );
}
