import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"

const EthereumContext = createContext()

export const useEthereum = () => useContext(EthereumContext)

export const EthereumProvider = ({ children }) => {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)

  const [error, setError] = useState("")

  const connectWallet = useCallback(async () => {
    try {
      if (window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        setProvider(web3Provider)
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setSigner(web3Provider.getSigner())
        setAccount(accounts[0])

        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0])
        })
      } else {
        setError("MetaMask is not installed")
      }
    } catch (err) {
      console.log(err);
      if (err.code === 4001) {
        setError("User rejected the request.")
      } else {
        setError("An unknown error occurred.")
      }
    }
  }, [])

    const disconnectWallet = useCallback(() => {
      setAccount(null)
      setSigner(null)
      setProvider(null)
    }, [])

  useEffect(() => {
    connectWallet()
  }, [connectWallet])

  return (
    <EthereumContext.Provider value={{ provider, signer, account, connectWallet, error, disconnectWallet }}>
      {children}
    </EthereumContext.Provider>
  )
}
