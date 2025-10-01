export interface Auction {
  id: string;
  title: string;
  description: string;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  startingBid: number;
  currentBid: number;
  reservePrice?: number;
  bidIncrement: number;
  startTime: Date;
  endTime: Date;
  status: 'upcoming' | 'active' | 'ended';
  type: 'standard' | 'flash' | 'sealed';
  images: string[];
  tags: string[];
  bids: Bid[];
  totalBidders: number;
  isApproved: boolean;
  location: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameAm: string;
  description: string;
  icon: string;
}

// Mock auction data
export const mockAuctions: Auction[] = [
  {
    id: '1',
    title: 'Vintage Swiss Watch Collection',
    description: 'Rare vintage Swiss watch from 1950s. Fully serviced and in excellent condition. Features original leather strap and gold-plated case.',
    category: 'Watches & Jewelry',
    sellerId: '2',
    sellerName: 'John Seller',
    sellerRating: 4.8,
    startingBid: 5000,
    currentBid: 12500,
    reservePrice: 10000,
    bidIncrement: 500,
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    type: 'standard',
    images: ['https://images.unsplash.com/photo-1723534577634-d7d6d265cfcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd2F0Y2glMjB0aW1lcGllY2V8ZW58MXx8fHwxNzU4MTgzMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    tags: ['vintage', 'swiss', 'luxury', 'collectible'],
    bids: [
      {
        id: 'b1',
        auctionId: '1',
        bidderId: '3',
        bidderName: 'Jane Buyer',
        amount: 12500,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isWinning: true
      },
      {
        id: 'b2',
        auctionId: '1',
        bidderId: '4',
        bidderName: 'Mike B.',
        amount: 12000,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isWinning: false
      }
    ],
    totalBidders: 8,
    isApproved: true,
    location: 'Addis Ababa'
  },
  {
    id: '2',
    title: 'Ethiopian Traditional Art',
    description: 'Beautiful traditional Ethiopian painting depicting cultural scenes. Hand-painted on canvas by renowned local artist.',
    category: 'Art & Antiques',
    sellerId: '2',
    sellerName: 'John Seller',
    sellerRating: 4.8,
    startingBid: 2000,
    currentBid: 4500,
    bidIncrement: 250,
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    type: 'standard',
    images: ['https://images.unsplash.com/photo-1733768296211-17e2233b3630?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwYXJ0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzU4MTgzMjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    tags: ['ethiopian', 'art', 'traditional', 'handmade'],
    bids: [
      {
        id: 'b3',
        auctionId: '2',
        bidderId: '3',
        bidderName: 'Jane Buyer',
        amount: 4500,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isWinning: true
      }
    ],
    totalBidders: 5,
    isApproved: true,
    location: 'Bahir Dar'
  },
  {
    id: '3',
    title: 'Diamond Engagement Ring',
    description: '2-carat diamond engagement ring with certificate of authenticity. 18k white gold setting with excellent cut and clarity.',
    category: 'Watches & Jewelry',
    sellerId: '2',
    sellerName: 'John Seller',
    sellerRating: 4.8,
    startingBid: 20000,
    currentBid: 35000,
    reservePrice: 30000,
    bidIncrement: 1000,
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'active',
    type: 'standard',
    images: ['https://images.unsplash.com/photo-1629201690245-fa87a9c6598e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwZGlhbW9uZCUyMHJpbmd8ZW58MXx8fHwxNzU4MTgzMjg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    tags: ['diamond', 'engagement', 'luxury', 'certified'],
    bids: [
      {
        id: 'b4',
        auctionId: '3',
        bidderId: '4',
        bidderName: 'Mike B.',
        amount: 35000,
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        isWinning: true
      }
    ],
    totalBidders: 12,
    isApproved: true,
    location: 'Addis Ababa'
  },
  {
    id: '4',
    title: 'Classic Volkswagen Beetle 1973',
    description: 'Restored classic 1973 Volkswagen Beetle in excellent condition. Original engine, fresh paint, new interior. Perfect for collectors.',
    category: 'Vehicles',
    sellerId: '2',
    sellerName: 'John Seller',
    sellerRating: 4.8,
    startingBid: 150000,
    currentBid: 150000,
    bidIncrement: 5000,
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'upcoming',
    type: 'standard',
    images: ['https://images.unsplash.com/photo-1652727743972-5fd1483a23ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwY2FyJTIwdmludGFnZXxlbnwxfHx8fDE3NTgxODMyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    tags: ['classic', 'car', 'vintage', 'restored'],
    bids: [],
    totalBidders: 0,
    isApproved: true,
    location: 'Dire Dawa'
  },
  {
    id: '5',
    title: 'Flash Sale: Designer Handbag',
    description: 'Limited time flash sale on authentic designer handbag. Brand new with tags and authenticity certificate.',
    category: 'Fashion',
    sellerId: '2',
    sellerName: 'John Seller',
    sellerRating: 4.8,
    startingBid: 3000,
    currentBid: 4200,
    bidIncrement: 200,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    status: 'active',
    type: 'flash',
    images: ['https://images.unsplash.com/photo-1580920145071-5ea566b9f9fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhdWN0aW9uJTIwZ2F2ZWx8ZW58MXx8fHwxNzU4MTgzMjA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    tags: ['designer', 'handbag', 'fashion', 'authentic'],
    bids: [
      {
        id: 'b5',
        auctionId: '5',
        bidderId: '3',
        bidderName: 'Jane Buyer',
        amount: 4200,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isWinning: true
      }
    ],
    totalBidders: 6,
    isApproved: true,
    location: 'Hawassa'
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: 'Art & Antiques',
    nameAm: 'ጥበብ እና ቅርሶች',
    description: 'Paintings, sculptures, antiques, and collectibles',
    icon: 'Palette'
  },
  {
    id: '2',
    name: 'Watches & Jewelry',
    nameAm: 'ሰዓቶች እና ጌጣጌጦች',
    description: 'Luxury watches, rings, necklaces, and precious items',
    icon: 'Watch'
  },
  {
    id: '3',
    name: 'Vehicles',
    nameAm: 'ተሸከርካሪዎች',
    description: 'Cars, motorcycles, and other vehicles',
    icon: 'Car'
  },
  {
    id: '4',
    name: 'Electronics',
    nameAm: 'ኤሌክትሮኒክስ',
    description: 'Computers, phones, and electronic devices',
    icon: 'Laptop'
  },
  {
    id: '5',
    name: 'Fashion',
    nameAm: 'ፋሽን',
    description: 'Clothing, accessories, and fashion items',
    icon: 'Shirt'
  },
  {
    id: '6',
    name: 'Home & Garden',
    nameAm: 'ቤት እና መናፈሻ',
    description: 'Furniture, appliances, and home decor',
    icon: 'Home'
  }
];