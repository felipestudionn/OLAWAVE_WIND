export interface PriceSegment {
  name: string;
  minPrice: number;
  maxPrice: number;
  percentage: number;
}

export interface ProductFamily {
  name: string;
  percentage: number;
}

export interface ProductTypeSegment {
  type: 'REVENUE' | 'IMAGEN' | 'ENTRY';
  percentage: number;
}

// This matches the structure from merch-mind-planner
export interface SetupData {
  totalSalesTarget: number;
  monthlyDistribution: number[];
  expectedSkus: number;
  families: string[];
  dropsCount: number;
  avgPriceTarget: number;
  targetMargin: number;
  plannedDiscounts: number;
  hasHistoricalData?: boolean;
  productCategory: 'ROPA' | 'CALZADO' | 'ACCESORIOS' | string; // Allow string for AI flexibility
  productFamilies: ProductFamily[];
  priceSegments: PriceSegment[];
  productTypeSegments: ProductTypeSegment[];
  minPrice: number;
  maxPrice: number;
}

export interface CollectionPlan {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  season?: string;
  location?: string;
  setup_data: SetupData;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CollectionSku {
  id: string;
  plan_id: string;
  category: string;
  family: string;
  name: string;
  description?: string;
  variant_name?: string;
  cost: number;
  price: number;
  quantity: number;
  attributes?: any;
  created_at: string;
  updated_at: string;
}
