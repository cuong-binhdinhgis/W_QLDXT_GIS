//React
import * as React from 'react';
import { Route, Redirect, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import SnackbarContent from '../components/material-ui/Snackbar';
//Component
import LoginPage from './LoginPage';
import LoadingPage from './LoadingPage';
import PASCPage from './PASCPage';
import NotFound from './NotFound';
import MenuPage from './MenuPage';
import NotAccess from './NotAccess';
import LogoutFunction from './LogoutFunction';
import PrivateComponent from '../components/PrivateComponent';;
import {
  LinearProgress, Snackbar,
  createStyles,
  WithStyles, withStyles, Divider
} from '@material-ui/core';
import routes from '../modules/routers';

//Redux
import { connect } from 'react-redux';
import { AllModelReducer } from '../reducers';
import { alertActions } from '../services/main/main.action';
import { Alert } from '../services/main/main.model';
import Header from '../components/Header/Header';
import { APP_PATH } from '../constants';
import VideoPage from './VideoPage';
//Module

const styles = () => createStyles({
  progress: {
    width: '100%',
    position: 'fixed',
    zIndex: 999999
  }
});

type StateToProps = {
  loading: boolean,
  authenticated: boolean,
  alert: Alert,
  isShowLoadingPage: boolean,
};
type DispatchToProps = {
  clearAlert: () => void

};

type Props = {
} & DispatchToProps & StateToProps & WithStyles<typeof styles> & RouteComponentProps<any>;


class AppPage extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private handleClose = () => {
    this.props.clearAlert();
  };

  render() {
    const { loading, alert, authenticated, isShowLoadingPage,
      classes
    } = this.props;


    const childLoading = <div className={classes.progress}>
      <LinearProgress />
    </div>;

    const childSnackbar = <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={alert.message != undefined}
      autoHideDuration={alert.type && alert.type === 'error' ? undefined : 6000}
      onClose={this.handleClose}
    >
      {alert.type &&
        <SnackbarContent
          onClose={this.handleClose}
          variant={alert.type || 'info'}
          message={alert.message}
        />
      }
    </Snackbar>;

    const childRoutes = routes.map(m =>
      <Route
        {...m.props}
        key={m.id}
        exact
        render={_ =>
          m.isPrivate ?
            <PrivateComponent
              Component={m.component}
              id={m.id}
            />
              : <div>
                <Header />
                <m.component id={m.id} />
              </div>
        } />);

    return (
      <div>
        {loading && childLoading}
        {childSnackbar}

        {isShowLoadingPage && <LoadingPage />}
        <Switch>
          {childRoutes}
          <Route
            path="/login"
            render={props => (
              authenticated ? (
                <Redirect
                  path="/login"
                  to={{
                    pathname: '/',
                    state: { from: props.location }
                  }}
                />
              ) : (
                  <LoginPage />
                )
            )}
          />
          <Route exact path="/" render={props => (
            <MenuPage id="menupage" />
          )} />
          <Route path="/logout" component={LogoutFunction} />
          <Route path="/notaccess" component={NotAccess} />
          <Route component={NotFound} />
        </Switch>
      </div>
    );
  }
}

const mapStatesToProps = (state: AllModelReducer): StateToProps => ({
  loading: state.main.loading,
  authenticated: state.main.loggingIn,
  alert: state.main.alert,
  isShowLoadingPage: state.main.isShowLoadingPage,
});
const mapDispatchToProps = (dispatch: Function): DispatchToProps => ({
  clearAlert: () => dispatch(alertActions.clear())
});

export default withRouter(connect(mapStatesToProps, mapDispatchToProps)(withStyles(styles)(AppPage)));