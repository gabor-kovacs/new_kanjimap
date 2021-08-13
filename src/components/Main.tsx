import { useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import { About } from "./About";
import Kanjis from "./Kanjis";
import { Header } from "./Header";

import { data } from "../data/data";
import { chise } from "../data/chise";

export const Main: React.FC = () => {
  // REMOVE LOADER
  useEffect(() => {
    const loaderElement: HTMLElement | null = document.getElementById("loader");
    if (loaderElement !== null) {
      loaderElement.style.opacity = "0";
    }
  }, []);

  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <App chise={chise} data={data} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/kanji">
            <Kanjis data={data} />
          </Route>
        </Switch>
      </Router>
    </>
  );
};
