
export interface ProjectFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  designTypes: string[];
  description: string;
  goals: string;
  brandStatus: string;
  brandPersonality: string;
  colors: string;
  references: string;
  audience: string;
  market: string;
  deadline: string;
  budget: string;
  additionalNotes: string;
}

export enum DesignType {
  Logo = "تصميم شعار",
  Branding = "هوية بصرية كاملة",
  SocialMedia = "سوشيال ميديا",
  Print = "مطبوعات",
  Packaging = "تغليف منتجات",
  UIUX = "واجهات تطبيقات"
}
