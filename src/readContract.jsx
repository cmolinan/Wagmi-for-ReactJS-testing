import { useEffect, useState } from 'react';
import { useReadContract, useReadContracts } from 'wagmi'

import daoGovernorAbi from './blockchainABIs/dao.json'
import nftTokenAbi from "./blockchainABIs/nft.json";

export function ReadContract() {
  const nftContractAddress = "0x74D5CaF28b0d0AE0dEb592c7A9560949A6ddB4c9";
  const daoContractAddress = "0x2EcE8deae5aF2b275632D8619499407d02955cE3";

  const daoAbi = daoGovernorAbi.abi;
  const nftAbi = nftTokenAbi.abi;
  

  const wagmiReadNftContract = {
    abi:nftAbi,
    address: nftContractAddress,
  }

  const wagmiReadDaoContract = {
    abi:daoAbi,
    address: daoContractAddress,
  }

  const {data, error, isPending } =  useReadContracts({
    contracts: [{ 
      ...wagmiReadNftContract,
      functionName: 'balanceOf',
      args: ['0x7A30a1401a37FBAFbb7db0207a1658511096B861'],
    }, 
    { 
      ...wagmiReadNftContract, 
      functionName: 'totalSupply', 
    },
    { 
      ...wagmiReadNftContract, 
      functionName: 'ownerOf', 
      args: [100n],
    },
    { 
      ...wagmiReadDaoContract, 
      functionName: 'token'      
    },
    { 
      ...wagmiReadDaoContract, 
      functionName: 'state',
      args: ["47449186224037701840669334900901816560572106203327853820817155183275332366978"],
    },
    { 
      ...wagmiReadDaoContract, 
      functionName: 'surveyProposalVotes',
      args: ["47449186224037701840669334900901816560572106203327853820817155183275332366978"],
    },
    { 
      ...wagmiReadDaoContract, 
      functionName: 'SurveyProposalsList',
      args: [0, 10],
    },

  ] 
    })

  const [balance, totalSupply, ownerOf, token, state, votes, proposals] = data || [] 

  if (isPending) return <div>Loading...</div>

  if (error)
    return (
      <div>
        Error: {error.shortMessage || error.message}
      </div>
    )
    
    return (
    <>
      <div>Balance: {balance?.result?.toString()}</div>
      { ownerOf.error ?
        <div>Owner of Token 100 Error?: {ownerOf.error?.metaMessages[0] || ownerOf.error?.message || ownerOf?.error?.shortMessage}</div>
       :  
        <div>Owner of Token 100: {ownerOf?.result}</div>
      }
      <div>Total Supply: {totalSupply?.result?.toString()}</div> 
      <div>Dao Contract Address: {token?.result}</div> 
      <div>State Dao: {state?.result}</div> 
      <div>Votes: {JSON.stringify(votes.result, (key, value) => 
        value.toString() )}</div> 
      {proposals && 
        <div>        
        {JSON.stringify(proposals.result.map(prop => prop.description))}
        </div>
      }
    </>    
  )
}
