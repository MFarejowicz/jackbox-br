import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "@pages/Home";
import Game from "@pages/Game";
import NotFound from "@pages/NotFound";

// import { get } from "./utilities";
// React.useEffect(() => {
//   async function test() {
//     const res = await get("/api/test");
//     console.log(res);
//   }
//   test();
// }, []);

const App = () => {
  const [identity, setIdentity] = useState(null);

  return (
    <Router>
      <Switch>
        <Route exact path="/:gameID(\w{4})">
          {/* (\w{4}) signifies 4 word characters
            this is how we validate room codes */}
          <Game identity={identity} setIdentity={setIdentity} />
        </Route>
        <Route exact path="/">
          <Home setIdentity={setIdentity} />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
