import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { BrowserRouter } from "react-router-dom";
import { StateContextProvider } from "./context";
import "./index.css";
import "dotenv/config";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <ThirdwebProvider clientId={THIRDWEB_CLIENT_ID} activeChain={Sepolia}>
            <BrowserRouter>
                <StateContextProvider>
                    <App />
                </StateContextProvider>
            </BrowserRouter>
        </ThirdwebProvider>
    </React.StrictMode>
);
