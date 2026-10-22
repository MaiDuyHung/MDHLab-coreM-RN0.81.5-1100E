import type {
  Category,
  Paginated,
  Product,
  ProductSort,
  ProductSpec,
} from './types';

/**
 * The wire format, and the single place that knows about it.
 *
 * Today `EXPO_PUBLIC_API_URL` points at dummyjson.com. When the MDHLab backend
 * takes over, only the `Raw*` types and the `to*` functions below change — the
 * query hooks, screens, and cart keep working against the domain model.
 */

type RawDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type RawProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: RawDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  reviews?: unknown[];
  images?: string[];
  thumbnail?: string;
};

export type RawProductList = {
  products: RawProduct[];
  total: number;
  skip: number;
  limit: number;
};

export type RawCategory = {
  slug: string;
  name: string;
  url: string;
};

const PLACEHOLDER_IMAGE = 'https://cdn.dummyjson.com/product-images/placeholder.webp';

function toSpecification(raw: RawProduct): ProductSpec[] {
  const specs: ProductSpec[] = [];

  if (raw.brand) {
    specs.push({ label: 'Brand', value: raw.brand });
  }
  if (raw.sku) {
    specs.push({ label: 'SKU', value: raw.sku });
  }
  if (raw.weight) {
    specs.push({ label: 'Weight', value: `${raw.weight} g` });
  }
  if (raw.dimensions) {
    const { width, height, depth } = raw.dimensions;
    specs.push({ label: 'Dimensions', value: `${width} × ${height} × ${depth} cm` });
  }
  if (raw.warrantyInformation) {
    specs.push({ label: 'Warranty', value: raw.warrantyInformation });
  }
  if (raw.shippingInformation) {
    specs.push({ label: 'Shipping', value: raw.shippingInformation });
  }
  if (raw.returnPolicy) {
    specs.push({ label: 'Returns', value: raw.returnPolicy });
  }

  return specs;
}

export function toProduct(raw: RawProduct): Product {
  const thumbnail = raw.thumbnail ?? raw.images?.[0] ?? PLACEHOLDER_IMAGE;

  return {
    id: String(raw.id),
    title: raw.title,
    brand: raw.brand ?? null,
    category: raw.category,
    description: raw.description,
    price: raw.price,
    discount: Math.round(raw.discountPercentage ?? 0),
    inStock: raw.stock ?? 0,
    rating: raw.rating ?? 0,
    numReviews: raw.reviews?.length ?? 0,
    images: (raw.images?.length ? raw.images : [thumbnail]).map(url => ({ url })),
    thumbnail,
    specification: toSpecification(raw),
    tags: raw.tags ?? [],
  };
}

export function toProductPage(raw: RawProductList): Paginated<Product> {
  return {
    items: raw.products.map(toProduct),
    total: raw.total,
    limit: raw.limit,
    skip: raw.skip,
  };
}

export function toCategory(raw: RawCategory): Category {
  return { slug: raw.slug, name: raw.name };
}

/** Our sort options expressed as the backend's `sortBy` / `order` pair. */
export function toSortParams(sort: ProductSort | undefined) {
  switch (sort) {
    case 'cheapest':
      return { sortBy: 'price', order: 'asc' };
    case 'expensive':
      return { sortBy: 'price', order: 'desc' };
    case 'top-rated':
      return { sortBy: 'rating', order: 'desc' };
    case 'newest':
    default:
      return { sortBy: 'id', order: 'desc' };
  }
}
