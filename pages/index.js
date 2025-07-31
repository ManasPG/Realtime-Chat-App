import React, { Component } from "react";
import Layout from "../components/Layout";
import Chat from "../components/Chat";

class IndexPage extends Component {
  state = { user: null };

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13 && evt.target.value.trim() !== "") {
      const user = evt.target.value.trim();
      this.setState({ user });
    }
  };

  render() {
    const { user } = this.state;

    return (
      <Layout pageTitle="Realtime Chat">
        <main
          className="d-flex justify-content-center align-items-center text-white"
          style={{
            backgroundColor: "#000",
            minHeight: "100vh",
            width: "100vw",
            padding: "2rem", // add padding for spacing
            boxSizing: "border-box",
            overflowY: "auto", // vertical scroll only if needed
            overflowX: "hidden", // hide horizontal scroll
          }}
        >
          {user ? (
            <div
              className="container-fluid h-100"
              style={{
                maxWidth: "100vw", // Prevent overflow
                overflowX: "hidden", // Hide horizontal scroll
                padding: 0, // Remove default padding
              }}
            >
              <div className="row h-100" style={{ margin: 0 }}>
                <div className="col-md-4 bg-white p-0">
                  <Chat activeUser={user} />
                </div>
                <div className="col-md-8 d-flex justify-content-center align-items-center bg-dark p-0">
                  <h2 className="text-light">Welcome, {user}!</h2>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="text-center px-3"
              style={{
                width: "100%",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              <h1
                className="mb-4"
                style={{
                  fontSize: "2.5rem",
                  wordWrap: "break-word",
                  lineHeight: "1.4",
                }}
              >
                What is your name?
              </h1>
              <input
                type="text"
                placeholder="Enter your name and press Enter"
                onKeyUp={this.handleKeyUp}
                autoFocus
                className="form-control text-center text-white bg-transparent border-0 border-bottom border-secondary mx-auto"
                style={{
                  fontSize: "1.5rem",
                  outline: "none",
                  maxWidth: "100%", // allow full width
                }}
              />
            </div>
          )}
        </main>
      </Layout>
    );
  }
}

export default IndexPage;
