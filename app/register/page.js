"use client";
import { useState } from "react";
import axios from 'axios'; // Make sure to import axios

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Should be a boolean, not a string

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Perform the API call to register the user
      const response = await axios.post('/api/register', { name, email, password });
      console.log(response.data); // Handle the response accordingly
      // Reset the form or handle the success (e.g., redirecting to login page)
      setName('');
      setEmail('');
      setPassword('');
      // Implement further actions like redirect or state update
    } catch (err) {
      console.error(err);
      // Handle the error, maybe display a message to the user
    } finally {
      setLoading(false); // Ensure loading is false when the request is finished
    }
  };

  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items center vh-100">
          <div className="col-lg-5 shadow bg-light p-5">
            <h2 className="mb-4">Register</h2>
            {/* Form elements go here */}
          </div>
        </div>
      </div>
    </main>
  );
}
