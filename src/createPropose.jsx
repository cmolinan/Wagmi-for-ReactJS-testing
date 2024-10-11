import { useEffect, useState } from 'react';
import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
import { ethers } from "ethers";
import daoGovernorAbi from './blockchainABIs/dao.json'
import nftTokenAbi from "./blockchainABIs/nft.json";

import { decodeEventData } from '../utilsBlockchain.js';

export function CreatePropose() {
  
  //State for store all the events data
  const [eventSurveyData, setEventSurveyData] = useState({});
  const [eventProposalData, setEventProposalData] = useState({});
  
  const nftContractAddress = "0x74D5CaF28b0d0AE0dEb592c7A9560949A6ddB4c9";
  const daoContractAddress = "0x2EcE8deae5aF2b275632D8619499407d02955cE3";

  const daoAbi = daoGovernorAbi.abi;
  const nftAbi = nftTokenAbi.abi;
  
  const { 
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract() 

  async function submit(e) { 
    e.preventDefault() 
    const formData = new FormData(e.target) 
    const description = formData.get('description')
    const options = formData.get('options')

    writeContract({
      address: daoContractAddress,
      abi: daoAbi,
      functionName: 'proposeForSurvey',
      args: [description, ["Caso 1", "Caso 2", "Caso 3"]],
    })
  }

  const results =   useWaitForTransactionReceipt({ hash })

  const isConfirming = results?.isLoading;
  const isConfirmed = results?.isSuccess;
  
  useEffect(() => {
    if (isConfirmed) {
      const eventProposal = decodeEventData(results,"ProposalCreated", daoAbi);
      if (eventProposal) {
        setEventProposalData(eventProposal);
      }

      const eventSurvey = decodeEventData(results,"SurveyProposalCreated", daoAbi);
      if (eventSurvey) {
        setEventSurveyData(eventSurvey);
      }
    }
  }, [isConfirmed]);

  return (
    <form onSubmit={submit}>
      <input name="description" placeholder="description" required />
      
      {/* <input name="options" placeholder="options" required /> */}
      <button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Propose'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed &&
        <>
          <div>Transaction confirmed. Propose ID:</div>
          {eventProposalData?.proposalId?.toString()}
          <div>Proposal options: </div>
          {JSON.stringify(eventSurveyData?.surveyOptions)}
        </>
      }

      {error && ( 
        <div>Error: {error.shortMessage || error.message}</div> 
      )} 
    </form>
  )
}
