import { useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet(address: any) {
  const {
    connect,
    connectors,
    error,
    isLoading,
    pendingConnector,
  } = useConnect();

  const { disconnect } = useDisconnect();

  if (address.address) {
    return (
      <button
        className="max-w-[350px] mx-auto mb-6 w-full flex items-center justify-center bg-black text-white px-6 py-2 transition-all duration-350 hover:opacity-60 group"
        onClick={() => disconnect()}
      >
        <span className="group-hover:hidden">
          Connected as {address.address.slice(0, 4)}...
          {address.address.slice(
            address.address.length - 4,
            address.address.length
          )}
        </span>
        <span className="hidden group-hover:block">Disconnect</span>
      </button>
    );
  }

  return (
    <>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="flex items-center mx-auto bg-black text-white px-6 py-2 transition-all duration-350 hover:opacity-60"
        >
          <img src="/metamask.png" width="32" className="mr-2" />
          Connect wallet
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {error && (
        <div className="bg-red-200 text-red-700 border border-red-700 text-sm mt-2 py-2 px-4">
          {error.message}
        </div>
      )}
    </>
  );
}
