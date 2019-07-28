import React, { Component } from "react";

const CreateCard = props => {
  if (props.creating) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          width: "100%",
          padding: 15,
          margin: 5,
          disply: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ marginBottom: 15 }}>
          <textarea
            rows="4"
            cols="50"
            value={props.value}
            onChange={props.onChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <button
            className="pure-button pure-button-warning"
            onClick={props.cancel}
          >
            Cancel
          </button>
          <button className="button-success pure-button" onClick={props.submit}>
            Submit
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <button
        className="button-success pure-button"
        style={{ width: "100%" }}
        onClick={props.setCreating}
      >
        Create New Quote
      </button>
    );
  }
};

const QuoteCard = props => {
  if (props.updating) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          width: "100%",
          padding: 15,
          margin: 5,
          disply: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ marginBottom: 15 }}>
          <textarea
            rows="4"
            cols="50"
            value={props.newString}
            onChange={props.onChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <button
            className="pure-button pure-button-warning"
            onClick={props.cancel}
          >
            Cancel
          </button>
          <button className="button-success pure-button" onClick={props.submit}>
            Submit
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          width: "100%",
          padding: 15,
          margin: 5,
          disply: "flex",
          flexDirection: "column"
        }}
      >
        <div style={{ marginBottom: 15 }}>{props.quote}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <button
            className="pure-button pure-button-error"
            onClick={props.delete}
          >
            Delete
          </button>
          <button
            className="pure-button pure-button-primary"
            onClick={props.setUpdating}
          >
            Update
          </button>
        </div>
      </div>
    );
  }
};

class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quotes: [],
      updatingQuote: null,
      newString: "",
      creating: false
    };
  }

  componentDidMount = async () => {
    this.refreshQuotes();
  };

  refreshQuotes = async () => {
    let res = await fetch("/quotes");

    this.setState({
      quotes: await res.json()
    });
  };

  setCreating = () => {
    this.setState({
      creating: true,
      newString: ""
    });
  };

  setUpdateing = index => {
    this.setState({
      updatingQuote: index,
      newString: this.state.quotes[index]
    });
  };

  updateString = e => {
    this.setState({ newString: e.target.value });
  };

  updateQuote = async () => {
    let { updatingQuote, newString } = this.state;
    let res = await fetch("/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        index: updatingQuote,
        newQuote: newString
      })
    });

    await this.refreshQuotes();
    this.setState({
      updatingQuote: null
    });
  };

  deleteQuote = async index => {
    let res = await fetch("/delete", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        index: index
      })
    });

    this.refreshQuotes();
  };

  createQuote = async () => {
    let res = await fetch("/new", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quote: this.state.newString
        })
      });
  
      await this.refreshQuotes();
      this.setState({creating: false})
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          alignItems: "baseline",
          verticalAlign: "middle",
          overflow: "auto",
          maxHeight: "-webkit-fill-available",
          padding: 10
        }}
      >
        <CreateCard
          creating={this.state.creating}
          setCreating={this.setCreating}
          value={this.state.newString}
          onChange={this.updateString}
          submit={this.createQuote}
          cancel={() => this.setState({creating: false})}
        />
        {this.state.quotes.map((quote, index) => (
          <QuoteCard
            onChange={this.updateString}
            updating={index === this.state.updatingQuote}
            newString={this.state.newString}
            setUpdating={() => this.setUpdateing(index)}
            submit={this.updateQuote}
            cancel={() => this.setState({ updatingQuote: null })}
            delete={() => this.deleteQuote(index)}
            quote={quote}
          />
        ))}
      </div>
    );
  }
}

export default Edit;
