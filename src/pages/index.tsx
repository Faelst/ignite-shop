/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import { HomeContainer, Product } from '../styles/pages/home';

import tShirt1 from '../assets/1.png';

import 'keen-slider/keen-slider.min.css';
import { stripe } from '../lib/stripe';
import { GetServerSideProps, GetStaticProps } from 'next';
import Stripe from 'stripe';
import Link from 'next/link';

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
          <Product className="keen-slider__slide">
            <Image src={tShirt1} width={520} height={480} alt="camisa-1" />

            <footer>
              <strong>{product.name}</strong>
              <span>R$ {(Number(product.price) / 100).toFixed(2)}</span>
            </footer>
          </Product>
        </Link>
      ))}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = response.data.map((item) => {
    const price = item.default_price as Stripe.Price;
    return {
      id: item.id,
      name: item.name,
      imageUrl: item.images[0],
      price: price.unit_amount,
    };
  });
  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2,
  };
};
