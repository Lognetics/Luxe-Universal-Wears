// Demo data for the Luxe Universal Wears customer account area.
// Clearly illustrative — replace with real data when the backend is wired up.

export type OrderStatus = "Delivered" | "Processing" | "Shipped";

export type OrderLine = {
  name: string;
  qty: number;
  price: number;
  slug?: string;
};

export type Order = {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  tracking?: string;
  items: OrderLine[];
};

export type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
};

export type Measurements = {
  chest: string;
  waist: string;
  hips: string;
  sleeve: string;
  inseam: string;
  neck: string;
  shoulder: string;
};

export type TailoringRequest = {
  id: string;
  garment: string;
  date: string;
  status: "Requested" | "In Consultation" | "In Production" | "Completed";
  notes: string;
};

export type ReturnRecord = {
  id: string;
  order: string;
  item: string;
  reason: string;
  status: "Approved" | "Pending" | "Refunded";
  date: string;
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "LUX-10428",
    date: "12 May 2026",
    status: "Delivered",
    total: 486000,
    tracking: "DHL-NG-884213097",
    items: [
      { name: "Windsor Black Two-Piece Suit", qty: 1, price: 320000, slug: "windsor-black-two-piece-suit" },
      { name: "Capri Black Leather Cross-Strap Slides", qty: 1, price: 166000, slug: "capri-black-leather-cross-strap-slides" },
    ],
  },
  {
    id: "LUX-10391",
    date: "28 Apr 2026",
    status: "Shipped",
    total: 298000,
    tracking: "GIG-LOS-552190",
    items: [
      { name: "Belgravia Gingham Check Blazer", qty: 1, price: 198000, slug: "belgravia-gingham-check-blazer" },
      { name: "Turin Herringbone Wide-Leg Trousers", qty: 1, price: 100000, slug: "turin-herringbone-wide-leg-trousers" },
    ],
  },
  {
    id: "LUX-10355",
    date: "09 Apr 2026",
    status: "Processing",
    total: 215000,
    items: [
      { name: "Noir Floral Jacquard Tuxedo", qty: 1, price: 215000, slug: "noir-floral-jacquard-tuxedo" },
    ],
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    recipient: "Adewale Okonkwo",
    phone: "+234 802 114 5566",
    street: "House 14, 3rd Avenue, Gwarinpa Estate",
    city: "Abuja",
    state: "FCT",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    recipient: "Adewale Okonkwo",
    phone: "+234 809 778 2210",
    street: "Plot 5, Adetokunbo Ademola Crescent, Wuse II",
    city: "Abuja",
    state: "FCT",
    isDefault: false,
  },
];

export const MOCK_MEASUREMENTS: Measurements = {
  chest: '42"',
  waist: '34"',
  hips: '40"',
  sleeve: '25"',
  inseam: '32"',
  neck: '16"',
  shoulder: '18.5"',
};

export const MOCK_TAILORING: TailoringRequest[] = [
  {
    id: "BSP-2041",
    garment: "Three-Piece Wedding Suit — Ivory Wool",
    date: "20 May 2026",
    status: "In Production",
    notes: "Peak lapel, surgeon cuffs, monogram on inner pocket.",
  },
  {
    id: "BSP-2008",
    garment: "Agbada Set — Midnight Cashmere Blend",
    date: "02 May 2026",
    status: "In Consultation",
    notes: "Gold thread embroidery on neckline, relaxed silhouette.",
  },
  {
    id: "BSP-1987",
    garment: "Dinner Jacket — Black Grosgrain Shawl",
    date: "15 Mar 2026",
    status: "Completed",
    notes: "Delivered. Awaiting fit confirmation review.",
  },
];

export const MOCK_RETURNS: ReturnRecord[] = [
  {
    id: "RET-3021",
    order: "LUX-10391",
    item: "Belgravia Gingham Check Blazer",
    reason: "Size exchange — requested 42R",
    status: "Approved",
    date: "30 Apr 2026",
  },
  {
    id: "RET-2980",
    order: "LUX-10300",
    item: "Aspen Grey Wool Harrington Jacket",
    reason: "Changed mind",
    status: "Refunded",
    date: "18 Mar 2026",
  },
];

export const REWARDS = {
  points: 2840,
  tier: "Silver",
  nextTier: "Gold",
  pointsToNext: 1160,
  perks: [
    "Complimentary express delivery on every order",
    "Early access to seasonal collections & private sales",
    "One free bespoke alteration per quarter",
    "Birthday styling session with a Luxe atelier consultant",
  ],
};

export const TIER_THRESHOLD = REWARDS.points + REWARDS.pointsToNext;
