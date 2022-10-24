import React, { useEffect } from "react";
import Link from "next/link";

const Navbar = () => {

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-auto">
        <a className="btn btn-ghost normal-case text-xl">
          CA Access Reconciliation
        </a>
      </div>
      <div className="flex justify-end px-3">
        <button className="btn btn-secondary">
          <Link href="/login">Logout</Link>
        </button>
      </div>
    </div>
  );
};
export default Navbar;
