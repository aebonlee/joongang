// ============================================
// Joongang News Platform - Type Definitions
// ============================================

// --- Articles ---
export interface Article {
  id: string;
  article_number: number;
  title: string;
  subtitle: string | null;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  thumbnail_caption: string | null;
  use_watermark: boolean;
  article_type: 'normal' | 'photo' | 'video';
  video_url: string | null;
  source_name: string | null;
  source_url: string | null;
  author_id: string | null;
  author_name: string | null;
  author_email: string | null;
  editor_id: string | null;
  status: 'draft' | 'pending' | 'published' | 'scheduled' | 'archived';
  is_published: boolean;
  published_at: string | null;
  scheduled_at: string | null;
  view_count: number;
  allow_comments: boolean;
  is_featured: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  sections?: Section[];
  positions?: ArticlePosition[];
  keywords?: string[];
  attachments?: ArticleAttachment[];
}

export interface ArticleSection {
  id: string;
  article_id: string;
  section_id: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ArticlePosition {
  id: string;
  article_id: string;
  position_type: PositionType;
  priority: number;
  assigned_at: string;
  expires_at: string | null;
}

export type PositionType =
  | 'main_headline'
  | 'main_top'
  | 'main_center'
  | 'main_recommend'
  | 'main_photo_video'
  | 'sub_headline'
  | 'sub_top'
  | 'sub_right';

export interface ArticleAttachment {
  id: string;
  article_id: string;
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  sort_order: number;
  created_at: string;
}

// --- Sections ---
export interface Section {
  id: string;
  section_code: number;
  name: string;
  slug: string;
  parent_id: string | null;
  depth: number;
  sort_order: number;
  is_active: boolean;
  icon: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  children?: Section[];
}

// --- Staff ---
export interface Staff {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'superadmin' | 'editor' | 'reporter';
  department: string | null;
  position: string | null;
  bio: string | null;
  avatar_url: string | null;
  byline: string | null;
  is_active: boolean;
  permissions: Record<string, boolean>;
  last_login_at: string | null;
  created_at: string;
}

// --- Comments ---
export interface Comment {
  id: string;
  article_id: string;
  user_id: string | null;
  user_name: string | null;
  content: string;
  parent_id: string | null;
  is_hidden: boolean;
  ip_address: string | null;
  likes: number;
  created_at: string;
  replies?: Comment[];
}

// --- Ads ---
export interface AdSlot {
  id: string;
  slot_code: string;
  name: string;
  description: string | null;
  page_type: 'main' | 'section' | 'article' | 'other';
  device_type: 'pc' | 'mobile' | 'both';
  width: number;
  height: number;
  max_ads: number;
  display_mode: 'rotation' | 'sequential' | 'random';
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Ad {
  id: string;
  slot_id: string;
  advertiser_id: string | null;
  title: string;
  image_url: string | null;
  link_url: string | null;
  html_content: string | null;
  template_id: string | null;
  template_data: Record<string, unknown> | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  open_new_tab: boolean;
  group_order: number;
  impression_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface Advertiser {
  id: string;
  company_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  memo: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdTemplate {
  id: string;
  name: string;
  slot_size: string;
  thumbnail_url: string | null;
  html_template: string;
  variables: TemplateVariable[];
  category: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'image' | 'color' | 'url' | 'number';
  label: string;
  placeholder?: string;
  default_value?: string;
  required: boolean;
  max_length?: number;
}

// --- Community ---
export interface Board {
  id: string;
  board_code: string;
  name: string;
  description: string | null;
  board_type: 'list' | 'gallery';
  allow_anonymous: boolean;
  allow_comments: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface BoardPost {
  id: string;
  board_id: string;
  user_id: string | null;
  author_name: string | null;
  title: string;
  content: string;
  thumbnail_url: string | null;
  attachment_urls: string[] | null;
  view_count: number;
  is_notice: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

// --- Popup ---
export interface Popup {
  id: string;
  title: string;
  content_html: string;
  image_url: string | null;
  link_url: string | null;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  show_close_today: boolean;
  device_type: 'pc' | 'mobile' | 'both';
  sort_order: number;
  created_at: string;
}

// --- Auth ---
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

// --- Subscribers ---
export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

// --- Tips ---
export interface Tip {
  id: string;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_phone: string | null;
  title: string;
  content: string;
  attachment_urls: string[] | null;
  status: 'received' | 'reviewing' | 'adopted' | 'rejected';
  assigned_to: string | null;
  created_at: string;
}

// --- Editions (지면보기) ---
export interface Edition {
  id: string;
  edition_date: string;        // YYYY-MM-DD
  edition_code: string;        // AA, AE, AW, BT, AY, AL, G, B 등
  edition_label: string;       // "LA판", "워싱턴판", "일요판" 등
  page_number: number;
  pdf_url: string;             // Supabase Storage URL
  thumbnail_url: string | null;
  file_size: number | null;
  created_at: string;
}
