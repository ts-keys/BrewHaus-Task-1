const exploreLinks = [
  { label: "Home", href: "#home" },
  { label: "Staff Picks", href: "#books" },
  { label: "Browse Books", href: "#books" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const supportLinks = [
  { label: "Get in Touch", href: "#contact" },
  { label: "Shipping & Delivery", href: "#contact" },
  { label: "Returns & Refunds", href: "#contact" },
  { label: "FAQs", href: "#contact" },
];

function FooterColumn({ title, links }) {
  return (
    <div className="footer-column">
      <h3>{title}</h3>

      <div className="footer-links">
        {links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer id="contact">
      <div className="footer-main">
        <div className="footer-brand">
          <h2 className="logo">Chapter House</h2>

          <p className="footer-tagline">
            A home for every story. A new chapter for every reader.
          </p>

          <p>
            Discover stories that inspire, ideas that stay with you,
            and books that make every chapter worthwhile.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              IG
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              FB
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              TT
            </a>
          </div>
        </div>

        <FooterColumn title="Explore" links={exploreLinks} />

        <FooterColumn title="Customer Care" links={supportLinks} />

        <div aria-hidden="true" />
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2026 Chapter House. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <a href="#contact">Privacy Policy</a>
          <a href="#contact">Terms &amp; Conditions</a>
        </div>

        <p>Made for the love of reading.</p>
      </div>
    </footer>
  );
}

export default Footer;