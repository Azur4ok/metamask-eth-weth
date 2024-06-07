import React, { createContext, useContext, useState, useEffect } from "react"
import { ethers } from "ethers"

const EthereumContext = createContext()

export const useEthereum = () => useContext(EthereumContext)

export const EthereumProvider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const initEthereum = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(web3Provider)

        window.ethereum.on("accountsChanged", async (accounts) => {
          setAccount(accounts[0])
        })

        const accounts = await web3Provider.send("eth_requestAccounts", [])
        setSigner(await web3Provider.getSigner())
        setAccount(accounts[0])
      }
    }

    initEthereum()
  }, [])

  return (
    <EthereumContext.Provider value={{ provider, signer, account }}>
      {children}
    </EthereumContext.Provider>
  )
}
