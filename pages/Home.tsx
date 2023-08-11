import Web3 from 'web3';
import { useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import { Delete_Request, Get_Request, Post_Request } from '../services/axios';
const Home = () => {
  const contractAdress = "0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95";
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [spin, setSpin] = useState(false);
  const [allMLH, setAllMLH] = useState([]);
  const [removeLocalMOHContractAddress, setRemoveLocalMOHContractAddress] = useState('');
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newContractAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "countryName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "countryCode",
          "type": "string"
        }
      ],
      "name": "addLocalMinistryOfHealth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "contractAddress",
          "type": "address"
        }
      ],
      "name": "removeLocalMinistryOfHealth",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "localMinistryOfHealthContracts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "contractAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "countryName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "countryCode",
              "type": "string"
            }
          ],
          "internalType": "struct GlobalMinistryOfHealth.LocalMinistryOfHealth[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  const web3 = new Web3(Web3.givenProvider);
  const contract = new web3.eth.Contract(contractABI, contractAdress);
  const init = async () => {
    const accounts = await Get_Request(`lmh`);
    setAllMLH(accounts.data ? accounts.data.data : []);
  };
  const handleAddLocalMOHContract = async () => {
    setErrorMessage("")
    setMessage("")
    if (email && password && address && countryName && countryCode) {
      try {
        setSpin(true);
        await Post_Request('lmh', {
          email,
          password,
          address,
          country_name: countryName,
          country_code: countryCode
        }).then(async (res) => {
          await contract.methods
            .addLocalMinistryOfHealth(address, countryName, countryCode)
            .send({ from: web3.eth.accounts.givenProvider.selectedAddress })
            .then(async (result) => {
              setSpin(false);
              init();
              alert('New Local MOH Contract added!');
              setMessage("New Local MOH Contract added.")
            }).catch(async (error) => {
              await Delete_Request(`lmh/${address}`);
              setSpin(false);
              setErrorMessage("Transaction failed:", error.message);
            });
        }).catch(async (error) => {
          if (error.response)
            setErrorMessage(error.response.data.message);
          else {
            await Delete_Request(`lmh/${address}`);
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
  const handleRemoveLocalMOHContract = async () => {
    setErrorMessage("");
    setMessage("");
    setSpin(true);
    await contract.methods
      .removeLocalMinistryOfHealth(removeLocalMOHContractAddress)
      .send({ from: web3.eth.accounts.givenProvider.selectedAddress })
      .then(async () => {
        await Delete_Request(`lmh/${removeLocalMOHContractAddress}`);
        setSpin(false);
        setMessage("Local MOH Contract removed.");
        alert('Local MOH Contract removed!');
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
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div className='w-full min-h-screen flex justify-center items-center'>
        <div className='p-4 rounded-lg w-5/6 md:w-3/5 mint__card '>
          <h1 className='heading text-xl font-bold mb-5'>Local Ministry of Health Contract</h1>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Email</label>
            <input type="text" placeholder='Email' value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Password</label>
            <input type="password" placeholder='Password' value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Country Name</label>
            <input type="text" placeholder='Country Name' value={countryName}
              onChange={(event) => setCountryName(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Country Code
            </label>
            <input type="text" placeholder='Country Code' value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" />
          </div>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Address:</label>
            <input type="text" placeholder='Address' id="address" className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" value={address} onChange={(e) => setAddress(e.target.value)} />
            <Button
              className="p-2 bg-[#843cff] rounded-md w-[20%] text-white heading"
              onClick={spin ? console.log("Loading...") : handleAddLocalMOHContract}
              style={{ marginRight: '50px' }}>{spin ? "Loading..." : "Add"}</Button>
          </div>
          <div className="m-10 bg-[#843cff] h-1"/>
          <div className="flex justify-centre items-centre gap-x-2 m-5">
            <label className="text-lg block w-[30%]">Remove Local MOH Contract:</label>
            <input type="text" placeholder='Local MOH Address' id="removeLocalMOHContract" className="border text-sm rounded-md block w-[40%] h-full p-2.5 focus:outline-none focus:border-[#843cff] focus:ring-1 focus:ring-[#843cff]" value={removeLocalMOHContractAddress} onChange={(e) => setRemoveLocalMOHContractAddress(e.target.value)} />
            <Button className='p-2 bg-[#843cff] rounded-md w-[20%] text-white heading'
              onClick={spin ? console.log("Loading...") : handleRemoveLocalMOHContract}
            >{spin ? "Loading..." : "Remove"}</Button>
          </div>
          <label className="text-lg block text-[#dc3545]">{errorMessage}</label>
          <label className="text-lg block text-[#62a7aa]">{message}</label>
          <div className="m-10 bg-[#843cff] h-1"></div>
          {allMLH.length ? (
            <div className="mint__options m-5">
              <h3 className="heading text-xl mb-5">List of Added Local Ministry of Health:</h3>
              {allMLH.map((item, index) => (
                <ul key={index} className="text-lg block w-[70%] mb-3">
                  <li className="mb-2">Email: {item.user.email}</li>
                  <li className="mb-2">Address: {item.user.address}</li>
                  <li className="mb-2">Country Name: {item.country_name}</li>
                  <li className="mb-2">Country Code: {item.country_code}</li>
                  <div className="m-1 bg-[#843cff] w-[20%] h-1"/>
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

export default Home
