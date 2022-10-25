import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Login() {

    return (
    <div>
        <Head>
        <title>CAAR - Login</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
        <div className="grid place-items-center justify-center">
            <div className="grid grid-cols-1 gap-6 content-center max-w-screen-lg">
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="username"
                    >
                    Username
                    </label>
                    <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Username"
                    ></input>
                </div>
                <div className="mb-6">
                    <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    for="password"
                    >
                    Password
                    </label>
                    <input
                    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    ></input>
                    <p className="text-red-500 text-xs italic">
                    Please choose a password.
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="btn btn-primary">
                        <Link href="/home">Login</Link>
                    </button>
                </div>
                </form>
            </div>
            <div></div>
            </div>
        </div>
        </main>
    </div>
    );
}