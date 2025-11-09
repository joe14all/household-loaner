/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

// 1. Create the new modal context
const ModalContext = createContext();

// 2. Create a custom hook for easy access
export const useModalState = () => {
  return useContext(ModalContext);
};

// 3. Create the Provider component
export const ModalProvider = ({ children }) => {
  
  // --- All modal logic lives here now ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // We set content to null after a short delay
    // to allow the fade-out animation to finish.
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Should match animation duration
  };
  // --- END: Modal State ---


  const value = {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};