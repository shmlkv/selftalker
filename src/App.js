import React, { Component } from "react";
import Modal from "react-responsive-modal";
import { animateScroll } from "react-scroll";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    let localChat = localStorage.getItem("chat");
    this.state = {
      inputStatus: "left",
      theme: localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        : "light",
      modalOpen: false,
      modalClearOpen: false,
      chat: localChat
        ? JSON.parse(localChat)
        : [
            ({ type: "left", text: "What do you want?" },
            {
              type: "right",
              text: "I wanted to ask about the meaning of my life",
            }),
          ],
    };
    this.handleInput = this.handleInput.bind(this);
  }
  onOpenModal = () => {
    this.setState({ modalOpen: true });
  };

  onCloseModal = () => {
    this.setState({ modalOpen: false });
  };
  onOpenModalClear = () => {
    this.setState({ modalClearOpen: true });
  };

  onCloseModalClear = () => {
    this.setState({ modalClearOpen: false });
  };
  changeSelector = () => {
    this.setState({
      inputStatus: this.state.inputStatus === "left" ? "right" : "left",
    });
  };
  handleInput = (event) => {
    if (event.target.value) {
      let newState = this.state.chat;

      newState.push({
        type: this.state.inputStatus,
        text: event.target.value,
      });

      localStorage.setItem("chat", JSON.stringify(newState));
      this.setState({
        chat: newState,
      });
      this.refs.chat_input.value = "";
      animateScroll.scrollToBottom({
        containerId: "chat_messages",
      });
    }
  };
  handleClear = () => {
    this.setState({ chat: [], modalClearOpen: false });
  };
  toggleLight = () => {
    let themeColor = this.state.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", themeColor);
    this.setState({ theme: themeColor });
  };
  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (!this.refs.chat_input.value) {
        if (e.key === "ArrowLeft") this.setState({ inputStatus: "left" });
        if (e.key === "ArrowRight") this.setState({ inputStatus: "right" });
      }
    });
  }

  render() {
    const modalStyles = {
      modal: { padding: "0 20px 20px" },
      closeButton: { cursor: "pointer" },
    };
    return (
      <div className={"App " + this.state.theme}>
        <h1>
          Selftalker{" "}
          <span role="img" aria-label="meditation">
            🧘🏻‍♂️
          </span>
        </h1>
        <p>Sometimes you need to talk to yourself</p>
        <div className="chat">
          <div className="chat_messages" id="chat_messages">
            {this.state.chat.map((message) => (
              <div className={message.type + " message"}>{message.text}</div>
            ))}
          </div>
          <div className="chat_input">
            <input
              className="chat_input"
              ref="chat_input"
              placeholder="Write a message..."
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.handleInput(event);
                }
              }}
            />
            <span
              className="chat_selector"
              onClick={this.changeSelector}
              role="img"
            >
              {this.state.inputStatus === "left" ? "⬅️" : "➡️"}
            </span>
          </div>
        </div>
        <div className="buttons">
          <span
            className="info"
            onClick={this.onOpenModal}
            alt="Info"
            role="img"
            aria-label="info"
          >
            ℹ️
          </span>
          <span
            className="darkmode"
            onClick={this.toggleLight}
            alt="darkmode"
            role="img"
            aria-label="moon"
          >
            {this.state.theme === "light" ? "🌚" : "🌝"}
          </span>
          <span
            className="clear"
            onClick={this.onOpenModalClear}
            alt="Clear chat"
            role="img"
            aria-label="trash"
          >
            🗑
          </span>
        </div>
        <Modal
          open={this.state.modalOpen}
          onClose={this.onCloseModal}
          center
          styles={modalStyles}
        >
          <h2>
            {" "}
            <span role="img" aria-label="info">
              ℹ️
            </span>
          </h2>
          <p>
            Use <code>←</code> <code>→</code> with empty input to change the
            direction of the message.
          </p>
          <p>
            We don't store any data on our servers, after reloading messages
            will be cleared.
          </p>
        </Modal>
        <Modal
          open={this.state.modalClearOpen}
          onClose={this.onCloseModalClear}
          center
          styles={modalStyles}
        >
          <h2>🗑</h2>

          <p>Are you sure you want to clear the messages?</p>
          <button onClick={this.handleClear}>Sure, delete it all</button>
        </Modal>
      </div>
    );
  }
}

export default App;
