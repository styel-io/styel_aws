import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

import {
  LinkButtons,
  SubmitButtons,
  registerButton,
  homeButton,
  forgotButton,
  inputStyle,
  HeaderBar
} from "../../components/buttons";

const loading = {
  margin: "1rem",
  fontsize: "24px"
};

const title = {
  pageTitle: "Password Reset Screen"
};

export default class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      update: false,
      isLoading: true,
      error: false
    };
  }

  async componentDidMount() {
    console.log(this.props.match.params.token);
    await axios
      .get("http://localhost:5000/reset", {
        params: {
          resetPasswordToken: this.props.match.params.token
        }
      })
      .then(response => {
        console.log(response);
        if (response.data.message === "password reset link a-ok") {
          this.setState({
            username: response.data.username,
            update: false,
            isLoading: false,
            error: false
          });
        } else {
          this.setState({
            update: false,
            isLoading: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.log(error.data);
      });
  }

  updatePassword = e => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/updatePasswordViaEmail", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response.data);
        if (response.data.message === "password updated") {
          this.setState({
            updated: true,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.log(error.data);
      });
  };

  render() {
    const { password, error, isLoading, updated } = this.state;

    if(error){
        return(
            <div>
                <HeaderBar title={title} />
                <div style={loading}>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <LinkButtons buttonText={`Go Home`}
                </div>
            </div>
        )
    }
  }
}
