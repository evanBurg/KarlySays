import React from "react";
import "./App.css";
import Quotes from "./quotes.json";
import { motion, AnimatePresence } from "framer-motion";

const fonts = [
  "'Indie Flower', cursive",
  "'Pacifico', cursive",
  "'Amatic SC', cursive",
  "'Permanent Marker', cursive",
  "'Courgette', cursive",
  "'Gloria Hallelujah', cursive",
  "'Patrick Hand', cursive",
  "'Neucha', cursive",
  "'Gochi Hand', cursive",
  "'Architects Daughter', cursive",
  "'Shadows Into Light Two', cursive",
  "'Rock Salt', cursive",
  "'Covered By Your Grace', cursive",
  "'Pangolin', cursive",
  "'Berkshire Swash', cursive"
];

window.album = {
  id:
    "AHMXd8K0ZMnHarIdCL1pfA3lRtgVdugw4yITt14VReFK6WPFfsrr_61LXjiPzNesarDwzLUYzJju",
  title: "Karly New",
  productUrl:
    "https://photos.google.com/lr/album/AHMXd8K0ZMnHarIdCL1pfA3lRtgVdugw4yITt14VReFK6WPFfsrr_61LXjiPzNesarDwzLUYzJju",
  mediaItemsCount: "1647",
  coverPhotoBaseUrl:
    "https://lh3.googleusercontent.com/lr/AGWb-e7jR1-vDPsr6naAxQxljKHhxiQuq7JSZ1RT6xAKrOgsGm1vYOSeanq-M6PMYVmR07eDuJKjKx9GuY1F_DRvFi-9yoTUbO2q2fjrU_q_VcrmFupvlucTFhaAHWW-EnmnOl9lpEX9-K9uwhRrfAIk56DoO1ZFzgvdALWj7Ga0IvZPMG0QahzAMdIycg6ntEFei_e5vtVh1legC5LNTCvcY2Z9_TEPWoHDwfaA0_-NHl-kU3rE9SZb7EyJFYaL4yyiOGhci2zjJI0ircTm4DRHgWGGlKJYSwjknD4HfjoEbSH1lrgnfurflnHna0J-lly5NBP5tfyzNao-CmY57Iv-aGMsFwpjcqfzLBEM92c-INPAZ6ZewWcbDmPsu2dbbqSjcv20ihHDlSFfL2sZAWEMwNo4mmkGhFb0leKnMSHnbzipnO8T0ZVkZiGTkL454V0xP4N4H-AxgSNpfqYMuAAoP6Y55yNQCIPUESkM1Y8BZxBzc1FiNxms2HnNWiHU2lgXixlMRuGpY3SrSsEgXl1JO24w_xBDlEevk6wKHZCjDi2IuuDzvyy_reVM2aU1_NvzkioiqCCCayTXhfvxeZlI2nj819ieoBAYpnf1TVE2si5gHnhMxj-j3FkMG8JLOdCmGkKh9VIW50XG_BbH7EXkD5Q5OFZjiVmc69rKm0CvV4RQ2dkBogLE7RAP_wVn6w_GoK7G9Hi5UQ",
  coverPhotoMediaItemId:
    "AHMXd8ImhyBppRvAYyjGVcgEKPiuPub7iEFW0Me5SywaK4rPaSMGNKpVJKNtSNTIxbl6kJoJLx0-9T1OcbiO59pNaJ2Xa0OmvA"
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: this.chooseRandomQuote(),
      font: this.chooseRandomFont(),
      album: [],
      signedIn: false,
      counter: 0,
      transitioning: false,
      transitioningTo: {
        quote: "",
        font: "",
        image: ""
      }
    };

    window.setReactSignIn = this.setSignedIn;
    window.loadAlbum = this.getAlbum;
  }

  setSignedIn = signedIn => {
    this.setState({
      signedIn
    });
  };

  getAlbum = callback => {
    const reactThis = this;
    if (window.authenticated) {
      try {
        window.gapi.client.photoslibrary.mediaItems
          .search({
            resource: {
              albumId:
                "AHMXd8K0ZMnHarIdCL1pfA3lRtgVdugw4yITt14VReFK6WPFfsrr_61LXjiPzNesarDwzLUYzJju",
              pageSize: 100
            }
          })
          .then(
            function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
              reactThis.setState(
                { album: response.result.mediaItems },
                callback
              );
            },
            function(err) {
              console.error("Execute error", err);
            }
          );
      } catch (e) {
        console.error(e);
      }
    }
  };

  responseGoogle = response => {
    localStorage.setItem("token", JSON.stringify(response));
    this.forceUpdate();
  };

  failure = response => {
    console.log(response);
  };

  chooseRandomQuote = () => Quotes[Math.floor(Math.random() * Quotes.length)];
  chooseRandomFont = () => fonts[Math.floor(Math.random() * fonts.length)];
  chooseRandomImage = () =>
    this.state.album[Math.floor(Math.random() * this.state.album.length)];

  finishTransition = () => {
    setTimeout(() => {
      this.setState({
        ...this.state.transitioningTo,
        transitioningTo: {
          quote: "",
          font: "",
          image: ""
        },
        transitioning: false,
        counter: this.state.counter + 1
      });
    }, 1000);
  };

  preloadImage = (url, callback) => {
    var img = new Image();
    img.src = url;
    img.onload = callback;
  };

  setRandomQuote = async () => {
    if (!this.state.transitioning) {
      const image = this.chooseRandomImage();
      //Pre fetch image
      this.preloadImage(
        `${image.baseUrl}=w${image.mediaMetadata.width}-h${
          image.mediaMetadata.height
        }`,
        () => {
          this.setState(
            {
              transitioning: true,
              transitioningTo: {
                quote: this.chooseRandomQuote(),
                font: this.chooseRandomFont(),
                image
              }
            },
            this.finishTransition
          );
        }
      );
    }
  };

  authenticate = () => {};

  componentDidMount = async () => {
    setInterval(this.setRandomQuote, 5000);
    setInterval(this.getAlbum, 1024 * 60 * 5);

    window.onbeforeunload = function(e) {
      //localStorage.removeItem('token')
    };
  };

  image = {
    initial: {
      y: -200
    },
    mounted: {
      y: 0
    },
    exit: {
      y: 200
    }
  };

  quote = {
    initial: {
      x: -200,
      opacity: 0
    },
    mounted: {
      x: 0,
      opacity: 1
    },
    exit: {
      x: 200,
      opacity: 0
    }
  };

  render() {
    if (!this.state.signedIn) {
      return (
        <div className="App">
          <header className="App-header">
            <button
              onClick={() => window.authenticate().then(window.loadClient)}
            >
              Login
            </button>
          </header>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <AnimatePresence>
            {this.state.image && !this.state.transitioning && (
              <motion.img
                key={`image-${this.state.counter}`}
                variants={this.image}
                initial="initial"
                animate="mounted"
                exit="exit"
                transition={{ type: "inertia", velocity: 200 }}
                src={`${this.state.image.baseUrl}=w${
                  this.state.image.mediaMetadata.width
                }-h${this.state.image.mediaMetadata.height}`}
                alt="bg"
                style={{
                  position: "absolute",
                  width: "100%",
                }}
              />
            )}
          </AnimatePresence>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "-webkit-fill-available",
              justifyContent: "center",
              alignItems: "center",
              verticalAlign: "middle",
              overflow: "hidden"
            }}
          >
            <AnimatePresence>
              {!this.state.transitioning && (
                <motion.p
                  key={`quote-${this.state.counter}`}
                  variants={this.quote}
                  initial="initial"
                  animate="mounted"
                  exit="exit"
                  transition={{
                    duration: 1
                  }}
                  style={{
                    zIndex: 2,
                    whiteSpace: "pre-wrap",
                    textAlign: "center",
                    fontSize: "6em",
                    maxWidth: "80%",
                    maxHeight: "95%",
                    fontFamily: this.state.font
                  }}
                >
                  {this.state.quote}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </React.Fragment>
      );
    }
  }
}

export default App;
