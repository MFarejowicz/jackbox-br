import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Room from "./pages/Room";
import NotFound from "./pages/NotFound";

import { get } from "./utilities";

const App = () => {
  React.useEffect(() => {
    async function test() {
      const res = await get("/api/test");
      console.log(res);
    }
    test();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/:roomID(\w{4})">
          {/* (\w{4}) signifies 4 word characters
            this is how we validate room codes */}
          <Room />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
