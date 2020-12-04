import React, { Component } from "react";
// import { connect } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import HomePageOne from "./home/HomePageOne";
import HomePageTwo from "./home/HomePageTwo";
import Layout from "./Layout";

const RestrictedRoute = ({
  component: Component,
  userRole,
  path,
  location,
  authUser,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={
        (props) => (
          // authUser != null ?
          <Component {...props} />
        )
        // : <Redirect to={"/login"} />
      }
    />
  );
};

const MainApp = ({
  component: Component,
  // userRole,
  path,
  location,
  // authUser,
  ...rest
}) => {
  return (
    <Switch>
      <Route
        path="/store"
        render={(props) => (
          <Layout
            {...props}
            headerLayout="compact"
            homeComponent={HomePageOne}
          />
        )}
      />

      <Route
        path="/"
        render={(props) => (
          <Layout
            {...props}
            headerLayout="default"
            homeComponent={HomePageTwo}
          />
        )}
      />
      <Redirect to="/" />
    </Switch>
  );
};

class App extends Component {
  componentWillMount() {}

  render() {
    const { match, location, authUser } = this.props;

    return (
      <Switch>
        (
        <RestrictedRoute
          path={`${match.url}`}
          authUser={authUser}
          component={MainApp}
          location={location}
        />
        )
      </Switch>
    );
  }
}

// const mapStateToProps = ({ auth }) => {
//   const { authUser } = auth;
//   return { authUser };
// };
// export default connect(mapStateToProps, {})(App);
export default App;
