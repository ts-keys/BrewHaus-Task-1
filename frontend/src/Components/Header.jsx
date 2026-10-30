
import { Link } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { toast } from "react-toastify";

function Header() {
  const { data: session, isPending } = authClient.useSession();

  const signOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <header className="site-header">
      <Link className="logo" to="/">
        Chapter House
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>
        <a href="/#about">About Us</a>
        <a href="/#contact">Contact</a>

        {!isPending && (
          session?.user ? (
            <>
              <Link to="/orders" className="auth-button">
                My Orders
              </Link>

              <button
                type="button"
                className="auth-button"
                onClick={signOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="auth-button">
              Sign In
            </Link>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;
