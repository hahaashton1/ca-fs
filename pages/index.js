import Head from 'next/head'
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

export default function Home() {

  const [file, setFile] = useState(null);
  const [tableJSON, setTableJSON] = useState(null);
  const [codes, setCodes] = useState([]);

  const handleImport = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const fileReader = new FileReader();
    const tempCodes = [];

    if (file) {
      fileReader.onload = (event) => {
        const data = event.target.result;
        const csv = Papa.parse(data, {header: true});
        setTableJSON(csv.data);
        // This works
        //console.log(csv.data);
        csv.data.forEach((row) => {
          if (!tempCodes.includes(row.utcode)) {
            console.log(row.utcode);
            tempCodes.push(row.utcode);
          }
        });
        setCodes(tempCodes);
      }
      fileReader.readAsText(file);
    }
  }

  const handleCheck = (e) => {
    e.preventDefault();
  
    //////////////////////////////////////////
    // Get user-specifc data from grants db
    //////////////////////////////////////////

    //const codes = ["UT53FTA","UT17DHG"]; // Make sure to change this to a dynamic array
    const queryStr = `/api/getUser?${codes.map((n, index) => `utcode=${n}`).join('&')}`;

    axios.get(queryStr)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })    


    // 1. Check if input doesnt exist in grant db

    // 2. Input exists but profile is different or more profiles exist

  }

  return (
    <div>
      <Head>
        <title>CAAR</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="grid place-items-center justify-center">
          <div className="grid grid-cols-1 gap-6 content-center max-w-screen-lg">
            <div className="card w-96 bg-primary text-primary-content">
              <div className="card-body px-5">
                <h2 className="card-title">File Upload</h2>
                <p>Please upload the file that you wish to check:</p>
                <input type={"file"} accept={".csv"} onChange={handleImport}/>
                <div className="card-actions justify-end">
                  <button className="btn" onClick={(e)=>{handleSubmit(e);}}>Upload</button>
                  <button className="btn" onClick={(e)=>{handleCheck(e);}}>Check</button>
                </div>
              </div>
            </div>
            <div>
              {/* if tableJSON is not null, then display table */}

              {tableJSON && (
                <div className="block overflow-y-auto h-[50vh]">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>UT-Code</th>
                        <th>Application</th>
                        <th>Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableJSON.map((row, index) => (
                        <tr key={index}>
                          <td>{row.utcode}</td>
                          <td>{row.application}</td>
                          <td>{row.profile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
