import React from 'react';

// Import our main Layout and the new AppRouter
import Layout from './components/Layout/Layout.jsx';
import AppRouter from './router/AppRouter.jsx';

// Import our new global styles
import './App.css';

function App() {
  return (
    <Layout>
      {/* The Layout component (which we'll build next) 
        will render our Sidebar and main content area.
        
        AppRouter will swap the correct page
        into that main content area.
      */}
      <AppRouter />
    </Layout>
  );
}

export default App;