export type MegaColumn = { title: string; links: { label: string; href: string }[] };
export type NavItem = {
  label: string;
  href: string;
  mega?: MegaColumn[];
  feature?: { title: string; text: string; href: string; image: string };
};

export const NAV: NavItem[] = [
  { label: "Home", href: "/home" },
  {
    label: "Shop",
    href: "/shop",
    mega: [
      {
        title: "Discover",
        links: [
          { label: "New Arrivals", href: "/shop?sort=newest" },
          { label: "Best Sellers", href: "/shop?bestsellers=1" },
          { label: "On Sale", href: "/shop?sale=1" },
          { label: "Shop All", href: "/shop" },
        ],
      },
      {
        title: "Collections",
        links: [
          { label: "Corporate Wear", href: "/collections/corporate" },
          { label: "Casual Wear", href: "/collections/casual" },
          { label: "Luxury Collection", href: "/collections/luxury" },
          { label: "Wedding & Groom", href: "/wedding" },
        ],
      },
      {
        title: "Services",
        links: [
          { label: "Bespoke Tailoring", href: "/bespoke" },
          { label: "Corporate Orders", href: "/corporate" },
          { label: "Membership Club", href: "/membership" },
          { label: "Outfit Builder", href: "/outfit-builder" },
        ],
      },
    ],
    feature: {
      title: "The Tuxedo Edit",
      text: "Black-tie pieces for the season of celebration.",
      href: "/category/tuxedos",
      image: "/products/noir-floral-jacquard-tuxedo.jpeg",
    },
  },
  {
    label: "Clothing",
    href: "/shop?group=Clothing",
    mega: [
      {
        title: "Tops",
        links: [
          { label: "T-Shirts", href: "/category/t-shirts" },
          { label: "Polo Shirts", href: "/category/polo-shirts" },
          { label: "Shirts", href: "/category/shirts" },
        ],
      },
      {
        title: "Bottoms & Outerwear",
        links: [
          { label: "Jeans", href: "/category/jeans" },
          { label: "Chinos", href: "/category/chinos" },
          { label: "Jackets", href: "/category/jackets" },
        ],
      },
    ],
    feature: {
      title: "Layering Season",
      text: "Overshirts & jackets, made to be lived in.",
      href: "/category/jackets",
      image: "/products/monaco-houndstooth-overshirt.jpeg",
    },
  },
  {
    label: "Suits",
    href: "/shop?group=Suits",
    mega: [
      {
        title: "Tailoring",
        links: [
          { label: "Business Suits", href: "/category/suits" },
          { label: "Blazers", href: "/category/blazers" },
          { label: "Double Breasted", href: "/category/double-breasted-suits" },
          { label: "Tuxedos", href: "/category/tuxedos" },
        ],
      },
      {
        title: "Bespoke",
        links: [
          { label: "Bespoke Suits", href: "/bespoke" },
          { label: "Wedding Tuxedos", href: "/wedding" },
          { label: "Book Consultation", href: "/bespoke#book" },
        ],
      },
    ],
    feature: {
      title: "Crafted For You",
      text: "Bespoke tailoring, measured to perfection.",
      href: "/bespoke",
      image: "/products/windsor-black-two-piece-suit.jpeg",
    },
  },
  {
    label: "Footwear",
    href: "/shop?group=Footwear",
    mega: [
      {
        title: "Shoes",
        links: [
          { label: "Corporate Shoes", href: "/category/corporate-shoes" },
          { label: "Casual Shoes", href: "/category/casual-shoes" },
          { label: "Sneakers", href: "/category/sneakers" },
          { label: "Slides & Sandals", href: "/category/slides" },
        ],
      },
    ],
    feature: {
      title: "Step In Style",
      text: "From monk straps to summer slides.",
      href: "/category/corporate-shoes",
      image: "/products/florence-black-double-monk-shoes.jpeg",
    },
  },
  {
    label: "Accessories",
    href: "/accessories",
    mega: [
      {
        title: "Accessories Hub",
        links: [
          { label: "Watches", href: "/category/watches" },
          { label: "Ties", href: "/category/ties" },
          { label: "Bangles", href: "/category/bangles" },
          { label: "Caps", href: "/category/caps" },
          { label: "Belts", href: "/category/belts" },
        ],
      },
    ],
    feature: {
      title: "Finishing Touches",
      text: "The details that define the look.",
      href: "/accessories",
      image: "/products/herm-s-izmir-black-leather-sandals.jpeg",
    },
  },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "Best Sellers", href: "/shop?bestsellers=1" },
    { label: "Suits & Blazers", href: "/shop?group=Suits" },
    { label: "Footwear", href: "/shop?group=Footwear" },
    { label: "Accessories", href: "/accessories" },
  ],
  Services: [
    { label: "Bespoke Tailoring", href: "/bespoke" },
    { label: "Corporate & Bulk Orders", href: "/corporate" },
    { label: "Wedding Styling", href: "/wedding" },
    { label: "Membership Club", href: "/membership" },
    { label: "Style Guide", href: "/style-guide" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Fashion Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Account: [
    { label: "My Account", href: "/account" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Shopping Bag", href: "/cart" },
    { label: "Track Order", href: "/account/orders" },
  ],
};
