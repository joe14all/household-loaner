import React from 'react';
// 1. Import hook from the ModalContext
import { useModalState } from './context/ModalContext.jsx'; 
import Modal from './components/Modal/Modal.jsx';
import Layout from './components/Layout/Layout.jsx';
import AppRouter from './router/AppRouter.jsx';
import './App.css';

function App() {
  // 2. Get modal state from our new hook
  const { isModalOpen, closeModal, modalContent } = useModalState();

  return (
    <> {/* Use a fragment to render Modal alongside Layout */}
      <Layout>
        <AppRouter />
      </Layout>
      
      {/* 3. This is the global modal renderer.
           If this code isn't here, the modal will never appear.
      */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </>
  );
}

export default App;