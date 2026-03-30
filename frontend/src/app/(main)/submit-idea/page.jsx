"use client";

import { useState } from "react";
import axios from "axios";
import BASE_URL from "@/utils/api"; // 👈 yaha import

export default function SubmitIdea() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    teamId: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👇 YAHI USE HOTA HAI
    await axios.post(`${BASE_URL}/ideas/add`, form);

    alert("Idea submitted successfully");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" onChange={handleChange} placeholder="Title" />
      <input name="description" onChange={handleChange} placeholder="Description" />
      <input name="techStack" onChange={handleChange} placeholder="Tech Stack" />
      <input name="teamId" onChange={handleChange} placeholder="Team ID" />
      <button type="submit">Submit</button>
    </form>
  );
}