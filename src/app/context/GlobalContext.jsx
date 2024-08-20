"use client";
import React, { createContext, useState, useContext } from 'react';

// Create a Context
const GlobalContext = createContext();

// Create a Provider Component
export const GlobalProvider = ({ children }) => {
    const [publicKey, setPublicKey] = useState(null); // State to store the public key

    return (
        <GlobalContext.Provider value={{ publicKey, setPublicKey }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Create a custom hook to use the context
export const useGlobalContext = () => useContext(GlobalContext);
