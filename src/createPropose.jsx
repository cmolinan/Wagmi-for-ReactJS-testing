import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
import { ethers } from "ethers";

import daoGovernorAbi from './blockchainABIs/dao.json'
import nftTokenAbi from "./blockchainABIs/nft.json";

export function CreatePropose() {
  const nftContractAddress = "0x74D5CaF28b0d0AE0dEb592c7A9560949A6ddB4c9";
  const daoContractAddress = "0x2262179561Ed1175E49B5738232CDdbfC1e8f493";

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

  //Obtain the signature (a hash) of a event
  const getEventSignature = (eventName) => {
    const eventAbi = daoAbi.find(item => item?.name === eventName && item?.type === 'event');
    const paramTypes = eventAbi?.inputs?.map(input => input?.type);
    const eventWithTypes= eventName + "("+ paramTypes.join(',') +  ")"
    return ethers.id(eventWithTypes);
  }

  const results =   useWaitForTransactionReceipt({ hash }) 
  const isConfirming = results?.isLoading;
  const isConfirmed = results?.isSuccess;

  if (isConfirmed) {
    //Trying to get the event information
    const event = results.data.logs.find(log => log.topics[0] === getEventSignature("ProposalCreated"));

    if (event) {
      const contract= new ethers.Interface(daoAbi);

      const decodedEventFieldNames= contract.getEvent('ProposalCreated').inputs;
      const decodedEventValues = contract.decodeEventLog('ProposalCreated', event.data, event.topics);
      
      const jsonObject = {};

      //Fill field name and values
      decodedEventFieldNames.forEach((field, index) => {
        jsonObject[field.name] = decodedEventValues[field.name];
      });

      // Maybe store jsonObject
      // setJsonObject----

      
    }
  }

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
        <div>Transaction confirmed. Propose ID:</div>        
      } 
      {isConfirmed && BigInt(results?.data?.logs[1]?.topics[1],16).toString()}
      {error && ( 
        <div>Error: {error.shortMessage || error.message}</div> 
      )} 
    </form>
  )
}
