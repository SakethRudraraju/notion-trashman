/*global chrome*/

import React, { Component } from "react";
import logo from "./logo.svg";

const buttonStyle = {
  userSelect: "none",
  transition: "background 20ms ease-in 0s",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: "0",
  whiteSpace: "nowrap",
  height: "32px",
  borderRadius: "3px",
  background: "rgb(46, 170, 220)",
  color: "white",
  fill: "white",
  lineHeight: "1.2",
  paddingLeft: "12px",
  paddingRight: "12px",
  fontSize: "14px",
  fontWeight: "500",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.cookie = this.props.document.cookie;
    this.state = { success: null, loading: null, spaceId: null, error: null };
  }

  async getSpaceId() {
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.notion.so");
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"'
    );
    myHeaders.append("content-type", "application/json");
    myHeaders.append(
      "x-notion-active-user-header",
      "9270587d-b89e-4193-bd84-c97c19d0e474"
    );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );
    myHeaders.append("notion-client-version", "23.7.45");
    myHeaders.append("accept", "*/*");
    myHeaders.append("origin", "https://www.notion.so");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://www.notion.so/");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cookie", this.state.cookie);

    var raw = JSON.stringify({});

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let res = await fetch(
      "https://www.notion.so/api/v3/getSpaces",
      requestOptions
    );

    let data = await res.json();
    let spaceView = data[Object.keys(data)[0]].space_view;
    let spaceViewValue = spaceView[Object.keys(spaceView)[0]];
    let spaceId = spaceViewValue.value.space_id;
    console.log("got spaceId", spaceId);
    return spaceId;
  }

  async deleteBlocks(blocks) {
    console.log(blocks);
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.notion.so");
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"'
    );
    myHeaders.append("content-type", "application/json");
    // myHeaders.append(
    //   "x-notion-active-user-header",
    //   "32dc3c78-578e-49ad-9651-760370deecae"
    // );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );
    myHeaders.append("notion-client-version", "23.7.45");
    myHeaders.append("accept", "*/*");
    myHeaders.append("origin", "https://www.notion.so");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://www.notion.so/");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cookie", this.cookie);

    var raw = JSON.stringify({
      blockIds: blocks,
      permanentlyDelete: true,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let res = await fetch(
      "https://www.notion.so/api/v3/deleteBlocks",
      requestOptions
    );
    if (res.status != 200) {
      return alert(
        "Sorry, there was an error deleting your pages. Tech savvy fellers, check the console"
      );
      return console.log(await res.text());
    }
    this.setState({
      success: `Sucessfully deleted ${blocks.length} pages. You may have to refresh your page to see the changes`,
      loading: null,
    });
    return console.log(await res.text());
  }

  async getBlocks() {
    console.log("Yum, cookie!, ", this.cookie);
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.notion.so");
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"'
    );
    myHeaders.append("content-type", "application/json");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36"
    );
    myHeaders.append("notion-client-version", "23.7.45");
    myHeaders.append("accept", "*/*");
    myHeaders.append("origin", "https://www.notion.so");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://www.notion.so/");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cookie", this.cookie);

    var raw = JSON.stringify({
      type: "BlocksInSpace",
      query: "",
      filters: {
        isDeletedOnly: true,
        excludeTemplates: false,
        isNavigableOnly: true,
        requireEditPermissions: false,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {},
      },
      sort: "Relevance",
      limit: 100,
      spaceId: await this.getSpaceId(),
      source: "trash",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    let res = await fetch(
      "https://www.notion.so/api/v3/search",
      requestOptions
    );

    if (res.status != 200) return console.log("Error! ", await res.text());

    let results = (await res.json()).results;
    if (results.length) {
      let blocks = [];
      for (const x of results) {
        blocks.push(x.id);
      }
      this.setState({
        loading: `attempting to delete ${blocks.length} items from trash. Sit tight, this might take a bit of time `,
        success: null,
      });
      return this.deleteBlocks(blocks);
    }
    this.setState({
      loading: `Looks like there isn't anything in your trash. If you just deleted something, wait about 10 seconds for the changes to take place in the database`,
      success: null,
    });
  }
  render() {
    return (
      <div
        className="container-fluid d-flex flex-column text-center"
        style={{ padding: " 2em 4em", fontFamily: "Inter" }}
      >
        <h3 className="">Notion Trashman</h3>
        <p style={{ color: "gray" }}>Bulk Notion Trash Deleter</p>
        <p>Click the button below to empty your Notion trash!</p>
        <div
          className=""
          style={buttonStyle}
          onClick={() => {
            this.getBlocks();
          }}
        >
          Empty Trash
        </div>
        {this.state.loading && (
          <p
            style={{
              padding: "1em",
              fontSize: "0.75em",
              backgroundColor: "#e8e7e4",
              color: "#878581",
            }}
          >
            {this.state.loading}
          </p>
        )}
        {this.state.success && (
          <p
            style={{
              padding: "1em",
              fontSize: "0.75em",
              color: "#0f7b6c",
              backgroundColor: "#ddedea",
            }}
          >
            {this.state.success}
          </p>
        )}

        <p style={{ marginTop: "3em" }}></p>
        <p
          style={{
            padding: "1em",
            fontSize: "0.75em",
            color: "#2eaadc",
          }}
        >
          Made with ♥ by a college student and Notion fanboy.
        </p>
        <div>
          <a
            href="https://www.buymeacoffee.com/sakethr"
            style={{ color: "#ffdd00" }}
          >
            Buy me a coffee
          </a>
        </div>
      </div>
    );
  }
}

export default App;
