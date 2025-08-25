import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../../types';
import { JewelryItem } from '../../types/jewelry';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: Product | JewelryItem;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Saki Beauty - Productos de Belleza Premium',
  description = 'Descubre la mejor selección de productos de belleza y joyería premium. Skincare natural, accesorios elegantes y cuidado personal de alta calidad.',
  keywords = 'belleza, skincare, joyería, productos naturales, cuidado de la piel, accesorios, cosmética premium',
  image,
  url,
  type = 'website',
  product,
  noIndex = false
}) => {
  const siteUrl = 'https://saki-beauty.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : `${siteUrl}/icon.svg`;

  // Generate product schema if product is provided
  const generateProductSchema = () => {
    if (!product || type !== 'product') return null;

    const isJewelry = 'material' in product;
    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: isJewelry ? `Joya de ${(product as JewelryItem).material}` : (product as Product).shortDescription || product.name,
      image: 'images' in product ? product.images : [],
      brand: {
        '@type': 'Brand',
        name: 'Saki Beauty'
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'ARS',
        availability: 'stock' in product && product.stock === 0 
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Saki Beauty'
        }
      }
    };

    if (isJewelry) {
      schema.category = (product as JewelryItem).category;
      schema.material = (product as JewelryItem).material;
    } else {
      schema.category = (product as Product).categoryId || 'Belleza';
    }

    return schema;
  };

  const productSchema = generateProductSchema();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={fullUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Saki Beauty" />
      <meta property="og:locale" content="es_AR" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Product Schema */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;