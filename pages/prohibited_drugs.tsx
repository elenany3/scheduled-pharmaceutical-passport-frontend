import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Web3 from 'web3';
import { Delete_Request, Get_Request, Post_Request } from "../services/axios";
const drug = () => {
    const contractAdress = "0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95";
    const [name, setName] = useState("");
    const [removedProhibitedDrug, setRemovedProhibitedDrug] = useState("");
    const [prohibitedDrugs, setProhibitedDrugs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [message, setMessage] = useState('');
    const [spin, setSpin] = useState(false);
    const contractABI = [
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
        }
    ];
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractABI, contractAdress);
    const init = async () => {
        const drugs = await Get_Request(`drug`);
        setProhibitedDrugs(drugs.data ? drugs.data.data : []);
    };
    const handleRemoveProhibitedDrug = async () => {
        if (removedProhibitedDrug) {
            setErrorMessage("");
            setMessage("");
            setSpin(true);
            await contract.methods
                .removeProhibitedDrug(removedProhibitedDrug)
                .send({ from: web3.eth.accounts.givenProvider.selectedAddress })
                .then(async () => {
                    await Delete_Request(`drug/${removedProhibitedDrug}`);
                    setSpin(false);
                    setMessage("Drug removed.");
                    alert('Drug removed!');
                    init();
                }).catch(async (error) => {
                    if (error.response)
                        setErrorMessage(error.response.data.message);
                    else {
                        setErrorMessage(error.message);
                    }
                    setSpin(false);
                });
        } else {
            alert('Please fill in all the required fields.');
        }
    };
    const handleAddProhibitedDrug = async () => {
        if (name) {
            setErrorMessage("")
            setMessage("")
            try {
                setSpin(true);
                await Post_Request('drug', { name }).then(async (res) => {
                    await contract.methods.addProhibitedDrug(name).send({ from: web3.eth.accounts.givenProvider.selectedAddress }).then(async () => {
                        setSpin(false);
                        alert('New Drug added!');
                        setMessage("New Drug added.");
                        init();
                    }).catch(async (error) => {
                        await Delete_Request(`drug/${name}`);
                        setSpin(false);
                        setErrorMessage("Transaction failed:", error.message);
                    });
                }).catch(async (error) => {
                    console.log(error.response);
                    if (error.response)
                        setErrorMessage(error.response.data.message);
                    else {
                        await Delete_Request(`drug/${name}`);
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
                    <h1 className='heading text-xl font-bold mb-5'>Prohibited Drugs</h1>
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Prohibited Drug Name</label>
                        <input type="text" value={name} placeholder='Prohibited Drug Name' onChange={(e) => setName(e.target.value)} className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                        <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
                            onClick={spin ? console.log("Loading...") : handleAddProhibitedDrug}>{spin ? "Loading..." : "Add"}</Button>
                    </div>
                    <div className="m-10 bg-[#843cff] h-1" />
                    <div className="flex justify-centre items-centre gap-x-2 m-5">
                        <label className="text-lg block w-[30%]">Remove Prohibited Drug </label>
                        <input type="text" value={removedProhibitedDrug} placeholder='Prohibited Drug Name' onChange={(e) => setRemovedProhibitedDrug(e.target.value)} className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
                        <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
                            onClick={spin ? console.log("Loading...") : handleRemoveProhibitedDrug}>{spin ? "Loading..." : "Remove"}</Button>
                    </div>
                    <label className="text-lg block text-[#dc3545]">{errorMessage}</label>
                    <label className="text-lg block text-[#62a7aa]">{message}</label>
                    <div className="m-10 bg-[#843cff] h-1" />
                    {prohibitedDrugs.length ? (
                        <div className="m-5">
                            <h3 className="heading text-xl mb-5">List of Added Prohibited Drugs:</h3>
                            {prohibitedDrugs.map((item, index) => (
                                <ul key={index} className="text-lg block w-[70%] mb-3">
                                    <li className="mb-2">Name: {item.name}</li>
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

export default drug;