import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";
import { contractAddress, abi } from "../lib/contract";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import NotOwned from "./NotOwned";
import Owned from "./Owned";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";

export default function Main() {
  const [verifiedAddress, setVerifiedAddress] = useState<any>();
  const [hasSbt, setHasSbt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { signMessage } = useSignMessage({
    onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      setVerifiedAddress(address);
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVerifiedAddress(null);
    setHasSbt(false);
  }, [address]);

  /*useEffect(() => {
    if (!verifiedAddress && signer) {
      signMessage({ message: "Verify wallet ownership" });
    }
  }, [address, signer]);*/

  useEffect(() => {
    if (verifiedAddress) {
      getSbt();
    }
  }, [verifiedAddress]);

  const getSbt = async () => {
    if (signer) {
      const c = new ethers.Contract(contractAddress, abi, signer);
      const balance = await c.balanceOf(address);
      if (balance && balance > 0) {
        setHasSbt(true);
      }
    }
  };

  if (!mounted) return <h1>Loading...</h1>;

  return (
    <div className="relative flex py-24 items-center justify-center min-h-screen flex items-center justify-center bg-binanceBg text-white px-4">
      
      <div className="flex items-center text-xl py-4 text-white justify-center gap-8 absolute top-0 left-0 right-0">
        <Link href="/"><a className="text-binanceYellow underline">Portal</a></Link>
        <Link href="/afterparty"><a className="text-white transition-all duration-350 hover:opacity-60">Afterparty</a></Link>
        </div>
      <div className="text-center">
        <div className="max-w-[213px] w-full mx-auto">
          <svg
            viewBox="0 0 137 24"
            focusable="false"
            className="chakra-icon css-bm97u3"
          >
            <path
              d="M4.00392 3.6761L10.3727 0L16.7415 3.6761L14.4 5.03415L10.3727 2.7161L6.34539 5.03415L4.00392 3.6761ZM16.7415 8.31219L14.4 6.95415L10.3727 9.2722L6.34539 6.95415L4.00392 8.31219V11.0283L8.03123 13.3463V17.9824L10.3727 19.3405L12.7142 17.9824V13.3463L16.7415 11.0283V8.31219ZM16.7415 15.6644V12.9483L14.4 14.3063V17.0224L16.7415 15.6644ZM18.4039 16.6244L14.3766 18.9424V21.6585L20.7454 17.9824V10.6302L18.4039 11.9883V16.6244ZM16.0625 5.99415L18.4039 7.35219V10.0683L20.7454 8.71024V5.99415L18.4039 4.6361L16.0625 5.99415ZM8.03123 19.9259V22.642L10.3727 24L12.7142 22.642V19.9259L10.3727 21.2839L8.03123 19.9259ZM4.00392 15.6644L6.34539 17.0224V14.3063L4.00392 12.9483V15.6644ZM8.03123 5.99415L10.3727 7.35219L12.7142 5.99415L10.3727 4.6361L8.03123 5.99415ZM2.34146 7.35219L4.68293 5.99415L2.34146 4.6361L0 5.99415V8.71024L2.34146 10.0683V7.35219ZM2.34146 11.9883L0 10.6302V17.9824L6.36877 21.6585V18.9424L2.34146 16.6244V11.9883Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M39.205 15.0616V15.0234C39.205 13.2298 38.2509 12.333 36.7054 11.7415C37.6594 11.2073 38.4608 10.3677 38.4608 8.86029V8.82213C38.4608 6.72322 36.7817 5.36847 34.0531 5.36847H27.8518V18.7252H34.2058C37.2206 18.7252 39.205 17.504 39.205 15.0616ZM35.5414 9.3564C35.5414 10.3486 34.721 10.7684 33.4235 10.7684H30.714V7.9444H33.6143C34.8545 7.9444 35.5414 8.44051 35.5414 9.31823V9.3564ZM36.2856 14.6991C36.2856 15.6913 35.5033 16.1492 34.2058 16.1492H30.714V13.2108H34.1104C35.6178 13.2108 36.2856 13.7641 36.2856 14.6609V14.6991Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M53.6814 18.7252V5.36847H50.781V13.5924L44.5225 5.36847H41.813V18.7252H44.7133V10.2341L51.1817 18.7252H53.6814Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M68.4317 15.0616V15.0234C68.4317 13.2298 67.4776 12.333 65.9321 11.7415C66.8861 11.2073 67.6875 10.3677 67.6875 8.86029V8.82213C67.6875 6.72322 66.0084 5.36847 63.2798 5.36847H57.0785V18.7252H63.4325C66.4473 18.7252 68.4317 17.504 68.4317 15.0616ZM64.7682 9.3564C64.7682 10.3486 63.9477 10.7684 62.6502 10.7684H59.9407V7.9444H62.841C64.0812 7.9444 64.7682 8.44051 64.7682 9.31823V9.3564ZM65.5123 14.6991C65.5123 15.6913 64.73 16.1492 63.4325 16.1492H59.9407V13.2108H63.3371C64.8445 13.2108 65.5123 13.7641 65.5123 14.6609V14.6991Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M86.1413 16.3656L84.6339 14.8392C83.489 15.9077 82.4396 16.5755 80.7986 16.5755C78.2417 16.5755 76.3909 14.4385 76.3909 11.8053C76.3909 9.17211 78.2417 7.0732 80.7986 7.0732C82.3251 7.0732 83.4699 7.74104 84.5385 8.73325L86.0459 6.99688C84.7674 5.7757 83.2791 4.91705 80.8177 4.91705C76.7725 4.91705 73.9294 8.02725 73.9294 11.8435C73.9294 15.6978 76.8298 18.7317 80.7223 18.7317C83.2219 18.7317 84.7484 17.8158 86.1413 16.3656Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M97.5189 12.8738V18.5027H99.8659V5.14602H97.5189V10.6986H91.1459V5.14602H88.7989V18.5027H91.1459V12.8738H97.5189Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M110.394 5.05062H108.219L102.342 18.5027H104.746L106.12 15.278H112.436L113.791 18.5027H116.271L110.394 5.05062ZM111.577 13.1982H106.979L109.268 7.85553L111.577 13.1982Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M118.886 5.14602V18.5027H121.233V5.14602H118.886Z"
              fill="#F0B90B"
            ></path>
            <path
              d="M134.33 14.3812L127.174 5.14602H124.999V18.5027H127.308V9.00038L134.673 18.5027H136.639V5.14602H134.33V14.3812Z"
              fill="#F0B90B"
            ></path>
          </svg>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold my-2">POPD</h1>
        <h1 className="mb-12 mt-4">
          Proof Of Personal Data leveraging zk-SNARKs and Binance Smart Chain
        </h1>
        {!address && <ConnectWallet address={address} />}
        {address && (
          <div>
            {!hasSbt && verifiedAddress && <NotOwned />}
            {hasSbt && verifiedAddress && <Owned />}
            {!verifiedAddress && (
              <button
                onClick={() =>
                  signMessage({ message: "Verify ownership of wallet" })
                }
                className="px-12 py-2 bg-binanceYellow font-bold text-2xl text-junctionBg transition-all duration-350 hover:opacity-60"
              >
                Sign now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
