import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../actions/user.action";
import Login from "../components/login/login";
import  { Redirect } from 'react-router-dom'
import { BACKEND_PORT } from "../config/application.config";
import jwt_decode from 'jwt-decode'
require('dotenv').config();

const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || 'localhost'

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notiLogin: ""
    };
  }
  loginSubmit = async (email, password) => {
    if (!this.isvalidEmail(email)) {
      this.setState({ notiLogin: "Email invalid" });
      return;
    } else {
      this.setState({ notiLogin: "" });
    }
    let res;
    try {
      res = await axios.post(`http://${BACKEND_HOST}:${BACKEND_PORT}/admin/login`, {
        email: email,
        password: password
      });
    } catch (err) {
      if (err.response !== undefined) {
        if (err.response.data.message === "Email hoặc mật khẩu không đúng")
          this.setState({ notiLogin: "Email hoặc mật khẩu không đúng" });
        else {
          this.setState({ notiLogin: "The account has not been activated" });
        }
      } else {
        this.setState({ notiLogin: "Some thing went wrong" });
      }
      return;
    }
    var decodedToken = jwt_decode(res.data.data.token);
    this.props.userActions.loginSuccess(res.data.data.token, decodedToken.user_id);
    window.location.replace('/')
  };
  isvalidEmail = email => {
    if (email === "" || email.indexOf("@") === -1 || email.indexOf(".") === -1)
      return false;
    return true;
  };
  render() {
    return (
      <div>
        <Login
          loginSubmit={(email, password) => this.loginSubmit(email, password)}
          notiLogin={this.state.notiLogin}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
    islogin: state.userReducers.user.islogin
});

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
