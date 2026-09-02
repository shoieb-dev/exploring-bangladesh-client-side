import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home/Home/Home";
import NotFound from "./Pages/NotFound/NotFound";
import Booking from "./Pages/Booking/Booking/Booking";
import Login from "./Pages/Login/Login/Login";
import Signup from "./Pages/Login/Signup/Signup";
import ForgotPassword from "./Pages/Login/ForgotPassword/ForgotPassword";
import Header from "./Pages/Shared/Header/Header";
import AuthProvider from "./contexts/AuthProvider";
import PrivateRoute from "./Pages/Login/PrivateRoute/PrivateRoute";
import Footer from "./Pages/Shared/Footer/Footer";
import PackageAdding from "./Pages/PackageAdding/PackageAdding";
import PackageManaging from "./Pages/PackageManaging/PackageManaging";
import MyPackages from "./Pages/MyPackages/MyPackages";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header></Header>

          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>

            <Route path="/home">
              <Home></Home>
            </Route>

            <Route path="/login">
              <Login></Login>
            </Route>

            <Route path="/signup">
              <Signup></Signup>
            </Route>

            <Route path="/forgotPassword">
              <ForgotPassword></ForgotPassword>
            </Route>

            <PrivateRoute path="/booking/:serviceId">
              <Booking></Booking>
            </PrivateRoute>

            <PrivateRoute path="/myPackages">
              <MyPackages></MyPackages>
            </PrivateRoute>

            <PrivateRoute path="/addPackage">
              <PackageAdding></PackageAdding>
            </PrivateRoute>

            <PrivateRoute path="/managePackages">
              <PackageManaging></PackageManaging>
            </PrivateRoute>

            <Route path="*">
              <NotFound></NotFound>
            </Route>
          </Switch>

          <Footer></Footer>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
