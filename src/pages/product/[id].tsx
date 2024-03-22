import axios from 'axios';
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { stripe } from '../../lib/stripe';
import Stripe from 'stripe';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    description: string;
    defaultPriceId: string;
  };
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  const handleBuyProduct = async () => {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId,
      });

      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao processar o pagamento, tente mais tarde....');
    }
  };

  return (
    <ProductContainer>
      <ImageContainer>
        <Image
          src={product.imageUrl}
          width={520}
          height={480}
          alt="img-photo"
        />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{(Number(product.price) / 100).toFixed(2)}</span>
        <p>{product.description}</p>

        <button onClick={handleBuyProduct} disabled={isCreatingCheckoutSession}>Comprar Agora</button>
      </ProductDetails>
    </ProductContainer>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'prod_PjaPYJCcXM5Nph' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}: any) => {
  const productId = params.id;

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  const price = product.default_price as Stripe.Price;

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: price.unit_amount,
        description: product.description,
        defaultPriceId: price.id,
      },
    },
    // revalidate: 60 * 60 * 1,
  };
};
