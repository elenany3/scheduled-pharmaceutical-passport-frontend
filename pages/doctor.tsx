import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Web3 from 'web3';
import { Delete_Request, Get_Request, Post_Request } from "../services/axios";
const doctor = () => {
    const contractAdress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
    const [doctors, setDoctors] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [address, setAddress] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [nationalNumber, setNationalNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [spin, setSpin] = useState(false);
    const [clinicAddress, setClinicAddress] = useState("");
    const [removedDoctor, setRemovedDoctor] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const contractABI = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "registrationNumber",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "nationalNumber",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "phone",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "clinicAddress",
                    "type": "string"
                }
            ],
            "name": "DoctorAdded",
            "type": "event"
        },
        {
            "anonymous": true,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                }
            ],
            "name": "DoctorRemoved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "drugName",
                    "type": "string"
                }
            ],
            "name": "ProhibitedDrugAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "drugName",
                    "type": "string"
                }
            ],
            "name": "ProhibitedDrugRemoved",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "name": "doctorAddress",
                    "type": "address"
                },
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "registrationNumber",
                    "type": "string"
                },
                {
                    "name": "nationalNumber",
                    "type": "string"
                },
                {
                    "name": "email",
                    "type": "string"
                },
                {
                    "name": "phone",
                    "type": "string"
                },
                {
                    "name": "clinicAddress",
                    "type": "string"
                }
            ],
            "name": "addDoctor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "doctor",
                    "type": "address"
                }
            ],
            "name": "removeDoctor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "drugName",
                    "type": "string"
                }
            ],
            "name": "addProhibitedDrug",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "drugName",
                    "type": "string"
                }
            ],
            "name": "removeProhibitedDrug",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "doctors",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "doctorInfo",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "registrationNumber",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "nationalNumber",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "email",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "phone",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "clinicAddress",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct LocalMinistryOfHealth.DoctorInfo",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "drugName",
                    "type": "string"
                }
            ],
            "name": "prohibitedDrugs",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractABI, contractAdress);
    const init = async () => {
        const doctors = await Get_Request(`doctor`);
        setDoctors(doctors.data ? doctors.data.data : []);
    };
    const handleRemoveDoctor = async () => {
        setErrorMessage("");
        setMessage("");
        setSpin(true);
        await contract.methods
            .removeDoctor(removedDoctor)
            .send({ from: web3.eth.accounts.givenProvider.selectedAddress })
            .then(async () => {
                await Delete_Request(`doctor/${removedDoctor}`);
                setSpin(false);
                init();
                setMessage("Doctor Contract removed.");
                alert('Doctor Contract removed!');
            }).catch(async (error) => {
                if (error.response)
                    setErrorMessage(error.response.data.message);
                else {
                    setErrorMessage(error.message);
                }
                setSpin(false);
            });
    };
    const handleAddDoctor = async () => {
        if (email && password && address && name && registrationNumber && nationalNumber && phone && clinicAddress) {
            setErrorMessage("")
            setMessage("")
            try {
                setSpin(true);
                await Post_Request('doctor', {
                    email,
                    password,
                    address,
                    name,
                    phone,
                    registration_number: registrationNumber,
                    national_number: nationalNumber,
                    clinic_address: clinicAddress
                }).then(async (res) => {
                    await contract.methods.addDoctor(address, name, registrationNumber, nationalNumber, email, phone, clinicAddress).send({ from: web3.eth.accounts.givenProvider.selectedAddress })
                        .then(async (result) => {
                            setSpin(false);
                            alert('New Doctor Contract added!');
                            init();
                            setMessage("New Doctor Contract added.")
                        }).catch(async (error) => {
                            await Delete_Request(`doctor/${address}`);
                            setSpin(false);
                            setErrorMessage("Transaction failed:", error.message);
                            console.log(error)
                        });
                }).catch(async (error) => {
                    console.log(error.response)
                    if (error.response)
                        setErrorMessage(error.response.data.message);
                    else {
                        await Delete_Request(`doctor/${address}`);
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
    useEffect(() => {
        init();
    }, []);
    return (
        <>
            <div className='w-full min-h-screen flex justify-center items-center'>
                <div className='p-4 rounded-lg w-5/6 md:w-3/5 mint__card '>
                    <h1 className='heading text-xl font-bold mb-5'>Doctors</h1>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Address:</label>
                        <input type="text" placeholder='Address' value={address} onChange={(e) => setAddress(e.target.value)} className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Name
                        </label>
                        <input type="text" placeholder='Name' value={name} onChange={(event) => setName(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Registration Number:</label>
                        <input type="text" placeholder='Registration Number' value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">National Number:</label>
                        <input type="text" placeholder='National Number' value={nationalNumber} onChange={(event) => setNationalNumber(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Email:</label>
                        <input type="text" placeholder='Email' value={email} onChange={(event) => setEmail(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Password</label>
                        <input type="password" placeholder='Password' value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Phone: </label>
                        <input type="text" placeholder='Phone' value={phone}
                            onChange={(event) => setPhone(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                    </div>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Clinic Address:</label>
                        <input type="text" placeholder='Clinic Address' value={clinicAddress}
                            onChange={(event) => setClinicAddress(event.target.value)}
                            className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                        <Button
                            className="p-2 bg-[#843cff] rounded-md w-[20%] text-white heading"
                            onClick={spin ? console.log("Loading...") : handleAddDoctor}
                            style={{ marginRight: '50px' }} >{spin ? "Loading..." : "Add Doctor"}</Button>
                    </div>
                    <label className="text-lg block text-[#dc3545]">{errorMessage}</label>
                    <label className="text-lg block text-[#62a7aa]">{message}</label>
                    <div className="m-10 bg-[#843cff] h-1" />
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Remove Doctor Contract:</label>
                        <input type="text" placeholder='Address' value={removedDoctor} onChange={(e) => setRemovedDoctor(e.target.value)} className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                        <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
                            onClick={spin ? console.log("Loading...") : handleRemoveDoctor}>{spin ? "Loading..." : "Remove"}</Button>
                    </div>
                    <div className="m-10 bg-[#843cff] h-1" />
                    {doctors.length ? (
                        <div className="m-5">
                            <h3 className="heading text-xl mb-5">List of Added Doctors:</h3>
                            {doctors.map((item, index) => (
                                <ul key={index} className="text-lg block w-[70%] mb-3">
                                    <li className="mb-2">Name: {item.name}</li>
                                    <li className="mb-2">Email: {item.doctor.email}</li>
                                    <li className="mb-2">Address: {item.doctor.address}</li>
                                    <div className="m-1 bg-[#843cff] w-[20%] h-1" />
                                </ul>
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

export default doctor;