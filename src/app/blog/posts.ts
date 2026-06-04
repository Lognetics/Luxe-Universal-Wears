export type BlogCategory =
  | "Fashion Trends"
  | "Suiting Guides"
  | "Grooming Tips"
  | "Corporate Fashion"
  | "Wedding Fashion"
  | "Seasonal Collections";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  image: string;
  author: string;
  authorRole: string;
  date: string; // ISO
  readTime: string;
  featured?: boolean;
  body: BlogBlock[];
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Fashion Trends",
  "Suiting Guides",
  "Grooming Tips",
  "Corporate Fashion",
  "Wedding Fashion",
  "Seasonal Collections",
];

export const POSTS: BlogPost[] = [
  {
    slug: "anatomy-of-the-perfect-lagos-suit",
    title: "The Anatomy of the Perfect Abuja Suit",
    excerpt:
      "From shoulder line to break, we break down the construction details that separate a forgettable suit from one that commands the room the moment you walk in.",
    category: "Suiting Guides",
    image: "/products/windsor-black-two-piece-suit.jpeg",
    author: "Tunde Adeyemi",
    authorRole: "Head of Bespoke",
    date: "2026-05-22",
    readTime: "8 min read",
    featured: true,
    body: [
      {
        type: "p",
        text: "A great suit is never an accident. It is the sum of a hundred quiet decisions — the angle of a shoulder, the weight of a canvas, the half-inch of cuff that should reveal itself when you reach to shake a hand. In Abuja, where the heat is unforgiving and the standard of dress is exacting, these decisions matter even more. The right suit does not merely fit; it negotiates the climate, the occasion, and the man wearing it.",
      },
      {
        type: "h2",
        text: "It Begins at the Shoulder",
      },
      {
        type: "p",
        text: "The shoulder is the foundation of the entire garment. A clean, natural shoulder line that follows your own anatomy is the single most important indicator of quality tailoring. When the shoulder is too wide, the jacket appears borrowed; too narrow, and it strains with every movement. At Luxe Universal Wears we favour a lightly structured Neapolitan shoulder — soft enough to breathe in Abuja humidity, sharp enough to hold its shape from a morning meeting in Utako to an evening in Maitama.",
      },
      {
        type: "p",
        text: "Beneath that shoulder sits the canvas — the internal layer that gives a jacket its life. A fully canvassed jacket moulds to your body over time, developing a drape that fused interlinings can never replicate. It is the difference between a suit you wear and a suit that becomes part of you.",
      },
      {
        type: "quote",
        text: "A suit should whisper that it was made for you, never shout that it was expensive.",
        cite: "Tunde Adeyemi, Head of Bespoke",
      },
      {
        type: "h2",
        text: "The Trouser, Often Forgotten",
      },
      {
        type: "p",
        text: "Men obsess over the jacket and neglect the trouser, yet the trouser determines the silhouette from the waist down. The break — where the hem meets the shoe — should be a single, soft crease. A heavy break pools fabric and shortens the leg; no break at all can read as too fashion-forward for a boardroom. We recommend a quarter-break for most of our clients: refined, modern, and quietly confident.",
      },
      {
        type: "h2",
        text: "Fabric for the Climate",
      },
      {
        type: "p",
        text: "Heavy worsted wools belong in cooler climates. For Nigeria, we reach for high-twist wools, tropical-weight blends, and fresco weaves that allow air to move through the cloth. These fabrics resist wrinkling through a long day and recover beautifully overnight. A suit that looks immaculate at 8am and crumpled by noon was never the right cloth to begin with.",
      },
      {
        type: "p",
        text: "Master these four elements — shoulder, canvas, break, and cloth — and you own not just a suit, but a uniform of intent. Everything else, from lapel width to button stance, is the grammar of personal style, and that is a conversation we are always delighted to have.",
      },
    ],
  },
  {
    slug: "five-trends-defining-african-menswear-2026",
    title: "Five Trends Defining African Menswear in 2026",
    excerpt:
      "Tactile textures, elevated co-ords and a return to the double-breasted silhouette — the directional looks shaping how the modern African gentleman dresses this year.",
    category: "Fashion Trends",
    image: "/products/monaco-houndstooth-overshirt.jpeg",
    author: "Ifeoma Okafor",
    authorRole: "Fashion Editor",
    date: "2026-05-10",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "African menswear has never been more confident, more global, or more distinctly its own. The conversation has moved beyond imitation of European houses toward a self-assured language that borrows the best of heritage tailoring and reinterprets it for the continent's climate, culture, and pace. These are the five movements we are watching most closely in 2026.",
      },
      {
        type: "h2",
        text: "1. The Texture Renaissance",
      },
      {
        type: "p",
        text: "Flat, smooth fabrics are giving way to tactile interest — houndstooth, herringbone, tweed and jacquard. Texture photographs beautifully, holds its shape in heat, and adds depth to a look without relying on loud colour. Our Monaco Houndstooth Overshirt has become a quiet bestseller precisely because it carries an outfit on pattern alone.",
      },
      {
        type: "h2",
        text: "2. The Considered Co-ord",
      },
      {
        type: "p",
        text: "The matching set has graduated from leisurewear to legitimate occasion dressing. An overshirt-and-trouser co-ord in a refined cloth offers the polish of a suit with the ease the climate demands. It is, perhaps, the most Abuja-appropriate silhouette of the decade.",
      },
      {
        type: "quote",
        text: "The new luxury is ease. The man who looks effortless has, in fact, thought about everything.",
        cite: "Ifeoma Okafor",
      },
      {
        type: "h2",
        text: "3. The Double-Breasted Return",
      },
      {
        type: "p",
        text: "Once considered formal to the point of stiffness, the double-breasted jacket is back — softened, shortened, and worn with intention. It flatters a wide range of builds and brings instant authority to a room. For weddings and high-stakes occasions, nothing competes.",
      },
      {
        type: "h2",
        text: "4. Earthen Palettes",
      },
      {
        type: "p",
        text: "Camel, tobacco, olive, sage and sand are displacing the safe navy-and-grey duopoly. These warmer tones complement a range of African skin tones and feel grounded rather than corporate. Expect to see them everywhere from the boardroom to the brunch table.",
      },
      {
        type: "h2",
        text: "5. Footwear as Statement",
      },
      {
        type: "p",
        text: "The double monk and the refined leather sandal are doing the heavy lifting this season. Shoes are no longer an afterthought; they are the punctuation mark that completes the sentence. Invest here, and the rest of the wardrobe follows.",
      },
    ],
  },
  {
    slug: "grooming-rituals-for-the-modern-gentleman",
    title: "Grooming Rituals for the Modern Gentleman",
    excerpt:
      "A sharp wardrobe deserves an equally sharp presentation. Our edit of daily grooming habits that elevate the way you carry yourself.",
    category: "Grooming Tips",
    image: "/products/aspen-sage-quarter-zip-knit-polo.jpeg",
    author: "Chidi Nwosu",
    authorRole: "Style Consultant",
    date: "2026-04-28",
    readTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Tailoring sets the stage, but grooming is the performance. The most beautifully constructed jacket loses its authority on a man whose presentation is careless. Grooming is not vanity; it is respect — for yourself, and for everyone you meet. Here is the ritual we recommend to our clients.",
      },
      {
        type: "h2",
        text: "Skin First",
      },
      {
        type: "p",
        text: "In a humid climate, the foundation of good grooming is clean, balanced skin. A gentle cleanser morning and night, a lightweight moisturiser, and — non-negotiable — daily sunscreen. Healthy skin reads as discipline, and discipline reads as luxury.",
      },
      {
        type: "h2",
        text: "The Architecture of Facial Hair",
      },
      {
        type: "p",
        text: "Whether you wear a full beard or a clean shave, the operative word is intention. Defined lines along the cheek and neck transform a beard from unkempt to deliberate. Visit a barber who understands your face shape, and maintain the edges between visits. A stray neckline can undermine an otherwise immaculate look.",
      },
      {
        type: "quote",
        text: "Detail is not a luxury reserved for the cloth. It belongs to the man as much as the garment.",
        cite: "Chidi Nwosu",
      },
      {
        type: "h2",
        text: "Fragrance, Worn Lightly",
      },
      {
        type: "p",
        text: "A signature scent is one of the most memorable things about a man, but restraint is everything. Apply to pulse points — never drench. In heat, fragrance amplifies, so a single considered spray carries further than you think. Reach for woody, leathery or amber bases that hold up through a long day.",
      },
      {
        type: "h2",
        text: "The Finishing Details",
      },
      {
        type: "p",
        text: "Trimmed nails, clean shoes, a pressed pocket square, fresh breath. None of these announce themselves, yet their absence is always noticed. Grooming, like great tailoring, lives in the details no one consciously registers but everyone subconsciously rewards.",
      },
    ],
  },
  {
    slug: "dressing-for-the-corner-office",
    title: "Dressing for the Corner Office",
    excerpt:
      "Corporate dress codes are evolving. Here is how to project authority and competence in Abuja boardrooms without resorting to the predictable navy suit.",
    category: "Corporate Fashion",
    image: "/products/royal-cobalt-two-piece-suit.jpeg",
    author: "Tunde Adeyemi",
    authorRole: "Head of Bespoke",
    date: "2026-04-14",
    readTime: "7 min read",
    body: [
      {
        type: "p",
        text: "The corporate uniform is no longer a single look. As Nigerian businesses modernise and global influence reshapes office culture, the rules have loosened — but loosened is not the same as abandoned. Knowing how to read a room and dress one notch above it remains one of the most underrated professional skills.",
      },
      {
        type: "h2",
        text: "Authority Without Severity",
      },
      {
        type: "p",
        text: "Black and charcoal suits signal seriousness, but they can also read as cold. A deep cobalt or a rich navy projects the same authority with a measure of personality — particularly powerful for client-facing roles where you want to be both trusted and remembered. Pair it with a crisp white shirt and let the cloth do the talking.",
      },
      {
        type: "h2",
        text: "The Power of the Blazer",
      },
      {
        type: "p",
        text: "Not every day demands a full suit. A well-cut blazer over tailored trousers — sometimes called the broken suit — is the workhorse of modern corporate dressing. A textured houndstooth or check blazer brings warmth and approachability to meetings where a full suit might feel like armour.",
      },
      {
        type: "quote",
        text: "Dress for the conversation you intend to lead, not merely the one on the calendar.",
        cite: "Tunde Adeyemi",
      },
      {
        type: "h2",
        text: "Fit Over Everything",
      },
      {
        type: "p",
        text: "An off-the-rack suit that fits perfectly will always outperform an expensive one that does not. The most common corporate mistakes are sleeves that swallow the wrist and trousers that puddle at the ankle. A skilled tailor and a modest alteration budget will do more for your professional image than any logo.",
      },
      {
        type: "h2",
        text: "Shoes Make the Statement",
      },
      {
        type: "p",
        text: "In the boardroom, eyes drift downward more than you would expect. A polished double monk or oxford in black leather completes the picture and signals attention to detail. Keep them immaculate; scuffed shoes undo an otherwise flawless ensemble in a single glance.",
      },
    ],
  },
  {
    slug: "the-modern-groom-style-playbook",
    title: "The Modern Groom: A Style Playbook",
    excerpt:
      "Your wedding is the most photographed day of your life. A complete guide to dressing the groom and his party with confidence and cohesion.",
    category: "Wedding Fashion",
    image: "/products/noir-floral-jacquard-tuxedo.jpeg",
    author: "Ifeoma Okafor",
    authorRole: "Fashion Editor",
    date: "2026-03-30",
    readTime: "9 min read",
    body: [
      {
        type: "p",
        text: "A groom has exactly one chance to get it right, and the photographs last a lifetime. Wedding dressing is where tailoring becomes theatre — every detail amplified, every choice immortalised. This playbook walks you through building a look that feels unmistakably you, while honouring the gravity of the occasion.",
      },
      {
        type: "h2",
        text: "Decide on the Register",
      },
      {
        type: "p",
        text: "Before fabric or colour, decide on the level of formality. A black-tie evening calls for a tuxedo — and a jacquard or floral dinner jacket lets you honour tradition while standing apart. A daytime garden ceremony invites a lighter suit in a warm tone. Match the register to the venue and the time of day, and you cannot go far wrong.",
      },
      {
        type: "h2",
        text: "Stand Apart From Your Groomsmen",
      },
      {
        type: "p",
        text: "The groom should be visually distinct from his party — subtly, not jarringly. If the groomsmen wear classic black, the groom might choose a textured or patterned jacket. If the party is in navy, the groom can elevate with a midnight-blue tuxedo. The goal is harmony with a clear focal point: you.",
      },
      {
        type: "quote",
        text: "On your wedding day, you are not following the dress code — you are setting it.",
        cite: "Ifeoma Okafor",
      },
      {
        type: "h2",
        text: "The Details That Photograph",
      },
      {
        type: "p",
        text: "Cufflinks, a pocket square, a boutonnière, the right tie or bow — these are the elements the camera loves. Choose accessories that tie back to the wedding palette and to your partner's look. Cohesion across the couple reads as intention and elevates every frame.",
      },
      {
        type: "h2",
        text: "Plan the Timeline",
      },
      {
        type: "p",
        text: "Bespoke and made-to-measure require time — typically eight to twelve weeks from first fitting to final pressing. Begin early, leave room for adjustments, and schedule a final fitting close to the day to account for any changes in form. A rushed wedding suit is a regret you will see in every photograph.",
      },
      {
        type: "p",
        text: "Above all, wear it with joy. The best-dressed groom is not the one in the most expensive cloth, but the one who looks completely, radiantly at ease.",
      },
    ],
  },
  {
    slug: "harmattan-to-rainy-season-wardrobe",
    title: "From Harmattan to Rainy Season: A Wardrobe Guide",
    excerpt:
      "Nigeria's two great seasons demand two distinct approaches to dressing. How to adapt your wardrobe to the dust of Harmattan and the downpours that follow.",
    category: "Seasonal Collections",
    image: "/products/cotswold-camel-houndstooth-blazer.jpeg",
    author: "Chidi Nwosu",
    authorRole: "Style Consultant",
    date: "2026-03-12",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "Most style guides are written for four seasons. Nigeria has two that matter — the dry, dusty Harmattan and the heavy rains — and dressing well here means understanding how each transforms the way fabric behaves, photographs, and feels against the skin.",
      },
      {
        type: "h2",
        text: "Harmattan: Warmth and Texture",
      },
      {
        type: "p",
        text: "The Harmattan brings cooler mornings and a dry haze. This is the season to lean into texture and warmth — a camel houndstooth blazer, a wool overshirt, a layered knit polo. Earthy tones complement the golden light, and slightly heavier cloths finally make sense. It is, quietly, the most rewarding time of year to dress.",
      },
      {
        type: "h2",
        text: "Protect Against the Dust",
      },
      {
        type: "p",
        text: "The fine dust of Harmattan settles on everything. Choose darker, textured fabrics that disguise it, and brush down wool garments regularly. Suede demands particular care — a protective spray and a soft brush will keep your boots and sandals looking their best through the haze.",
      },
      {
        type: "quote",
        text: "Dress with the weather, not against it. The climate is a collaborator, never an obstacle.",
        cite: "Chidi Nwosu",
      },
      {
        type: "h2",
        text: "Rainy Season: Lightness and Recovery",
      },
      {
        type: "p",
        text: "When the rains arrive, humidity climbs and the priority shifts to breathability. High-twist wools, linen blends and fabrics that recover from wrinkling come into their own. Keep a tailored overshirt or unstructured jacket within reach for the sudden temperature drops a downpour brings.",
      },
      {
        type: "h2",
        text: "Footwear Strategy",
      },
      {
        type: "p",
        text: "Leather soles and flooded streets do not mix. Reserve your finest leather shoes for indoor occasions during the rains, and lean on rubber-soled loafers and well-treated leather for the commute. A second pair kept at the office is the mark of a man who plans ahead.",
      },
    ],
  },
  {
    slug: "building-a-ten-piece-capsule-wardrobe",
    title: "Building a Ten-Piece Capsule Wardrobe",
    excerpt:
      "More is not better. The disciplined art of assembling ten versatile pieces that combine into dozens of considered looks.",
    category: "Suiting Guides",
    image: "/products/dune-beige-overshirt-co-ord.jpeg",
    author: "Tunde Adeyemi",
    authorRole: "Head of Bespoke",
    date: "2026-02-26",
    readTime: "7 min read",
    body: [
      {
        type: "p",
        text: "The most stylish men we dress rarely own the most clothes. They own the right clothes — a tight, considered edit of versatile pieces in a coherent palette that combine effortlessly. A capsule wardrobe is not a restriction; it is a liberation from the tyranny of a full closet and nothing to wear.",
      },
      {
        type: "h2",
        text: "Start With the Foundation",
      },
      {
        type: "p",
        text: "Begin with two suits — one in navy, one in charcoal or black — that can be broken into separates. Add a versatile blazer in a warm texture. These three pieces form the backbone of everything from a wedding to a Monday meeting, and they multiply when worn apart.",
      },
      {
        type: "h2",
        text: "Layer in Versatility",
      },
      {
        type: "p",
        text: "Next, a refined overshirt co-ord that works as a set or as separates, two pairs of tailored trousers in neutral tones, and a small rotation of polos and shirts in white, sage and a single pattern. Each piece should speak to every other; the test of a true capsule is that any top works with any bottom.",
      },
      {
        type: "quote",
        text: "Buy less, but buy as though you will own it for a decade. Cost-per-wear is the only honest measure of value.",
        cite: "Tunde Adeyemi",
      },
      {
        type: "h2",
        text: "Anchor With Footwear",
      },
      {
        type: "p",
        text: "Two pairs of shoes complete the ten: a black double monk or oxford for formal occasions, and a versatile suede loafer for everything in between. Quality leather, properly maintained, outlasts a dozen disposable purchases and ages with character.",
      },
      {
        type: "h2",
        text: "Discipline Is the Point",
      },
      {
        type: "p",
        text: "The hardest part of a capsule wardrobe is restraint. Resist the seasonal impulse buy. Every addition should earn its place by combining with at least three things you already own. Master this discipline, and you will never again stand before a full wardrobe with nothing to wear.",
      },
    ],
  },
  {
    slug: "art-of-the-double-breasted-jacket",
    title: "The Art of the Double-Breasted Jacket",
    excerpt:
      "Once the preserve of statesmen and screen icons, the double-breasted jacket is enjoying a confident revival. How to wear it without looking like you stepped out of a costume drama.",
    category: "Fashion Trends",
    image: "/products/brixton-black-suede-trucker-jacket.jpeg",
    author: "Ifeoma Okafor",
    authorRole: "Fashion Editor",
    date: "2026-02-10",
    readTime: "5 min read",
    body: [
      {
        type: "p",
        text: "Few garments carry as much history — or as much risk — as the double-breasted jacket. Worn well, it is the most commanding silhouette in menswear. Worn poorly, it tips into caricature. The difference lies almost entirely in fit and proportion, and once you understand the rules, the payoff is enormous.",
      },
      {
        type: "h2",
        text: "Why It Works Again",
      },
      {
        type: "p",
        text: "The modern double-breasted is shorter, softer and slimmer than its 1980s ancestor. Designers have stripped away the boxiness, leaving a clean, flattering shape that creates the illusion of breadth at the shoulder and slimness at the waist. It is genuinely one of the most figure-enhancing cuts available.",
      },
      {
        type: "h2",
        text: "Keep It Closed",
      },
      {
        type: "p",
        text: "The cardinal rule: a double-breasted jacket should almost always be buttoned. The overlapping front is the entire point; left open, it hangs awkwardly and loses its structure. Fasten the top working button and let the lower one hover, and the line stays sharp whether you are standing or seated.",
      },
      {
        type: "quote",
        text: "The double-breasted jacket rewards the confident and exposes the hesitant. Wear it with conviction.",
        cite: "Ifeoma Okafor",
      },
      {
        type: "h2",
        text: "Styling It Down",
      },
      {
        type: "p",
        text: "It need not always be formal. A double-breasted blazer over a fine knit and tailored trousers reads relaxed yet deliberate. The trick is to balance the formality of the cut with the ease of what you pair it with. Skip the tie, roll with confidence, and the jacket does the rest.",
      },
    ],
  },
  {
    slug: "caring-for-fine-leather-and-suede",
    title: "Caring for Fine Leather and Suede in Abuja",
    excerpt:
      "Quality footwear is an investment. A practical guide to protecting your leather and suede against humidity, dust and the demands of the city.",
    category: "Grooming Tips",
    image: "/products/florence-black-double-monk-shoes.jpeg",
    author: "Chidi Nwosu",
    authorRole: "Style Consultant",
    date: "2026-01-24",
    readTime: "6 min read",
    body: [
      {
        type: "p",
        text: "A fine pair of shoes can last decades — but only if you treat them as the investment they are. Abuja is hard on leather: heat dries it, humidity warps it, and dust dulls its finish. With a modest routine, however, your footwear will not merely survive the city but grow more beautiful with every year.",
      },
      {
        type: "h2",
        text: "Rotate, Always",
      },
      {
        type: "p",
        text: "Never wear the same pair two days running. Leather needs at least twenty-four hours to dry out and recover its shape between wears. Owning two or three pairs in rotation more than doubles the lifespan of each — the single most effective thing you can do for your shoes.",
      },
      {
        type: "h2",
        text: "The Power of Shoe Trees",
      },
      {
        type: "p",
        text: "Cedar shoe trees absorb moisture, prevent creasing and maintain the silhouette of the toe. Insert them the moment you take your shoes off, while the leather is still warm and pliable. It is a small habit with an outsized effect on how your footwear ages.",
      },
      {
        type: "quote",
        text: "Treat your shoes like the foundation of your wardrobe, because that is exactly what they are.",
        cite: "Chidi Nwosu",
      },
      {
        type: "h2",
        text: "Leather Versus Suede",
      },
      {
        type: "p",
        text: "Smooth leather wants a regular cream conditioning and an occasional polish to lock in moisture and restore shine. Suede is more delicate: protect it with a water-and-stain repellent spray, brush it gently with a dedicated suede brush to lift the nap, and never apply liquid polish. Treat each material on its own terms.",
      },
      {
        type: "h2",
        text: "Battling the Elements",
      },
      {
        type: "p",
        text: "During the rains, waterproof generously and let wet shoes dry naturally — never beside direct heat, which cracks leather. In the Harmattan, brush away dust daily before it embeds in the grain. A few minutes of care each week is the difference between footwear that lasts a season and footwear that lasts a lifetime.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPost(slug);
  if (!current) return POSTS.slice(0, limit);
  const sameCat = POSTS.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = POSTS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...rest].slice(0, limit);
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
