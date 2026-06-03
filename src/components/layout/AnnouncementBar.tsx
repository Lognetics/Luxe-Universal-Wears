const messages = [
  "Complimentary nationwide delivery on orders over ₦150,000",
  "Bespoke tailoring — book your private consultation",
  "Join the Luxe Membership Club for early access & VIP events",
  "International shipping available worldwide",
];

export function AnnouncementBar() {
  const loop = [...messages, ...messages];
  return (
    <div className="overflow-hidden bg-ink py-2.5 text-ivory">
      <div className="flex w-max animate-marquee">
        {loop.map((m, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.25em]">
            {m}
            <span className="text-blue">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
