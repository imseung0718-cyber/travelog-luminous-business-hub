export type NavigationTab = 'home' | 'finance' | 'store' | 'community';

export type CategoryType = '전체' | '우리 동네 소식' | '나눔/장터' | '구인구직' | '질문/답변' | '일상 공유';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | '현장 결제 (카드)'
  | '배달 플랫폼 매출'
  | '모바일 간편결제'
  | '현금 결제'
  | '식자재 구매'
  | '소모품 구매'
  | '임대료/공과금'
  | '인건비 지급'
  | '기타 수입'
  | '기타 지출';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  title: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  paymentMethod?: string;
  memo?: string;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timeAgo: string;
  likes: number;
}

export interface Post {
  id: string;
  authorName: string;
  authorHandle?: string;
  authorAvatar?: string;
  authorInitial?: string;
  authorColorClass?: string;
  timeAgo: string;
  category: CategoryType;
  content: string;
  likes: number;
  commentsCount: number;
  imageUrl?: string;
  userLiked?: boolean;
  comments: PostComment[];
}

export interface TableItem {
  id: string;
  tableNumber: number;
  seats: number;
  isOccupied: boolean;
  guestCount?: number;
  guestName?: string;
  seatedTime?: string;
  orderAmount?: number;
}

export interface AreaStatus {
  id: string;
  name: string;
  icon: string;
  occupied: number;
  total: number;
  colorClass: string;
  tables: TableItem[];
}

export interface WaitlistCustomer {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  waitTimeMin: number;
  registeredAt: string;
  status: 'waiting' | 'called' | 'seated' | 'cancelled';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minRequiredStock: number;
  unit: string;
  status: 'critical' | 'warning' | 'normal';
  lastRestocked: string;
}

export interface CouponItem {
  id: string;
  title: string;
  discount: string;
  usedCount: number;
  totalLimit: number;
  expiry: string;
  isActive: boolean;
}

export interface WeeklyRevenueData {
  day: string;
  fullDay: string;
  date: string;
  amount: number;
  percentage: number;
  isToday?: boolean;
}
