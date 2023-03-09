import React, { useState } from 'react';
import './App.css';
import { ethers } from "ethers";

let provider;
let addresses;

function App() {
  const [addressWallet, setAddressWallet] = useState("");
  const [addressFrom, setAddressFrom] = useState("");
  const [events, setEvents] = useState("");

  async function startDapp() {
    if (window.ethereum) {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
        addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddressWallet("Address: " + addresses[0]);
        console.log("from: " + addresses[0]);
      } catch (error) {
        if (error.code === 4001) {
          console.log("User rejected the request");
        } else {
          console.log(error.code);
        }
      }
    } else {
      console.log('Metamask not set up');
    }
  }

  async function callContract() {
    let abi = [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "TokensSent",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "sendToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "tokenBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];

    let contract = new ethers.Contract(addressFrom, abi, provider.getSigner(addresses[0]));
    // Any transactions that happen from specific address from now on
    //
    contract.on("TokensSent", (from, to, amount) => {
      setEvents(from + " " + to + " " + amount);
    });
    // Filtering for any transactions in the past to specific address
    //
    // const filter = contract.filters.TokensSent(null, "0x28EDd2d80c46d5B6b27B41035583375FF9d4e116", null);
    // await contract.on(filter, (from, to, amount) => {
    //   setEvents(from + " " + to + " " + amount);
    // });
  }

  return (
    <div>
      <h1>Metamask/Ethereum event listener</h1>
      <div class="first-div">
        <button id="initialize-metamask" onClick={startDapp}>Initialize Metamask</button>
        <h3><span>{addressWallet}</span></h3>
        <input id="address-input" onChange={(event => setAddressFrom(event.target.value))} type="text" placeholder="Contract address" />
        <button id="listen-button" onClick={() => callContract(addressFrom)}>Listen to events</button>
        <h3><span>{events}</span></h3>
      </div>
      <div>
        <p id="event"></p>
      </div>
    </div>
  );
}

export default App;