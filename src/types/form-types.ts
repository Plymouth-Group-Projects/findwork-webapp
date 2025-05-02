export interface PackageDetails {
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  revisions: string;
  includes: string;
}

export interface FormDataType {
  // Professional Information
  professionalTitle: string;
  shortBio: string;
  skills: string;
  languages: string;
  experienceLevel: string;
  
  // Gig Details
  gigTitle: string;
  category: string;
  subcategory: string;
  gigDescription: string;
  searchTags: string;
  deliveryTime: string;
  revisions: string;
  
  // Pricing
  pricingModel: 'single' | 'tiered';
  singlePrice?: string;
  basicPackage: PackageDetails;
  standardPackage: PackageDetails;
  premiumPackage: PackageDetails;
  
  // Media & Requirements
  portfolioImages: string[];
  thumbnail: string;
  video?: string;
  documents?: string[];
  buyerRequirements?: string;
  
  // Metadata (optional in form but added for consistency)
  status?: 'active' | 'pending' | 'inactive';
}
