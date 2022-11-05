import ConnectWallet from "../components/ConnectWallet";
import { useAccount, useSigner } from "wagmi";
import { contractAddress, abi } from "../lib/afterpartyContract";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function Afterparty() {
  const { asPath } = useRouter()
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [mounted, setMounted] = useState(false);
  const [userTicket, setUserTicket] = useState<any>();
  const [error, setError] = useState(false);
  const [txPassed, setTxPassed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setError(false);
    setTxPassed(false);
    checkTicketBalance();
  }, [signer, address]);

  useEffect(() => {
    if (txPassed && address && signer) {
      checkTicketBalance();
    }
  }, [txPassed]);

  const checkTicketBalance = async () => {
    if (signer && address) {
      const c = new ethers.Contract(contractAddress, abi, signer);

      const userTicket = await c.getTicketId(address);

      if (userTicket) {
        setUserTicket(parseInt(userTicket));
      }
    }
  };

  const mint = async () => {
    setError(false);
    if (signer) {
      const c = new ethers.Contract(contractAddress, abi, signer);

      try {
        const tx = await c.mintTicket();
        const receipt = await tx.wait();
        console.log(receipt);
        setTxPassed(true);
      } catch (err) {
        setError(true);
        console.log(err);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-junctionBg">
        <div className="text-center">
          <h1 className="font-bold text-white text-xl sm:text-8xl text-center mb-6">
            JUNCTION 2022
          </h1>
          <h1 className="font-bold text-junctionOrange text-6xl text-center mb-12">
            AFTERPARTY
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-44 pb-44 bg-junctionBg px-4 relative">
      <div className="flex items-center text-xl py-4 text-white justify-center gap-8 absolute top-0 left-0 right-0">
        <Link href="/"><a className="text-white transition-all duration-350 hover:opacity-60">Portal</a></Link>
        <Link href="/afterparty"><a className="text-junctionOrange underline">Afterparty</a></Link>
        </div>
      <div className="text-center">
        <h1 className="font-bold text-white text-4xl sm:text-8xl text-center mb-6">
          JUNCTION 2022
        </h1>
        <h1 className="font-bold text-junctionOrange text-4xl sm:text-6xl text-center mb-12">
          AFTERPARTY
        </h1>
        {!userTicket && (
          <div>
            <p className="text-white font-bold text-2xl mb-6">
              You&apos;re not in yet!
            </p>
          </div>
        )}
        {!address && <ConnectWallet />}
        {address && !userTicket && (
          <div>
            <button
              onClick={mint}
              className="bg-junctionOrange text-junctionBg px-12 py-3 font-bold tracking-wider sm:text-xl transition-all duration-350 hover:opacity-60"
            >
              CLAIM AFTERPARTY PASS
            </button>
            <p className="text-sm sm:text-base text-white max-w-[500px] mx-auto mt-12">
              Before claiming your pass, please verify your age using the{" "}
              <Link href="/">
                <a className="text-junctionOrange hover:underline">
                  POPD portal &rarr;
                </a>
              </Link>
            </p>
          </div>
        )}
        {error && (
          <div className="mt-6 bg-red-200 text-red-700 border-2 border-red-700 py-2 px-6 max-w-[600px] mx-auto">
            Please verify your age before claiming your ticket
          </div>
        )}
        {address && userTicket > 0 && (
          <div className="border-2 border-junctionOrange p-6 max-w-[400px] mx-auto rounded-lg">
            <img
              src="/junction-logo.png"
              className="h-44 animate-spin-slow mx-auto"
            />
            <img src="/qrcode.png" className="h-44 mx-auto mb-6" />
            <h2 className="text-white text-4xl font-bold">You're in!</h2>
            <p className="px-6 text-white mt-6 mb-6">
              Show this ticket at the door to enter the afterparty
            </p>
            <div className="h-px bg-white/20 my-4" />
            <p className="text-white font-bold tracking-wide text-2xl">
              Ticket id #{userTicket}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
