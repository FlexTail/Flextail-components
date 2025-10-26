import React from "react";
import { Button } from "../ui/Button";

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-center items-center">
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8"
    >
      <circle cx="60" cy="60" r="60" fill="#e2e8f0" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="48"
        fontWeight="bold"
        fill="#64748b"
      >
        404
      </text>
    </svg>
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
      Page Not Found
    </h1>
    <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
      Sorry, the page you are looking for does not exist or has been moved.
    </p>
    <Button
      href="/"
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium text-base shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
    >
      Go Home
    </Button>
  </div>
);

export default NotFound;
