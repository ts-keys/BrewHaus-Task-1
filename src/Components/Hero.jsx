function Hero() {
  return (
    <section id="home" className="hero">
      <h2>
        Find your next <span>great chapter</span>
      </h2>

      <p>
        Thoughtful recommendations. Beautiful books.
        A place to get lost in a story.
      </p>

      <p>
        Chapter House - A home for every story.
        A new chapter for every reader.
      </p>

      <a className="hero-btn" href="#books">
        Explore books <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}

export default Hero;