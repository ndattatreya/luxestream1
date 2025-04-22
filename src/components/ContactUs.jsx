// pages/ContactUs.js
import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "", 
    serviceInterested: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      if (response.data.success) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          companyName: "",
          serviceInterested: "",
          message: "",
        });
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">Contact Us</h1>
        <p className="mt-6 text-lg leading-relaxed">
          Need assistance? Fill out the form below, and we'll get back to you soon.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full p-3 bg-gray-800 rounded"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-3 bg-gray-800 rounded"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-800 rounded"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="w-full p-3 bg-gray-800 rounded"
            required
            value={formData.companyName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="serviceInterested"
            placeholder="Service Interested In"
            className="w-full p-3 bg-gray-800 rounded"
            required
            value={formData.serviceInterested}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            className="w-full p-3 bg-gray-800 rounded h-32"
            required
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="bg-red-500 px-6 py-3 rounded hover:bg-red-600">
            Send Message
          </button>
        </form>

        {status === "loading" && <p className="mt-4 text-yellow-400">Sending message...</p>}
        {status === "success" && <p className="mt-4 text-green-400">Message sent successfully!</p>}
        {status === "error" && <p className="mt-4 text-red-400">Failed to send message. Please try again.</p>}
      </div>
    </div>
  );
};

export default ContactUs;
