import { 
  useSendTransaction, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseEther } from 'viem';

export function SendTransaction() {
  const { 
    data:hash,
    error,
    isPending, 
    sendTransaction 
  } = useSendTransaction();

  const { 
    isLoading,
    isSuccess,
  } = useWaitForTransactionReceipt({ 
    hash,
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const to = formData.get('address');
    const value = formData.get('value');

    sendTransaction({ 
      to, 
      value: parseEther(value) 
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="address" placeholder="0xA0Cf…251e" required />
        <input name="value" placeholder="0.05" required />
        <button 
          disabled={isPending || isLoading} 
          type="submit"
        >
          {isPending ? 'Enviando...' : isLoading ? 'Confirmando...' : 'Enviar'}
        </button>
      </form>
      
      {hash && 
        <div>
          Hash de la transacción: {hash}
        </div>}
      {isLoading &&      
        <div>
          Esperando confirmación...
        </div>}
      {isSuccess && 
        <div>
          Transacción confirmada.
        </div>}
      {error && (
        <div>
          Error: {error.shortMessage || error.message}
        </div>
      )}      
    </div>
  );
}