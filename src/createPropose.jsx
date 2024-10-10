import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
 
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

  // const { isLoading: isConfirming, isSuccess: isConfirmed } = 
  //   useWaitForTransactionReceipt({ 
  //     hash, 
  //   }) 

  const results =   useWaitForTransactionReceipt({      hash,    }) 
  const isConfirming = results?.isLoading;
  const isConfirmed = results?.isSuccess;


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
