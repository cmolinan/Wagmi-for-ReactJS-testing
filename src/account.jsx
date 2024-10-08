import { useAccount, useDisconnect, useEnsName, useEnsAvatar } from 'wagmi';

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  const account = useAccount();
  return (
    <div>
         status: {account.status}
          <br />
          chainId: {account.chainId}
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && 
        <div>
          {ensName ? `${ensName} (${address})` : address}
        </div>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}

