import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const showButton = router.pathname === "/home" ? true : false;

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-auto">
        <a className="btn btn-ghost normal-case text-xl">
          CA Access Reconciliation
        </a>
      </div>
      <div className="flex justify-end px-3">
        {showButton && (
          <button className="btn btn-secondary">
            <Link href="/">Logout</Link>
          </button>
        )}
      </div>
    </div>
  );
};
export default Navbar;
