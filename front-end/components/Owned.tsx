import { useAccount, useSigner } from "wagmi";
import { contractAddress, abi } from "../lib/contract";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { verifyAge } from "../lib/helpers";

type UserData = {
  success: boolean;
  firstName?: string;
  lastName?: string;
  age?: number;
  country?: string;
};

export default function Owned() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [userData, setUserData] = useState<null | UserData>();
  const [over18Verified, setOver18Verified] = useState(false);
  const [under18Verified, setUnder18Verified] = useState(false);

  useEffect(() => {
    checkAgeUnder18();
  }, [signer]);

  const checkAgeUnder18 = async () => {
    if (signer) {
      const c = new ethers.Contract(contractAddress, abi, signer);

      const verified = await c.getAgeProofByLimit(address, "Over18");

      if (verified[0].length > 5) {
        setOver18Verified(true);
      }

      console.log(verified);
    }
  };

  const getUserData = async (id: string) => {
    const user = await fetch("/api/getUserData?uid=" + id).then((response) =>
      response.json()
    );
    setUserData(user);
  };

  useEffect(() => {
    if (address) {
      getUserData(address);
    }
  }, []);

  return (
    <div className="border-2 bg-white/5 border-binanceYellow text-left p-4 md:p-8 max-w-screen-md mx-auto rounded-lg">
      <h2 className="font-bold text-lg mb-2">
        SBT & user data found for address {address?.slice(0, 4)}...
        {address?.slice(address.length - 4, address.length)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 my-4 gap-4">
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-sm text-binanceYellow">First name</h2>
          <p className="text-xl">{userData?.firstName}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-sm text-binanceYellow">Last name</h2>
          <p className="text-xl">{userData?.lastName}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-sm text-binanceYellow">Age</h2>
          <p className="text-xl">{userData?.age}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h2 className="text-sm text-binanceYellow">Country</h2>
          <p className="text-xl">{userData?.country}</p>
        </div>
      </div>
      <p className="text-lg mb-4">
        You are now able to generate proofs based on the personal data you've
        verified with Binance.
      </p>
      <div className="h-px bg-binanceYellow/40 mb-4" />
      <h2 className="mb-4 font-bold">Available proofs</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div
          className={`bg-white/5 text-center rounded-lg border p-4 ${
            over18Verified ? "border-green-400" : "border-transparent"
          }`}
        >
          <h3 className="mb-2">Age is &gt;= 18</h3>
          {over18Verified && (
            <p className="flex text-sm items-center justify-center text-green-400 mb-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className=""
              >
                <path
                  d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                  fill="currentColor"
                />
              </svg>{" "}
              Proof found
            </p>
          )}
          {/* @ts-ignore */}
          {!over18Verified && userData && userData.age >= 18 && (
            <p className="text-sm justify-center flex items-center text-red-400 mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                  fill="currentColor"
                />
              </svg>{" "}
              Proof not found
            </p>
          )}
          {/* @ts-ignore */}
          {!over18Verified && userData && userData.age < 18 && (
            <p className="text-sm flex items-center justify-center text-orange-400 mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.34315 17.6569C9.46734 20.781 14.5327 20.781 17.6569 17.6569C20.781 14.5327 20.781 9.46734 17.6569 6.34315C14.5327 3.21895 9.46734 3.21895 6.34315 6.34315C3.21895 9.46734 3.21895 14.5327 6.34315 17.6569ZM16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426Z"
                  fill="currentColor"
                />
              </svg>
              Not applicable
            </p>
          )}
          <button
            // @ts-ignore
            disabled={over18Verified || userData?.age < 18}
            onClick={() => verifyAge(signer, address)}
            className="text-sm font-bold bg-binanceYellow text-binanceBg px-4 py-2 rounded transition-all duration-350 hover:opacity-60 disabled:opacity-20"
          >
            Add proof to SBT
          </button>
        </div>
        <div className="bg-white/5 text-center rounded-lg border-2 border-transparent p-4">
          <h3 className="mb-2">Age is &lt; 18</h3>
          {/* @ts-ignore */}
          {userData && userData.age < 18 && (
            <p className="text-sm justify-center flex items-center text-red-400 mb-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                  fill="currentColor"
                />
              </svg>{" "}
              Proof not found
            </p>
          )}
          {/* @ts-ignore */}
          {userData && userData.age >= 18 && (
            <p className="text-sm flex items-center justify-center text-orange-400 mb-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.34315 17.6569C9.46734 20.781 14.5327 20.781 17.6569 17.6569C20.781 14.5327 20.781 9.46734 17.6569 6.34315C14.5327 3.21895 9.46734 3.21895 6.34315 6.34315C3.21895 9.46734 3.21895 14.5327 6.34315 17.6569ZM16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426Z"
                  fill="currentColor"
                />
              </svg>
              Not applicable
            </p>
          )}
          <button
            // @ts-ignore
            disabled={userData?.age >= 18}
            onClick={() => verifyAge(signer, address)}
            className="text-sm font-bold bg-binanceYellow text-binanceBg px-4 py-2 rounded transition-all duration-350 hover:opacity-60 disabled:opacity-20"
          >
            Add proof to SBT
          </button>
        </div>
        <div className="bg-white/5 text-center rounded-lg border-2 border-transparent p-4">
          <h3 className="mb-2">Lives in Finland</h3>
          <p className="text-sm justify-center flex items-center text-red-400 mb-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                fill="currentColor"
              />
            </svg>{" "}
            Proof not found
          </p>
          <button
            onClick={() => verifyAge(signer, address)}
            className="text-sm font-bold bg-binanceYellow text-binanceBg px-4 py-2 rounded transition-all duration-350 hover:opacity-60"
          >
            Add proof to SBT
          </button>
        </div>
      </div>
    </div>
  );
}
