"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          CODE CLASH
        </Link>

        <div className="space-x-4">
          <Link href="/login" className="text-gray-300 hover:text-white">
            LOGIN
          </Link>

          <Link href="/signup" className="text-gray-300 hover:text-white">
            SIGN UP
          </Link>

          {/* Company only links */}
          {/* {role === "company" && ( */}
            <>
              <Link
                href="/admin/add-hackathon"
                className="text-gray-300 hover:text-white"
              >
                ADD HACKATHON 
              </Link>

              <Link
                href="/company/manage-hackathon"
                className="text-gray-300 hover:text-white"
              >
                MANAGE HACKATHONS
              </Link>
            </>
          

          <Link href="/view-challenges" className="text-gray-300 hover:text-white">
             CHALLENGES
          </Link>

          <Link href="/user/manage-team" className="text-gray-300 hover:text-white">
            MANAGE TEAM
           </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
