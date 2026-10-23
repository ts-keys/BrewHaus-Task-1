import { authClient } from "../lib/auth-client";
import { toast } from "react-toastify";

function Header() {

  const { data: session, isPending, error} = authClient.useSession();
  console.log("Session:", session)
  console.log("Session error:", error);
  console.log("is pending", isPending)
  const signOut = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
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
         {!isPending && (
          session?.user ? (
            <button
              type="button"
              className="auth-button"
              onClick={signOut}
            >
              Sign Out
            </button>
          ) : (
            <a href="/login" className="auth-button">
              Sign In
            </a>
          )
        )}
      </nav>
    </header>
  );
}

export default Header;