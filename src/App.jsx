import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import "./App.css"
import wethAbi from "./wethAbi.json"
import { useEthereum } from "./context/ETHContext"

const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"

const App = () => {
  const { provider, signer, account, error, connectWallet, disconnectWallet } = useEthereum()
  const [ethBalance, setEthBalance] = useState(0)
  const [wethBalance, setWethBalance] = useState(0)
  const [amount, setAmount] = useState("")
  const [callError, setCallError] = useState(null)

  const fetchBalances = useCallback(async () => {
    if (provider && account) {
      const ethBal = await provider.getBalance(account)
      setEthBalance(ethers.formatEther(ethBal))
      const wethContract = new ethers.Contract(WETH_ADDRESS, wethAbi, provider)
      const wethBal = await wethContract.balanceOf(account)
      setWethBalance(ethers.formatEther(wethBal.toString()))
    }
  }, [account, provider])

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  console.log(connectWallet);

  const wrapEth = async () => {
    try {
      if (!signer) {
        throw new Error("Wallet not connected.")
      }

      const wethContract = new ethers.Contract(WETH_ADDRESS, wethAbi, signer)
      const tx = await wethContract.deposit({ value: ethers.parseEther(amount) })
      await tx.wait()
      setAmount("")
      await fetchBalances()
    } catch (error) {
      console.error("Error wrapping ETH:", error)
      setCallError("Failed to wrap ETH. Please check your balance and try again.")
    }
  }

  const unwrapWeth = async () => {
    try {
      if (!signer) {
        throw new Error("Wallet not connected.")
      }
      const value = ethers.parseEther(amount)
      console.log(value)
      const wethContract = new ethers.Contract(WETH_ADDRESS, wethAbi, signer)
      console.log(wethContract)
      const tx = await wethContract.withdraw(BigInt(value))
      await tx.wait()
      setAmount("")
      await fetchBalances()
    } catch (error) {
      console.error("Error unwrapping WETH:", error)
      setCallError("Failed to unwrap WETH. Please check your balance and try again.")
    }
  }

  return (
    <div className="container">
      <h1>Wrap and Unwrap ETH</h1>
      {account ? (
        <>
          <div>
            <p>ETH Balance: {ethBalance}</p>
            <p>WETH Balance: {wethBalance}</p>
          </div>
          <div>
            <input
              className="input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <div className="btn-group">
              <button className="wrap-btn" onClick={wrapEth}>
                Wrap
              </button>
              <button className="unwrap-btn" onClick={unwrapWeth}>
                Unwrap
              </button>
              <button onClick={disconnectWallet}>Disconnect</button>
              {callError ? <div className="error">Caught an error, please retry later</div> : null}
            </div>
          </div>
        </>
      ) : (
        <div className="login-box">
          <p className="login-text">Please connect your wallet</p>
          <button onClick={connectWallet}>Connect MetaMask</button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  )
}

export default App
