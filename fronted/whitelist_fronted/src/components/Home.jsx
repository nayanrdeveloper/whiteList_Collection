import React, { useEffect, useRef, useState } from "react";
import web3Modal from "web3modal";
import { Signer, providers, Contract } from "ethers";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants/index.js";

function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinWhitelisted, setJoinWhitelisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  const web3ModalRef = useRef();

  const getSignerOrProvider = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 5) {
      window.alert("Please connect to goerli Network");
      throw new Error("Please connect to goerli Network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const tx = await whitelistContract.addAddressToWhiteList();
      setLoading(true);
      await tx.wait();
      setLoading(false);

      await getNumberOfWhiteListed();
      setJoinWhitelisted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getNumberOfWhiteListed = async () => {
    try {
      const provider = await getSignerOrProvider(true);
      const whiteLIstContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi.abi,
        provider
      );
      const _numberOfWhitelisted =
        await whiteLIstContract.numAddressesWhiteListed();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getSignerOrProvider(true);
      console.log(signer);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const address = await signer.getAddress();
      console.log(address);

      const _joinWhiteList = await whitelistContract.whiteListAddresses(
        address
      );
      setJoinWhitelisted(_joinWhiteList);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getSignerOrProvider();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhiteListed();
    } catch (error) {
      console.error(error);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinWhitelisted) {
        console.log("Thank for joining Whitelist");
        return <div className="description">Thank for joining Whitelist!</div>;
      } else if (loading) {
        console.log("Loading");
        return <button className="button">LOading...</button>;
      } else {
        console.log("Join the Whitelist");
        return <button onClick={addAddressToWhitelist} className="button">
          Join the Whitelist
        </button>;
      }
    } else {
      return (
        <button onClick={connectWallet} className="button">
          Connect your Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <div className="main">
        <div>
          <h1 className="title">Welcome to Crypto Devs!</h1>
          <div className="description">
            Its an NFT collection for developers in Crypto.
          </div>
          <div className="description">
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className="image" src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className="description">Made with &#10084; by Crypto Devs</footer>
    </div>
  );
}

export default Home;
