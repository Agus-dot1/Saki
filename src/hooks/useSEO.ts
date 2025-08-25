import { useEffect } from 'react';
import { Product } from '../types';
import { JewelryItem } from '../types/jewelry';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  category?: string;
}

interface ProductSEOData extends SEOData {
  product?: Product | JewelryItem;
}

const useSEO = (data: ProductSEOData) => {
  useEffect(() => {
    // Update document title
    document.title = data.title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', data.description);
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords);
    }

    // Open Graph tags
    updateMetaTag('og:title', data.title, true);
    updateMetaTag('og:description', data.description, true);
    updateMetaTag('og:type', data.type || 'website', true);
    
    if (data.image) {
      updateMetaTag('og:image', data.image, true);
      updateMetaTag('og:image:alt', data.title, true);
    }
    
    if (data.url) {
      updateMetaTag('og:url', data.url, true);
      updateLinkTag('canonical', data.url);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', data.title);
    updateMetaTag('twitter:description', data.description);
    
    if (data.image) {
      updateMetaTag('twitter:image', data.image);
    }

    // Product-specific schema markup
    if (data.product && data.type === 'product') {
      const product = data.product;
      
      // Remove existing schema
      const existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Create product schema
      const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: 'description' in product ? product.description : product,
        image: 'images' in product ? product.images : [],
        brand: {
          '@type': 'Brand',
          name: data.brand || 'Saki Beauty'
        },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: data.currency || 'ARS',
          availability: data.availability === 'out_of_stock' 
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Saki Beauty'
          }
        }
      };

      // Add category if available
      if (data.category) {
        schema.category = data.category;
      }



      // Create and append schema script
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }

    // Cleanup function
    return () => {
      // Reset title to default
      document.title = 'Saki Beauty - Productos de Belleza Premium';
      
      // Remove product schema when component unmounts
      const schemaScript = document.querySelector('script[type="application/ld+json"]');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [data]);
};

// Helper function to generate SEO data for products
export const generateProductSEO = (product: Product | JewelryItem): ProductSEOData => {
  const isJewelry = 'material' in product;
  const baseTitle = `${product.name} - Saki Beauty`;
  const baseDescription = isJewelry 
    ? `Descubre ${product.name}, joya de ${(product as JewelryItem).material} de alta calidad. Precio: $${product.price}`
    : `Descubre ${product.name}, producto de belleza premium. ${(product as Product).shortDescription || ''} Precio: $${product.price}`;
  
  const image = 'images' in product && product.images.length > 0 
    ? product.images[0] 
    : undefined;
  
  const keywords = isJewelry
    ? `joyería, ${(product as JewelryItem).material}, ${(product as JewelryItem).category}, accesorios`
    : `belleza, skincare, cuidado de la piel, ${(product as Product).categoryId || 'cosmética'}`;
  
  const availability = 'stock' in product 
    ? (product.stock > 0 ? 'in_stock' : 'out_of_stock')
    : 'in_stock';
  
  const category = isJewelry 
    ? (product as JewelryItem).category
    : (product as Product).categoryId;

  return {
    title: baseTitle,
    description: baseDescription,
    keywords,
    image,
    type: 'product',
    price: product.price,
    currency: 'ARS',
    availability,
    brand: 'Saki Beauty',
    category,
    product
  };
};

// Helper function to generate SEO data for pages
export const generatePageSEO = (title: string, description: string, keywords?: string): SEOData => {
  return {
    title: `${title} - Saki Beauty`,
    description,
    keywords,
    type: 'website',
    brand: 'Saki Beauty'
  };
};

export default useSEO;