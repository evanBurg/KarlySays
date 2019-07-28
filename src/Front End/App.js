import React from "react";
import "./App.css";
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

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quote: this.chooseRandomQuote(true),
      font: this.chooseRandomFont(),
      image: this.chooseRandomImage(),
      availableQuotes:  JSON.parse(JSON.stringify(props.quotes)),
      signedIn: false,
      counter: 0,
      transitioning: false,
      transitioningTo: {
        quote: "",
        font: "",
        image: ""
      }
    };
  }

  chooseRandomQuote = (initial) => {
    if(initial){
      return this.props.quotes[Math.floor(Math.random() * this.props.quotes.length)]
    }


    let {availableQuotes} = this.state;
    const index = Math.floor(Math.random() * this.state.availableQuotes.length);
    const quote = availableQuotes[index];
    availableQuotes.splice(index, 1);

    if(availableQuotes.length === 0){
      let newQuotes = JSON.parse(JSON.stringify(this.props.quotes));
      newQuotes.splice(newQuotes.indexOf(quote), 1);
      this.setState({
        availableQuotes: newQuotes
      })
    }else{
      this.setState({
        availableQuotes
      });
    }

    return quote;
  };
  chooseRandomFont = () => fonts[Math.floor(Math.random() * fonts.length)];
  chooseRandomImage = () =>
    this.props.album[Math.floor(Math.random() * this.props.album.length)];

  finishTransition = () => {
    setTimeout(() => {
      this.setState(
        {
          ...this.state.transitioningTo,
          transitioningTo: {
            quote: "",
            font: "",
            image: ""
          },
          transitioning: false,
          counter: this.state.counter + 1
        },
        this.setRandomQuote
      );
    }, 1000);
  };

  preloadImage = (url, callback) => {
    var img = new Image();
    img.src = url;
    img.onload = callback;
    img.onerror = this.setRandomQuote();
  };

  setRandomQuote = async () => {
    setTimeout(() => {
      if (!this.state.transitioning) {
        const image = this.chooseRandomImage();
        if (image) {
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
      }
    }, 10000);
  };

  componentDidMount = async () => {
    this.setRandomQuote();
    setInterval(window.loadAlbum, 1000 * 60 * 60 * 3);
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
                width: "100%"
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
                className="quote"
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
                  fontSize: "6vh",
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

const Login = props => {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => window.authenticate().then(window.loadClient)}>
          Login
        </button>
      </header>
    </div>
  );
};

