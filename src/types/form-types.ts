export interface PackageDetails {
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  revisions: string;
  includes: string;
}

export interface EmployerDetails {
  employer: string;
  duration: string;
  role: string;
}

export interface EducationDetails {
  institution: string;
  qualification: string;
  yearCompleted: number;
}

export interface CertificationDetails {
  title: string;
  issuer: string;
  year: number;
}

export interface ContactDetails {
  phone: string;
  email: string;
  address: string;
}

export interface FormDataType {
  // Personal Information
  name: string;
  gender: string;
  dob: string;
  imageUrl: string;
  profileTitle: string; // Title to identify different profiles from the same user
  
  // Contact Information
  contact: ContactDetails;
  
  // Professional Information
  languagesSpoken: string[];
  bio: string;
  category: string;
  topSkills: string[];
  level: string;
  availability: string;
  salary: string;
  jobsCompleted: number;
  
  // Experience Details
  experience: {
    years: number;
    previousEmployers: EmployerDetails[];
  };
  
  // Education & Certifications
  education: EducationDetails[];
  certifications: CertificationDetails[];
  
  // Media & Requirements
  portfolioImages: string[];
  thumbnail: string;
  video?: string;
  documents?: string[];
  buyerRequirements?: string;
  
  // Metadata (optional in form but added for consistency)
  status?: 'active' | 'pending' | 'inactive';
}
