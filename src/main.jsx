import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import { EthereumProvider } from "./context/ETHContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <EthereumProvider>
    <App />
  </EthereumProvider>,
)
