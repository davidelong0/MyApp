import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  InputGroup,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import "./HomePage.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function HomePage() {
  const [city, setCity] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [map, setMap] = useState(null);
  const [citiesWeather, setCitiesWeather] = useState({});
  const navigate = useNavigate();

  const apiKey = "aa6354ec4cfda784e7dcdf2964902721";
  const cities = ["Milano", "Roma", "Napoli", "Bari"];

  const reviews = [
    { name: "Maria R.", text: "NoFakeTime è il miglior sito meteo che ho trovato. Affidabilità e precisione, sempre!", rating: 5 },
    { name: "Luca P.", text: "Una fantastica app, molto intuitiva e precisa. La consiglio a tutti!", rating: 4 },
    { name: "Giulia T.", text: "Mi trovo benissimo, è davvero utile per pianificare le mie giornate. Ottima qualità!", rating: 5 },
    { name: "Marco F.", text: "Semplice ma molto efficace. La velocità di aggiornamento potrebbe migliorare in alcune zone.", rating: 4 },
    { name: "Elena G.", text: "Perfetta per avere una panoramica rapida del meteo, ma mi piacerebbe avere anche previsioni a lungo termine.", rating: 4 },
  ];

  useEffect(() => {
    cities.forEach((cityName) => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=it`
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Errore nel recuperare i dati meteo.");
          }
        })
        .then((data) => {
          setCitiesWeather((prev) => ({
            ...prev,
            [cityName]: {
              weather: data.weather[0].description,
              temp: data.main.temp,
              icon: data.weather[0].icon,
            },
          }));
        })
        .catch((err) =>
          console.error("Errore nel recuperare il meteo delle città:", err)
        );
    });
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleLocationRequest = () => {
    const isConfirmed = window.confirm("Sei sicuro di voler autorizzare la tua posizione?");
    if (isConfirmed && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=it`)
            .then((res) => {
              if (res.ok) {
                return res.json();
              } else {
                throw new Error("Errore nel recuperare i dati meteo dalla tua posizione.");
              }
            })
            .then((data) => {
              const city = data.name;
              const weather = data.weather[0].description;
              const temp = data.main.temp;
              const icon = data.weather[0].icon;

              setWeatherData({ city, weather, temp, icon });

              if (!map) {
                const leafletMap = L.map("map", {
                  center: [latitude, longitude],
                  zoom: 12,
                });

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap);
                L.marker([latitude, longitude]).addTo(leafletMap).bindPopup(`Sei a ${city}`);
                setMap(leafletMap);
              }
            })
            .catch((err) => console.error("Errore nella geolocalizzazione:", err));
        },
        (error) => console.error("Errore nella geolocalizzazione:", error)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      const updatedHistory = [...new Set([city, ...searchHistory])];
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
      navigate(`/details/${city}`);
      setCity("");
    }
  };

  const handleSearchHistoryClick = (city) => {
    navigate(`/details/${city}`);
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <Container className="text-center text-white">
          <Row className="justify-content-center">
            <Col xs={12} sm={10} md={6} lg={4}>
              <h1 className=" display-4 mb-4" id="rainbow-text">NoFakeTime</h1>
              <h2 className="mb-4">Scopri il meteo in tempo reale, senza sorprese!</h2>
              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Inserisci una città..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="Città"
                    aria-describedby="button-search"
                    className="search-input"
                  />
                  <Button variant="danger" type="submit" id="button-search">
                    <BsSearch size={20} />
                  </Button>
                </InputGroup>
              </Form>

              {searchHistory.length > 0 && (
                <Dropdown className="mt-3">
                  <DropdownButton id="dropdown-basic-button" title="Ricerche recenti">
                    {searchHistory.map((historyCity, index) => (
                      <Dropdown.Item key={index} onClick={() => handleSearchHistoryClick(historyCity)}>
                        {historyCity}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Dropdown>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <div className="reviews-section py-5">
  <Container>
    <Row className="gy-4 justify-content-center text-center"> 
      <Col xs={12} md={6} lg={3} className="review-column d-none d-lg-block"> 
        <h3>Recensioni</h3>
        {reviews.map((review, index) => (
          <div className="review-item" key={index}>
            <p>
              <strong>{review.name}</strong> -{" "}
              <span className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </span>
            </p>
            <p>"{review.text}"</p>
          </div>
        ))}
      </Col>

      <Col xs={12} md={6} lg={3} className="weather-column">
        <h3>Meteo in tempo reale</h3>
        {cities.map((cityName) => (
          <div key={cityName} className="city-weather">
            {citiesWeather[cityName] ? (
              <div>
                <h5>{cityName}</h5>
                <p>{citiesWeather[cityName].weather}</p>
                <p>{citiesWeather[cityName].temp}°C</p>
                <img
                  src={`http://openweathermap.org/img/wn/${citiesWeather[cityName].icon}.png`}
                  alt={citiesWeather[cityName].weather}
                  className="weather-icon"
                />
              </div>
            ) : (
              <p>Caricamento...</p>
            )}
          </div>
        ))}
      </Col>

      <Col xs={12} lg={3} className="tools-column">
        <h3>La tua posizione</h3>
        {userLocation && weatherData ? (
          <div>
            <p><strong>{weatherData.city}</strong></p>
            <p>{weatherData.weather}</p>
            <p>{weatherData.temp}°C</p>
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
              alt="Meteo"
              className="weather-icon"
            />
          </div>
        ) : (
          <p>Posizione e meteo non disponibili.</p>
        )}

        {userLocation && (
          <div id="map" style={{ height: "200px", width: "100%" }}></div>
        )}

        <Button variant="danger" className="mt-3" onClick={handleLocationRequest}>
          Ottieni la tua posizione
        </Button>

        <div className="alert-box mt-3 p-3 text-white rounded">
          Se clicchi questo pulsante, visualizzerai il meteo e la temperatura di dove ti trovi.
        </div>
      </Col>
    </Row>
  </Container>
</div>



      <footer className="footer py-4 text-center text-white">
        <p>© 2025 NoFakeTime - by Davide Longo</p>
        <p>N.B. se è festa non controllare tanto piove</p>
      </footer>
    </div>
  );
}

export default HomePage;
