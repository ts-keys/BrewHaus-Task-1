function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#home">
        Chapter House
      </a>

      <nav aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#books">Books</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

export default Header;