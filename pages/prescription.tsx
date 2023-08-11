import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Web3 from 'web3';
import { Delete_Request, Get_Request, Post_Request } from "../services/axios";

const prescription = () => {
  const contractAdress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";
  const [patientName, setPatientName] = useState(null);
  const [passportNumber, setPassportNumber] = useState(null);
  const [destinationCountries, setDestinationCountries] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prescriptions, setPrescriptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [spin, setSpin] = useState(false);
  const contractABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "_patientName",
          "type": "string"
        },
        {
          "name": "_passportNumber",
          "type": "string"
        },
        {
          "name": "_instructions",
          "type": "string"
        },
        {
          "name": "_destinationCountries",
          "type": "string[]"
        },
        {
          "name": "_drug",
          "type": "string[]"
        },
        {
          "name": "_dosage",
          "type": "string[]"
        }
      ],
      "name": "createPrescription",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_prescriptionId",
          "type": "uint256"
        }
      ],
      "name": "getPrescription",
      "outputs": [
        {
          "components": [
            {
              "name": "patientName",
              "type": "string"
            },
            {
              "name": "passportNumber",
              "type": "string"
            },
            {
              "name": "destinationCountries",
              "type": "string[]"
            },
            {
              "name": "drug",
              "type": "string[]"
            },
            {
              "name": "dosage",
              "type": "string[]"
            }
          ],
          "name": "",
          "type": "tuple"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_prescriptionId",
          "type": "uint256"
        }
      ],
      "name": "deletePrescription",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(contractABI, contractAdress);
  const init = async () => {
    const prescriptions = await Get_Request(`prescription`);
    setPrescriptions(prescriptions.data ? prescriptions.data.data : []);
  };
  useEffect(() => {
    init();
  }, []);
  const handleAddPrescription = async () => {
    if (patientName && passportNumber && destinationCountries && instructions && JSON.stringify(data).match(/:""[\},]/) == null) {
      setErrorMessage("");
      setMessage("");
      try {
        setSpin(true);
        await Post_Request('prescription', {
          patient_name: patientName,
          passport_number: passportNumber,
          countries: destinationCountries,
          instructions: instructions,
          drugs: data
        }).then(async (res) => {
          console.log(res)
          const drugNames = data.map(object => object.name);
          const drugDosages = data.map(object => object.dosage);
          const countriesArr = destinationCountries.split(',');
          const updatedCountries = countriesArr.map(element => element.trim());
          await contract.methods.createPrescription(patientName, passportNumber, instructions, updatedCountries, drugNames, drugDosages).send({ from: web3.eth.accounts.givenProvider.selectedAddress }).then(async () => {
            setSpin(false);
            alert('New Prescription added!');
            setMessage("New Prescription added.");
            init();
          }).catch(async (error) => {
            await Delete_Request(`prescription/${res.data.data.id}`);
            setSpin(false);
            setErrorMessage("Transaction failed:", error.message);
          });
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
  const handleRemovePrescription = async (index, id) => {
      setErrorMessage("");
      setMessage("");
      setSpin(true);
      await contract.methods
          .deletePrescription(index)
          .send({ from: web3.eth.accounts.givenProvider.selectedAddress })
          .then(async () => {
              await Delete_Request(`prescription/${id}`);
              setSpin(false);
              setMessage("Prescription removed.");
              alert('Prescription removed!');
              init();
          }).catch(async (error) => {
              if (error.response)
                  setErrorMessage(error.response.data.message);
              else {
                  setErrorMessage(error.message);
              }
              setSpin(false);
          });
  };
  const [counter, setCounter] = useState(1);
  const [data, setData] = useState([{ name: "", dosage: "" }]);
  const handleIncrement = () => {
    setCounter(counter + 1);
    setData([...data, { name: "", dosage: "" }]);
  };

  const handleNameInputChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index]["name"] = value;
    setData(updatedData);
  };

  const handleDosageInputChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index]["dosage"] = value;
    setData(updatedData);
  };

  const handleDecrement = (id) => {
    const updatedData = data.filter((item, index) => index !== id);
    setData(updatedData);
  };
  return (
    <>
      <div className='w-full min-h-screen flex justify-center items-center'>
        <div className='mint__card p-4 rounded-lg w-5/6 md:w-3/5 mint__card '>
          <h1 className='heading text-xl font-bold'>Prescription</h1>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Patient Name:
            </label>
            <input type="text" placeholder='Patient Name' value={patientName} onChange={(event) => setPatientName(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Passport Number:
            </label>
            <input type="text" placeholder='Passport Number' value={passportNumber} onChange={(event) => setPassportNumber(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Destination Countries (comma-separated):
            </label>
            <input type="text" placeholder='Destination Countries (comma-separated):' value={destinationCountries} onChange={(event) => setDestinationCountries(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Instructions:</label>
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="instructions"
              className="border text-sm rounded-md block w-[40%] h-32 p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]"
            />
          </div>
          <h2 className='heading text-xl font-bold mb-5'>Drugs</h2>
          {data.map((item, index) => {
            return (
              <div className="flex justify-centre items-centre gap-x-2 m-5">
                <label className="text-lg block w-[10%]">Name:</label>
                <input type="text" placeholder='Drug Name' value={item.name} onChange={(e) => handleNameInputChange(index, e.target.value)} className="border text-sm rounded-md block w-[30%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                <label className="text-lg block w-[10%]">Dosage:</label>
                <input type="text" placeholder='Dosage' value={item.dosage} onChange={(e) => handleDosageInputChange(index, e.target.value)} className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                {index == 0 ? <Button className='p-2 bg-[#3cffb1] rounded-md text-white'
                  onClick={handleIncrement}>+</Button> : <Button className='p-2 bg-[#dc3545] rounded-md text-white heading' onClick={() => handleDecrement(index)}
                  >-</Button>}
              </div>
            )
          })}
          <div className="flex justify-end items-centre gap-x-2 m-5">
            <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
              onClick={spin ? console.log("Loading...") : handleAddPrescription} style={{ marginRight: '50px' }}>{spin ? "Loading..." : "Add Prescription"}</Button>
          </div>
          <label className="text-lg block text-[#dc3545]">{errorMessage}</label>
          <label className="text-lg block text-[#62a7aa]">{message}</label>
          <div className="m-10 bg-[#843cff] h-1" />
          {prescriptions.length ? (
            <div className="m-5">
              <h3 className="heading text-xl mb-5">List of Added Prescriptions:</h3>
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
                      <Button className='p-2 bg-[#843cff] rounded-md w-[30%] text-white heading'
                        onClick={spin ? console.log("Loading...") : ()=>handleRemovePrescription(index, item.id)}>{spin ? "Loading..." : "Remove"}</Button>
                    </>
                    }
                    <div className="m-1 bg-[#843cff] w-[20%] h-1" />
                  </ul>
                </>
              ))}
            </div>
          ) : (
            <label className="text-lg block text-[#dc3545]">No data added</label>
          )}
        </div>
      </div>
    </>
  )
}

export default prescription