const Loader = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200px"
    height="200px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style={{ background: "none" }}
  >
    <g transform="rotate(347.512 50 50)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="360 50 50;0 50 50"
        keyTimes="0;1"
        dur="1s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.5 0 0.5 1"
        begin="-0.15000000000000002s"
      />
      <circle
        cx="50"
        cy="50"
        r="39.891"
        stroke="#ffffff"
        strokeWidth="14.4"
        fill="none"
        stroke-dasharray="0 300"
      >
        <animate
          attributeName="stroke-dasharray"
          values="15 300;82.71203987927132 300;15 300"
          keyTimes="0;0.5;1"
          dur="1s"
          repeatCount="indefinite"
          calcMode="linear"
          keySplines="0 0.4 0.6 1;0.4 0 1 0.6"
          begin="-0.069s"
        />
      </circle>
      <circle
        cx="50"
        cy="50"
        r="39.891"
        stroke="#000000"
        strokeWidth="7.2"
        fill="none"
        stroke-dasharray="0 300"
      >
        <animate
          attributeName="stroke-dasharray"
          values="15 300;82.71203987927132 300;15 300"
          keyTimes="0;0.5;1"
          dur="1s"
          repeatCount="indefinite"
          calcMode="linear"
          keySplines="0 0.4 0.6 1;0.4 0 1 0.6"
          begin="-0.069s"
        />
      </circle>
      <circle
        cx="50"
        cy="50"
        r="32.771"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        stroke-dasharray="0 300"
      >
        <animate
          attributeName="stroke-dasharray"
          values="15 300;67.94906768152214 300;15 300"
          keyTimes="0;0.5;1"
          dur="1s"
          repeatCount="indefinite"
          calcMode="linear"
          keySplines="0 0.4 0.6 1;0.4 0 1 0.6"
          begin="-0.069s"
        />
      </circle>
      <circle
        cx="50"
        cy="50"
        r="47.171"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
        stroke-dasharray="0 300"
      >
        <animate
          attributeName="stroke-dasharray"
          values="15 300;99.05083495206111 300;15 300"
          keyTimes="0;0.5;1"
          dur="1s"
          repeatCount="indefinite"
          calcMode="linear"
          keySplines="0 0.4 0.6 1;0.4 0 1 0.6"
          begin="-0.069s"
        />
      </circle>
    </g>

    <g transform="rotate(359.995 50.0789 50.0789)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="360 50 50;0 50 50"
        keyTimes="0;1"
        dur="1s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.5 0 0.5 1"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M97.2,50.1c0,6.1-1.2,12.2-3.5,17.9l-13.3-5.4c1.6-3.9,2.4-8.2,2.4-12.4"
      />
      <path
        fill="#000000"
        d="M93.5,49.9c0,1.2,0,2.7-0.1,3.9l-0.4,3.6c-0.4,2-2.3,3.3-4.1,2.8l-0.2-0.1c-1.8-0.5-3.1-2.3-2.7-3.9l0.4-3 c0.1-1,0.1-2.3,0.1-3.3"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M85.4,62.7c-0.2,0.7-0.5,1.4-0.8,2.1c-0.3,0.7-0.6,1.4-0.9,2c-0.6,1.1-2,1.4-3.2,0.8c-1.1-0.7-1.7-2-1.2-2.9 c0.3-0.6,0.5-1.2,0.8-1.8c0.2-0.6,0.6-1.2,0.7-1.8"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M94.5,65.8c-0.3,0.9-0.7,1.7-1,2.6c-0.4,0.9-0.7,1.7-1.1,2.5c-0.7,1.4-2.3,1.9-3.4,1.3h0 c-1.1-0.7-1.5-2.2-0.9-3.4c0.4-0.8,0.7-1.5,1-2.3c0.3-0.8,0.7-1.5,0.9-2.3"
      />
    </g>
    <g transform="rotate(347.512 50 50)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="360 50 50;0 50 50"
        keyTimes="0;1"
        dur="1s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.5 0 0.5 1"
        begin="-0.15000000000000002s"
      />
      <path
        fill="#000000"
        stroke="#000000"
        d="M86.9,35.3l-6,2.4c-0.4-1.2-1.1-2.4-1.7-3.5c-0.2-0.5,0.3-1.1,0.9-1C82.3,33.8,84.8,34.4,86.9,35.3z"
      />
      <path
        fill="#000000"
        stroke="#000000"
        d="M87.1,35.3l6-2.4c-0.6-1.7-1.5-3.3-2.3-4.9c-0.3-0.7-1.2-0.6-1.4,0.1C88.8,30.6,88.2,33,87.1,35.3z"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M82.8,50.1c0-3.4-0.5-6.8-1.6-10c-0.2-0.8-0.4-1.5-0.3-2.3c0.1-0.8,0.4-1.6,0.7-2.4c0.7-1.5,1.9-3.1,3.7-4l0,0 c1.8-0.9,3.7-1.1,5.6-0.3c0.9,0.4,1.7,1,2.4,1.8c0.7,0.8,1.3,1.7,1.7,2.8c1.5,4.6,2.2,9.5,2.3,14.4"
      />
      <path
        fill="#000000"
        d="M86.3,50.2l0-0.9l-0.1-0.9l-0.1-1.9c0-0.9,0.2-1.7,0.7-2.3c0.5-0.7,1.3-1.2,2.3-1.4l0.3,0 c0.9-0.2,1.9,0,2.6,0.6c0.7,0.5,1.3,1.4,1.4,2.4l0.2,2.2l0.1,1.1l0,1.1"
      />
      <path
        fill="#ff0000"
        d="M93.2,34.6c0.1,0.4-0.3,0.8-0.9,1c-0.6,0.2-1.2,0.1-1.4-0.2c-0.1-0.3,0.3-0.8,0.9-1 C92.4,34.2,93,34.3,93.2,34.6z"
      />
      <path
        fill="#ff0000"
        d="M81.9,38.7c0.1,0.3,0.7,0.3,1.3,0.1c0.6-0.2,1-0.6,0.9-0.9c-0.1-0.3-0.7-0.3-1.3-0.1 C82.2,38,81.8,38.4,81.9,38.7z"
      />
      <path
        fill="#000000"
        d="M88.5,36.8c0.1,0.3-0.2,0.7-0.6,0.8c-0.5,0.2-0.9,0-1.1-0.3c-0.1-0.3,0.2-0.7,0.6-0.8C87.9,36.3,88.4,36.4,88.5,36.8z"
      />
      <path
        stroke="#000000"
        d="M85.9,38.9c0.2,0.6,0.8,0.9,1.4,0.7c0.6-0.2,0.9-0.9,0.6-2.1c0.3,1.2,1,1.7,1.6,1.5c0.6-0.2,0.9-0.8,0.8-1.4"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M86.8,42.3l0.4,2.2c0.1,0.4,0.1,0.7,0.2,1.1l0.1,1.1c0.1,1.2-0.9,2.3-2.2,2.3c-1.3,0-2.5-0.8-2.5-1.9l-0.1-1 c0-0.3-0.1-0.6-0.2-1l-0.3-1.9"
      />
      <path
        fill="#ffffff"
        stroke="#000000"
        d="M96.2,40.3l0.5,2.7c0.1,0.5,0.2,0.9,0.2,1.4l0.1,1.4c0.1,1.5-0.9,2.8-2.2,2.9h0c-1.3,0-2.5-1.1-2.6-2.4 L92.1,45c0-0.4-0.1-0.8-0.2-1.2l-0.4-2.5"
      />
      <path
        fill="#000000"
        d="M91.1,34.1c0.3,0.7,0,1.4-0.7,1.6c-0.6,0.2-1.3-0.1-1.6-0.7c-0.2-0.6,0-1.4,0.7-1.6C90.1,33.1,90.8,33.5,91.1,34.1z"
      />
      <path
        fill="#000000"
        d="M85.5,36.3c0.2,0.6-0.1,1.2-0.7,1.5c-0.6,0.2-1.3,0-1.5-0.6C83,36.7,83.4,36,84,35.8C84.6,35.5,85.3,35.7,85.5,36.3z"
      />
    </g>
  </svg>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      loading: true,
      album: [],
      quotes: []
    };

    window.setReactSignIn = this.setSignedIn;
    window.setLoading = this.setLoading;
    window.loadAlbum = this.getAlbum;
  }

  photoSearch = filter =>
    window.gapi.client.photoslibrary.mediaItems.search({ resource: filter });

  getAlbum = (callback, pageToken) => {
    const reactThis = this;
    reactThis.setLoading(true);
    if (window.authenticated) {
      this.photoSearch({
        albumId:
          "AHMXd8K0ZMnHarIdCL1pfA3lRtgVdugw4yITt14VReFK6WPFfsrr_61LXjiPzNesarDwzLUYzJju",
        pageSize: 100,
        pageToken: pageToken
      }).then(function(response) {
        console.log("Response", response);

        reactThis.setState({album: [...reactThis.state.album, ...response.result.mediaItems]});

        if(response.result.nextPageToken){
          reactThis.getAlbum(undefined, response.result.nextPageToken);
        }else{
          reactThis.setLoading(false);
          if(callback)
            callback();
        }
      });
    }
  };

  setSignedIn = signedIn => {
    this.setState({
      signedIn
    });
  };

  setLoading = loading => this.setState({ loading });

  componentDidMount = async () => {
    let res = await fetch("/quotes");
    if(res.ok){
      this.setState({
        quotes: await res.json()
      })
    }
  }

  render() {
    if (this.state.loading)
      return (
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
          <Loader />
        </div>
      );

    if (!this.state.signedIn) {
      return <Login setLoading={this.setLoading} />;
    } else {
      return (
        <Slideshow album={this.state.album} quotes={this.state.quotes} setLoading={this.setLoading} />
      );
    }
  }
}

export default App;
