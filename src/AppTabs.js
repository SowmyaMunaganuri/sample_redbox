import React, { Fragment } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { grey } from "@material-ui/core/colors";

import Drilling from "./components/Drilling";
import Completion from "./components/Completion";
import RedBox from "./components/RedBox";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: {
      main: "#f5f5f5",
    },
  },
});

class AppTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: localStorage.getItem("userLoggedIn").toString(),
      hasError: false,
      errorMesg:""
    };
  }
  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, errorMesg: error });
  }
  userLogout = () => {
    // e.preventDefault()
    localStorage.clear();
    localStorage.setItem("userLoggedIn", "false");
  };
  componentDidMount() {
    console.log("Component Mounted!");
    window.addEventListener("beforeunload", () => {
      this.userLogout();
    });
  }
  componentWillUnmount() {
    console.log("Component unmounted!");
    window.removeEventListener("beforeunload", () => {
      this.userLogout();
    });
  }
  render() {
    if (this.state.hasError) {
      this.userLogout();
      console.log("Crashes!" + this.state.errorMesg);
      return(
        <div>
          <h3> Web Page not available!</h3>
          <p>Contact IT Development Manager... </p>
        </div>
      )
    }else{
    return (
      <ThemeProvider theme={theme}>
        <div>
          <div className="crownquest">CrownQuest</div>
          <Router>
            <Route
              path="/app"
              render={({ location }) => (
                <Fragment>
                  <AppBar
                    position="sticky"
                    style={{
                      backgroundColor: "#212121",
                      color: "white",
                      top: "5vh",
                    }}
                  >
                    <Tabs
                      value={location.pathname}
                      aria-label="simple tabs example"
                      variant="fullWidth"
                      // style={{ justify: "space-between" }}
                    >
                      <Tab
                        label="Drilling"
                        value="/app/drilling"
                        component={Link}
                        to="/app/drilling"
                      />

                      <Tab
                        label="Completion"
                        value="/app/completion"
                        component={Link}
                        to="/app/completion"
                      />

                      <Tab
                        label="Red Box"
                        value="/app/redbox"
                        component={Link}
                        to="/app/redbox"
                      />
                    </Tabs>
                  </AppBar>

                  <Switch>
                    <Route
                      exact
                      path="/app/drilling"
                      render={() => (
                        <Drilling isUser={this.state.userLoggedIn} />
                      )}
                    />
                    <Route
                      exact
                      path="/app/completion"
                      render={() => (
                        <Completion isUser={this.state.userLoggedIn} />
                      )}
                    />
                    <Route
                      exact
                      path="/app/redbox"
                      render={() => <RedBox isUser={this.state.userLoggedIn} />}
                    />
                  </Switch>
                </Fragment>
              )}
            />
          </Router>
        </div>
      </ThemeProvider>
    );
                      }
  }
}

export default AppTabs;
