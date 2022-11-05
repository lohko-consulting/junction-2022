import { useAccount, useSigner } from "wagmi";
import { contractAddress, abi } from "../lib/contract";
import { ethers } from "ethers";

export default function NotOwned() {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const mint = async () => {
    if (signer) {
      // @ts-ignore
      const c = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = await c.mintBadge();
        const receipt = await tx.wait();
        console.log(receipt);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="border-2 border-binanceYellow bg-white/5 text-left p-4 md:p-8 max-w-screen-md mx-auto rounded-lg">
      <h2 className="font-bold text-2xl mb-2">
        No SBT found for address {address?.slice(0, 4)}...
        {address?.slice(address.length - 4, address.length)}
      </h2>
      <p className="text-sm mb-4">
        To get started on verifying your information on-chain, you first need to
        claim a soulbound non-fungible token (SBT). This token cannot be
        transferred away from your wallet and will be used to store your data
        securely and privately.
      </p>
      <button
        onClick={mint}
        className="bg-binanceYellow text-binanceBg font-bold text-white rounded px-12 py-2 transition-all duration-350 hover:opacity-60"
      >
        Claim your SBT now
      </button>
    </div>
  );
}
