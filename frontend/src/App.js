import './App.css';
import React  from 'react';
import {
   RouterProvider,
   createBrowserRouter,
   Route,
   createRoutesFromElements,
} from 'react-router-dom';
import HomePage,{action as actionHandleImage} from './page/HomePage';
import ErroPage from './page/ErroPage';

const routes = createRoutesFromElements(
  <>
     <Route
        path="/"
        element={<HomePage />}
        // loader={() => }
        action={actionHandleImage}  
        errorElement={<ErroPage />}
        id="root">
        {/* <Route index element={<HomePage />} /> */}
       </Route>
  </>
);

const router = createBrowserRouter(routes);


function App() {
  return <RouterProvider router={router} />;
}

export default App;
