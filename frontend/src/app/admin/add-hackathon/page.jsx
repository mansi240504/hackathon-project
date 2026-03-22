"use client";
import React ,{useEffect} from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from 'axios';
 
const AddHackathon = () => {
  
  const router = useRouter();

  // redirect if not company  
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "company") {
      router.push("/login");
    }
  }, [router]);

  // ✅ Validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    difficulty: Yup.string().required("Difficulty is required"),
    tags: Yup.string().required("At least one tag is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      difficulty: "Easy",
      tags: "",
      startDate: "",
      endDate: "",
    },
    validationSchema,
    onSubmit: (values,{resetForm}) => {

      console.log(values);
      const token = localStorage.getItem("token");

      axios.post('http://localhost:4000/challenges/add', values, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res)=>{
        toast.success("Challenge added successfully");
        console.log(res.data);
        resetForm();
      })
      .catch((err)=>{
        
        toast.error("Failed to add challenge");
        console.log(err);
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-indigo-900 to-gray-800 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Add New Challenge 
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Challenge Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter challenge title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter challenge details"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formik.values.difficulty}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="e.g. frontend, react, api"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {formik.touched.tags && formik.errors.tags && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.tags}</p>
            )}
          </div>

          {/* Dates */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2 font-medium">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 mb-2 font-medium">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold"
          >
            Add Challenge
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHackathon;
