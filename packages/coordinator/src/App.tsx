import React from "react";
import "./App.css";
import CoordinatorRouter from "./navigation/CoordinatorRouter";
import { BrowserRouter as Router } from "react-router-dom";
import WithGlobalTheme from "./HOCs/withGlobalTheme";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { he } from "date-fns/locale";

function App() {
  return (
    <div className="App">
      <WithGlobalTheme>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={he}>
          <Router>
            <CoordinatorRouter />
          </Router>
        </MuiPickersUtilsProvider>
      </WithGlobalTheme>
    </div>
  );
}

export default App;
