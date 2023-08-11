import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Web3 from 'web3';
import { Delete_Request, Get_Request, Post_Request } from "../services/axios";

const prescription = () => {
  const [passportNumber, setPassportNumber] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [spin, setSpin] = useState(false);
  const handleSearchPrescription = async () => {
    if (passportNumber) {
      setErrorMessage("");
      setMessage("");
      try {
        setSpin(true);
        await Get_Request(`prescription/${passportNumber}`).then(async (res) => {
          setPrescriptions(res.data.data);
          setSpin(false);
        }).catch(async (error) => {
          if (error.response)
            setErrorMessage(error.response.data.message);
          else {
            setErrorMessage(error.message);
          }
          setSpin(false);
        });
      } catch (err) {
        setSpin(false);
        setErrorMessage(err.message);
      }
    } else {
      alert('Please fill in all the required fields.');
    }
  };
  return (
    <>
      <div className='w-full min-h-screen flex justify-center items-center'>
        <div className='mint__card p-4 rounded-lg w-5/6 md:w-3/5 mint__card '>
          <h1 className='heading text-xl font-bold'>Search On Prescription</h1>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Passport Number:
            </label>
            <input type="text" placeholder='Passport Number' value={passportNumber} onChange={(event) => setPassportNumber(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-end items-centre gap-x-2 m-5">
            <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
              onClick={spin ? console.log("Loading...") : handleSearchPrescription} style={{ marginRight: '50px' }}>{spin ? "Loading..." : "search"}</Button>
          </div>
          <a href="/login" className="text-sm text-[#843cff]">back to login</a>
          <label className="text-lg block text-[#dc3545]">{errorMessage}</label>
          <label className="text-lg block text-[#62a7aa]">{message}</label>
          <div className="m-10 bg-[#843cff] h-1" />
          {prescriptions.length ? (
            <div className="m-5">
              <h3 className="heading text-xl mb-5">List of founded Prescriptions:</h3>
              {prescriptions.map((item, index) => (
                <>
                  <ul key={index} className="text-lg block w-[70%] mb-3">
                    <li className="mb-2">Patient Name: {item.patient_name}, Passport Number: {item.passport_number}, Countries: {item.countries}</li>
                    <li className="mb-2">Instructions: {item.instructions}</li>
                    {item.drugs && <>
                      <li className="mb-2 bold">Drugs</li>
                      {item.drugs.map((dItem, dIndex) => (
                        <li className="mb-2">name: {dItem.name} Dosage: {dItem.dosage}</li>
                      ))}
                    </>
                    }
                    <div className="m-1 bg-[#843cff] w-[20%] h-1" />
                  </ul>
                </>
              ))}
            </div>
          ) : (
            <label className="text-lg block text-[#dc3545]">No data founded</label>
          )}
        </div>
      </div>
    </>
  )
}

export default prescription