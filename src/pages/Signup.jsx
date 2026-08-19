import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/signup";

export default function Signup() {
  
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "owner",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await signupUser(form);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("User created successfully");
    }

    setLoading(false);
  };

  return (
    <div className=" w-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-100"
      >
        <h2 className="text-2xl font-bold mb-6">Test Signup</h2>

        <input
          name="full_name"
          placeholder="Full name"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
        >
          <option value="hotel_manager">hotel manager</option>
          <option value="hotel_admin">hotel Admin</option>
          <option value="hr">hr</option>
          <option value="receptionist">receptionist</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </form>
        <button
          onClick={()=>navigate(-1)}
          className="w-90 bg-zinc-900 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Signin"}
        </button>
    </div>
  );
}
