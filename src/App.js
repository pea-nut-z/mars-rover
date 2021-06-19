import logo from "./logo.svg";
import "./App.css";

function App() {
  // const getTodayDateString = () => {
  //   const date = new Date();
  //   const year = date.getUTCFullYear();
  //   const month = date.getUTCMonth() + 1;
  //   const day = date.getUTCDate() - 1;
  //   return `${year}-${month}-${day}`;
  // };

  // const currentDate = getTodayDateString();
  // console.log({ currentDate });
  const monthsWith30Days = [];
  const date = new Date();
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day = date.getUTCDate() - 1;

  console.log(typeof year);

  // const getPhotos = (year, month, day) => {

  //   const API_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2021-6-16&page=1&api_key=${process.env.REACT_APP_API_KEY}`;
  //   fetch(API_URL)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.photos.length === 0) {
  //         if(day === 1 && )
  //         day ===
  //         day = day - 1

  //       }
  //       console.log();
  //     });
  // };

  // getPhotos(year, month, day);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
