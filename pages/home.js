import Head from "next/head";
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [tableJSON, setTableJSON] = useState(null);
  const [queryCodes, setQueryCodes] = useState([]);
  const [result, setResult] = useState(null);


  const changeRowColour = (value) => {
    if (value.status === "Match") {
      return "bg-green-300";
    }
    return "bg-red-300";
  }

  const handleImport = (e) => {
    setFile(e.target.files[0]);
  };

  // This is for uploading the file
  const handleSubmit = () => {
    
    setResult(null);
    const fileReader = new FileReader();
    const tempCodes = [];

    if (file) {
      fileReader.onload = (event) => {
        const data = event.target.result;
        const csv = Papa.parse(data, { header: true });

        // Better to delete id column in csv file
        csv.data.map((item) => {
          delete item.id;
        });

        setTableJSON(csv.data);

        // Get unique utcode for query string
        csv.data.forEach((row) => {
          if (!tempCodes.includes(row.utcode)) {
            console.log(row.utcode);
            tempCodes.push(row.utcode);
          }
        });
        setQueryCodes(tempCodes);
      };
      fileReader.readAsText(file);
    }
  };

  const handleCheck = () => {
    // Make sure the check button cannot be pressed unless a file has been uploaded

    //////////////////////////////////////////
    // Get user-specifc data from grants db
    //////////////////////////////////////////

    //const codes = ["UT53FTA","UT17DHG"]; // Make sure to change this to a dynamic array
    const queryStr = `/api/getUser?${queryCodes
      .map((n, index) => `utcode=${n}`)
      .join("&")}`;

    const resultSet = new Set();
    const utcodeArr = [];

    axios
      .get(queryStr)
      .then(function (response) {
        console.log(tableJSON);
        console.log(response.data);

        const resultDict = [];

        // Map utcode as the key and the rest of the data as the value
        response.data.map((item) => {
          utcodeArr.push(item.utcode);
        });

        // Iterate over response.data
        tableJSON.forEach((inputRow) => {
          if (!utcodeArr.includes(inputRow.utcode)) {
            resultSet.add(
              JSON.stringify({
                utcode: inputRow.utcode,
                application: inputRow.application,
                profile: inputRow.profile,
                status: "Not Found",
                remarks: "-",
              })
            );
          }
          response.data.forEach((queryRow) => {
            // If both application and profile don't match
            if (
              inputRow.application !== queryRow.application &&
              inputRow.profile !== queryRow.profile &&
              Object.values(queryRow).includes(inputRow.utcode)
            ) {
              resultSet.add(
                JSON.stringify({
                  utcode: queryRow.utcode,
                  application: queryRow.application,
                  profile: queryRow.profile,
                  status: "Mismatch",
                  remarks: "Application and Profile don't match",
                })
              );
            }

            // If application doesn't match but profile matches
            else if (
              (inputRow.application !== queryRow.application &&
                inputRow.profile === queryRow.profile) &&
              Object.values(queryRow).includes(inputRow.utcode)
            ) {
              resultSet.add(
                JSON.stringify({
                  utcode: queryRow.utcode,
                  application: queryRow.application,
                  profile: queryRow.profile,
                  status: "Mismatch",
                  remarks: "Application doesn't match",
                })
              );
            }

            // If application matches but profile doesn't match
            else if (
              (inputRow.application === queryRow.application &&
                inputRow.profile !== queryRow.profile) &&
              Object.values(queryRow).includes(inputRow.utcode)
            ) {
              resultSet.add(
                JSON.stringify({
                  utcode: queryRow.utcode,
                  application: queryRow.application,
                  profile: queryRow.profile,
                  status: "Mismatch",
                  remarks: "Profile doesn't match",
                })
              );
            }

            else if (
              (inputRow.application === queryRow.application &&
                inputRow.profile == queryRow.profile) &&
              Object.values(queryRow).includes(inputRow.utcode)
            ) {
              resultSet.add(
                JSON.stringify({
                  utcode: queryRow.utcode,
                  application: queryRow.application,
                  profile: queryRow.profile,
                  status: "Match",
                  remarks: "-",
                })
              );
            }
          });
        });

        // Convert resultSet to array
        const resultArr = Array.from(resultSet).map((item) => JSON.parse(item));

        setResult(resultArr);
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log("This is working", resultSet);

  };

  return (
    <div>
      <Head>
        <title>CAAR - Home</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="grid place-items-center justify-center">
          <div className="grid grid-cols-1 gap-6 content-center max-w-screen-lg">
            <div className="card w-full bg-primary text-primary-content mt-5">
              <div className="card-body px-5">
                <h2 className="card-title">File Upload</h2>
                <p>Please upload the file that you wish to check:</p>
                <input type={"file"} accept={".csv"} onChange={handleImport} />
                <div className="card-actions justify-end">
                  <button
                    className="btn"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Upload
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      handleCheck();
                    }}
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
            {
              (tableJSON || result) && 
              ( 
                <span className="text-lg text-center font-bold">Results</span>
              ) 
            }
            <div>            
              {tableJSON && result == null && (
                <div className="block overflow-y-auto overflow-x-auto h-[50vh]">
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

              {result && (
                // Iterate over result dictionary
                // If status is not found, then display in red
                // If status is mismatch, then display in yellow
                <div className="block overflow-y-auto h-[50vh]">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>UT-Code</th>
                        <th>Application</th>
                        <th>Profile</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(result).map(([key, value]) => (
                          <tr key={key}>
                            <td className={changeRowColour(value)}>{value.utcode}</td>
                            <td className={changeRowColour(value)}>{value.application}</td>
                            <td className={changeRowColour(value)}>{value.profile}</td>
                            <td className={changeRowColour(value)}>{value.status}</td>
                            <td className={changeRowColour(value)}>{value.remarks}</td>
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
  );
}
