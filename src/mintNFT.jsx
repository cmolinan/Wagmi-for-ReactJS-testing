import { 
  useWaitForTransactionReceipt, 
  useWriteContract 
} from 'wagmi'
 
import daoGovernorAbi from './blockchainABIs/dao.json'
import nftTokenAbi from "./blockchainABIs/nft.json";

export function MintNFT() {
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
    const uri = formData.get('uri')
    writeContract({
      address: nftContractAddress,
      abi: nftAbi,
      functionName: 'safeMint',
      args: ["0x7A30a1401a37FBAFbb7db0207a1658511096B861", uri],
    })
  } 

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  return (
    <form onSubmit={submit}>
      <input name="uri" placeholder="URI" required />
      <button 
        disabled={isPending} 
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'} 
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>} 
      {isConfirmed && <div>Transaction confirmed.</div>} 
      {error && ( 
        <div>Error: {error.shortMessage || error.message}</div> 
      )} 
    </form>
  )
}
