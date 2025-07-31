import React, { Component, Fragment } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import ChatMessage from "./ChatMessage";

const SAD_EMOJI = [0x1f641]; // 🙁
const HAPPY_EMOJI = [0x1f600]; // 😀
const NEUTRAL_EMOJI = [0x1f610]; // 😐

class Chat extends Component {
  state = { chats: [] };

  componentDidMount() {
    // Initialize Pusher
    this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    // Subscribe to the chat room channel
    this.channel = this.pusher.subscribe("chat-room");

    // Listen for new messages
    this.channel.bind("new-message", (data) => {
      this.setState((prevState) => ({
        chats: [...prevState.chats, data.chat],
      }));
    });

    // Load chat history
    axios.get("/api/messages").then((response) => {
      this.setState({ chats: response.data.messages || [] });
    });
  }

  componentWillUnmount() {
    // Cleanup Pusher connection
    this.pusher.unsubscribe("chat-room");
    this.pusher.disconnect();
  }

  handleKeyUp = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey && evt.target.value.trim() !== "") {
      const message = evt.target.value.trim();
      const { activeUser: user } = this.props;

      evt.target.value = ""; // Clear input

      axios.post("/api/message", {
        user,
        message,
        timestamp: Date.now(),
      });
    }
  };

  render() {
    const { chats } = this.state;
    const { activeUser } = this.props;

    return (
      <Fragment>
        {/* Chat Header */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3 bg-dark text-white"
          style={{ height: 70, maxWidth: "100%", overflowX: "hidden" }}
        >
          <h4 className="mb-0">Chat Room</h4>
          <span className="badge bg-secondary">{activeUser}</span>
        </div>

        {/* Chat History */}
        <div
          className="overflow-auto px-4 py-3"
          style={{
            height: "calc(100vh - 170px)",
            background: "#f8f9fa",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {chats.length === 0 ? (
            <p className="text-muted text-center">
              No messages yet. Start chatting!
            </p>
          ) : (
            chats.map((chat, index) => {
              const previous = Math.max(0, index - 1);
              const previousChat = chats[previous];
              const position = chat.user === activeUser ? "right" : "left";

              const isFirst = previous === index;
              const inSequence = chat.user === previousChat.user;
              const hasDelay =
                Math.ceil(
                  (chat.timestamp - previousChat.timestamp) / (1000 * 60)
                ) > 1;

              const mood =
                chat.sentiment > 0
                  ? HAPPY_EMOJI
                  : chat.sentiment === 0
                  ? NEUTRAL_EMOJI
                  : SAD_EMOJI;

              return (
                <Fragment key={index}>
                  {(isFirst || !inSequence || hasDelay) && (
                    <div
                      className={`w-100 mt-3 text-${position}`}
                      style={{ fontSize: "0.85rem", color: "#555" }}
                    >
                      <span style={{ fontSize: "1.5rem" }}>
                        {String.fromCodePoint(...mood)}{" "}
                      </span>
                      <strong>{chat.user || "Anonymous"}</strong>
                    </div>
                  )}
                  <ChatMessage message={chat.message} position={position} />
                </Fragment>
              );
            })
          )}
        </div>

        {/* Chat Input */}
        <div className="border-top px-4 py-3 bg-light" style={{ maxWidth: "100%", overflowX: "hidden" }}>
          <textarea
            className="form-control"
            rows="2"
            placeholder="Type your message and press Enter"
            onKeyUp={this.handleKeyUp}
            style={{ resize: "none" }}
          ></textarea>
        </div>
      </Fragment>
    );
  }
}

export default Chat;
