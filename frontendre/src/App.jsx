import {Routes, Route ,Navigate} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Firstpage from "./pages/Firstpage";
import Admin from "./pages/Admin";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import ProblemPage from "./pages/ProblemPage";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,loading} = useSelector((state)=>state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <>
    <Routes>
      <Route path="/" element={<Firstpage></Firstpage>}></Route>
      <Route path="/Homepage" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/Homepage" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/Homepage" />:<Signup></Signup>}></Route>
      <Route path="/admin" element={<Admin/>}></Route>
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>*/
    </Routes>
  </>
  )
}

export default App;