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

  //   The Initial Component Did Mount Lifecycle Method
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

  //   The Update Password Function
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

  // The Render Method
  render() {
    const { password, error, isLoading, updated } = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>
            <h4>Problem resetting password. Please send another reset link.</h4>
            <LinkButtons
              buttonText={`Go Home`}
              buttonStyle={homeButton}
              link={"/"}
            />
            <LinkButtons
              buttonStyle={forgotButton}
              buttonText={"Forgot Password?"}
              link={"/forgotPassword"}
            />
          </div>
        </div>
      );
    } else if (isLoading) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>Loading User Data ...</div>
        </div>
      );
    } else {
      return (
        <div>
          <HeaderBar title={title} />
          <form className="pssword-form" onSubmit={this.updatePassword}>
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              onChange={this.handleChange("password")}
              value={password}
              type="password"
            />
            <SubmitButtons
              buttonStyle={updateButton}
              buttonText={"Update Password"}
            />
          </form>

          {updated && (
            <div>
              <p>
                Your password has been successfully reset, please try logging in
                again.
              </p>
              <LinkButtons
                buttonStyle={loginButton}
                buttonText={"Login"}
                link={`/login`}
              />
            </div>
          )}
          <LinkButtons
            buttonText={`Go Home`}
            buttonStyle={homeButton}
            link={"/"}
          />
        </div>
      );
    }
  }
}
