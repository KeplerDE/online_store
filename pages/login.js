  import { useState } from 'react';
  import toast from 'react-hot-toast';
  import { useRouter, searchParams } from 'next/router';
  import { signIn } from 'next-auth/react'
  import { useSearchParams } from 'next/navigation';




  export default function Login() {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Perform the sign in using next-auth
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        });

        if (result?.error) {
          toast.error(result?.error);
          setLoading(false);
        } else {
          toast.success('Successfully logged in!');
          router.push(callbackUrl);
        }
      } catch (error) {
        toast.error('Failed to log in. Please try again.');
        setLoading(false);
      }
    };
    return (
      <main>
        <div className="container">
          <div className="row d-flex justify-content-center align-items-center vh-100">
            <div className="col-lg-5 bg-light p-5 shadow">
              <h2 className="mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-4"
                  placeholder="Your email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-4"
                  placeholder="Your password"
                />
                <button
                  className="btn btn-primary btn-raised"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Please wait.." : "Submit"}
                </button>


              </form>
              <button
                  className="btn btn-danger btn-raised mb-4"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  Sign in with Google
                </button>
            </div>
          </div>
        </div>
      </main>
    );
  }
