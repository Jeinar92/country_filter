import { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";

const Country = ({
  filter,
  fullCountry,
  showIndex,
  setShowIndex,
  weather,
  setWeather
}) => {
  const handleOnclick = () => {
    setShowIndex((showIndex) =>
      showIndex === filter.name.official ? null : filter.name.official
    );
  };
  const apiCall = async () => {
    const filterWeather = filter.name.common;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${filterWeather}&appid=70cae6db1894e649fbb044443ac12489`;
    const request = axios.get(apiUrl);
    const response = await request;
    setWeather({
      descp: response.data.weather[0].description,
      temp: response.data.main.temp,
      city: response.data.name,
      humidity: response.data.main.humidity,
      press: response.data.main.pressure
    });
    console.log(weather.descp);
  };
  const temperature = weather.temp - 273.15;
  return (
    <div>
      {!fullCountry ? (
        <div>
          <h2 key={filter.name.official}>
            {filter.name.official}{" "}
            <button
              onClick={() => {
                handleOnclick();
                apiCall();
              }}
            >
              show
            </button>
          </h2>
        </div>
      ) : (
        <div>
          <h2>{filter.name.common}</h2>
          <p>Capital = {filter.capital[0]}</p>
          <p>Area = {filter.area}</p>
          <h3>Languages</h3>
          {Object.values(filter.languages).map((filt) => (
            <Languages lang={filt} />
          ))}
          <img src={filter.flags[0]} alt="Flag" height="100" />
          <h3>Weather in {filter.name.common}</h3>
          <p> {weather.descp} </p>
          <p> temperature {temperature.toFixed(2)} ºC</p>
        </div>
      )}
      {showIndex === filter.name.official ? (
        <div>
          <h2>{filter.name.common}</h2>
          <p>Capital = {filter.capital[0]}</p>
          <p>Area = {filter.area}</p>
          <h3>Languages</h3>
          {Object.values(filter.languages).map((filt) => (
            <Languages lang={filt} />
          ))}
          <img src={filter.flags[0]} alt="Flag" height="100" />
          <h3>Weather in {filter.name.common}</h3>
          <p> {weather.descp} </p>
          <p> temperature {temperature.toFixed(2)} ºC</p>
        </div>
      ) : (
        " "
      )}
    </div>
  );
};
const Languages = ({ lang }) => <p>{lang}</p>;

export default function App() {
  const [filter, setNewFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(" ");
  const [showData, setShowData] = useState(false);
  const [fullCountry, setFullCountry] = useState(false);
  const [showIndex, setShowIndex] = useState(null);
  const [weather, setWeather] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.com/v3/all").then((response) => {
      const { data } = response;
      setData([...data]);
      setFiltered([...data]);
      console.log(data);
    });
  }, []);

  const handleOnChangeFilter = (event) => {
    setNewFilter(event.target.value);
  };
  const submitFilter = () => {
    setFiltered([...data]);
    const filterCountrys = filtered.filter((country) =>
      country.name.official.toLowerCase().includes(filter.toLowerCase())
    );
    if (filterCountrys.length > 10) {
      alert("Too many matches, specify another filter");
      resetFilter();
    } else if (filterCountrys.length <= 0) {
      alert("Couldn't find any country, please try again");
      resetFilter();
    } else if (filterCountrys.length === 1) {
      setFullCountry(true);
      setShowData(true);
      setFiltered([...filterCountrys]);
    } else if (filterCountrys.length > 1 && filterCountrys.length <= 10) {
      setShowData(true);
      setFiltered([...filterCountrys]);
    }
  };
  const apiCall = async () => {
    const filterCountrys = filtered.filter((country) =>
      country.name.official.toLowerCase().includes(filter.toLowerCase())
    );
    const filterWeather = filterCountrys.map((country) => country.name.common);
    if (filterCountrys.length === 1) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${filterWeather}&appid=70cae6db1894e649fbb044443ac12489`;
      const request = axios.get(apiUrl);
      const response = await request;
      setWeather({
        descp: response.data.weather[0].description,
        temp: response.data.main.temp,
        icon: response.data.weather.icon
      });
    }
  };
  const resetFilter = () => {
    setFullCountry(false);
    setShowData(false);
    setFiltered([...data]);
    setMessage(" ");
  };
  return (
    <div className="App">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitFilter();
          apiCall();
        }}
      >
        find countrys :{" "}
        <input type="text" onChange={handleOnChangeFilter} value={filter} />
        <button type="button" onClick={resetFilter}>
          Reset filter
        </button>
      </form>
      <p> {message} </p>
      {!showData
        ? " "
        : filtered.map((filt) => (
            <Country
              filter={filt}
              fullCountry={fullCountry}
              setShowIndex={setShowIndex}
              showIndex={showIndex}
              weather={weather}
              setWeather={setWeather}
            />
          ))}
    </div>
  );
}
