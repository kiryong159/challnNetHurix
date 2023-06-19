import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <>
      <Router basename="/">
        <Header />
        <Switch>
          <Route path={["/tv", "/tv/:TvId"]}>
            <Tv />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path={["/", "/movies/:movieId"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
