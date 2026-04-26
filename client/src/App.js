import { 
  createBrowserRouter,
  RouterProvider,
  Navigate} from "react-router-dom";

// main 
import QuestBoard from "./pages/Board";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Party from "./pages/Party";
import Post from "./pages/Postbounty";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Bank from "./pages/Bank";
import BlacksmithShop from "./pages/Blacksmith";
import SubmitResult from "./pages/PartySubmit";

import "./style.css"
import { useContext } from "react";
import { AuthContext } from "./context/authContext";


function App() {

  // Context cookie provider during app use
  const currentUser = useContext(AuthContext);
  console.log(currentUser);

  // Prevent going to homepage before login
  const ProtectedRoute = ({children}) =>{
    if(!currentUser){ 
      return <Navigate to="/login"/>
    }
    return children
  };

  // Frontend Router 
  const router = createBrowserRouter([
    // Home and Dependent on login route
    {
      path:"/",
      element: <ProtectedRoute>
                  <QuestBoard />
                </ProtectedRoute>
    },
    {
      path:"/party/:partyid", 
      element:<ProtectedRoute>
                  <Party />
                </ProtectedRoute>
      
    },
    {
      path:"/postbounty", 
      element:<ProtectedRoute>
                  <Post />
                </ProtectedRoute>
      
    },
    {
      path:"/searchParty/:tag", 
      element:<ProtectedRoute>
                  <Search />
                </ProtectedRoute>
    },
    {
      path:"/profile/:profileid", 
      element:<ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
    },
    {
      path:"/bank", 
      element:<ProtectedRoute>
                  <Bank />
                </ProtectedRoute>
    },
    {
      path:"/blacksmith", 
      element:<ProtectedRoute>
                  <BlacksmithShop />
                </ProtectedRoute>
    },
    {
      path:"/submitResult/:partyid", 
      element:<ProtectedRoute>
                  <SubmitResult />
                </ProtectedRoute>
    },


    // Independent Route

    {
      path:"/login",
      element: <Login />
    },
    {
      path:"/register", 
      element:<Register />
    }
  
  ]);

  return (
    <div>
      <RouterProvider router ={router} />
    </div>
  );
}

export default App;
