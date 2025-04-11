import { useParams, Link } from "react-router-dom"; 
import { useEffect, useState } from "react";
import "./DetailsPage.css";

function DetailsPage() {
  const { city } = useParams();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [pexelsImage, setPexelsImage] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = "aa6354ec4cfda784e7dcdf2964902721"; 
  const PEXELS_API_KEY = "Sh6ByCO0aDMljM04YanJQevMPdzlWwOmU7ZmKRJ0HqzRRVxT4wX07lih"; 

  const weatherBackgrounds = {
    clear: "https://media.istockphoto.com/id/824800468/it/foto/sole-sul-cielo-blu-con-nuvole.jpg?s=612x612&w=0&k=20&c=D7v9p-mOZEMZ6flMIw9ZhfksMxMi5sSz6A-ulHzTbYI=",
    clouds: "https://media.istockphoto.com/id/1503488794/it/foto/panorama-di-bellissime-nuvole-sfondo-di-un-cielo-grigio-e-nuvola.jpg?s=612x612&w=0&k=20&c=osKNNz2bMRxWa8xPEXpRRAMaUqmFiUCZUEGqKmlXr7Y=",
    rain: "https://lucarota.com/wp-content/uploads/2022/08/1643745018_19-abrakadabra-fun-p-serii-dozhdlivii-fon-30.jpg",
    snow: "https://media.istockphoto.com/id/863513024/it/foto/scena-invernale-nevicate-sullo-sfondo-sfocato.jpg?s=612x612&w=0&k=20&c=06hTuK5gWMeQX5zz2SJuJ6W3C4s_XoDSxdExY5vhevk=",
    hail: "https://media.istockphoto.com/id/2149140135/it/foto/danni-da-grandinata.jpg?s=612x612&w=0&k=20&c=3LjdN-jFD58v5Jp0FVaAq-y6XuRQWKiw_1mPQKgQYnY=",
    thunderstorm: "https://img.pikbest.com/wp/202405/stun-stunning-blue-lightning-display-in-the-sky_9857500.jpg!w700wp",
  };

  useEffect(() => {
  
    if (!city) return;

 
    setWeather(null);
    setPexelsImage(null);
    setError(null);
    setForecast([]);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
      .then((res) => {
        if (!res.ok) throw new Error("Città non trovata");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setError(null);
      })
      .catch((err) => {
        setWeather(null);
        setError(err.message);
      });

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nella previsione");
        return res.json();
      })
      .then((data) => {
        const filtered = data.list.filter(f => f.dt_txt.includes("12:00:00"));
        setForecast(filtered);
      });


    const searchQuery = `${city} city`;
    fetch(`https://api.pexels.com/v1/search?query=${searchQuery}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.photos && data.photos.length > 0) {
          setPexelsImage(data.photos[0].src.original);
        } else {
          setPexelsImage(null);
        }
      });
  }, [city]); 

  const getBackgroundUrl = () => {
    if (weather) {
      const mainCondition = weather.weather[0].main.toLowerCase();
      return weatherBackgrounds[mainCondition] || weatherBackgrounds.clear;
    }
    return weatherBackgrounds.clear;
  };

  return (
    <div
      style={{
        backgroundImage: `url(${getBackgroundUrl()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        height: '100vh',
        color: 'white',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          zIndex: 1,
        }}
      ></div>

      <div className="container mt-5 position-relative z-2" style={{ zIndex: 2 }}>
        <h1 className="text-center">Meteo a {city}</h1>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row justify-content-center">
          {pexelsImage ? (
            <div className="col-12 mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={pexelsImage}
                alt={`Immagine di ${city}`}
                className="img-fluid rounded"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  maxHeight: '300px',
                }}
              />
            </div>
          ) : (
            <div className="col-12 mb-4 text-center">
              <p>Immagine della città non presente nel database</p>
            </div>
          )}

          {weather && (
            <div className="col-12 col-md-6">
              <div
                className="card p-3"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  textAlign: 'center',
                }}
              >
                <h3>{weather.name}, {weather.sys.country}</h3>
                <p>🌡️ Temperatura: {weather.main.temp}°C</p>
                <p>🌥️ Condizione: {weather.weather[0].description}</p>
                <p>💧 Umidità: {weather.main.humidity}%</p>
                <p>💨 Vento: {weather.wind.speed} m/s</p>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Icona meteo"
                  className="img-fluid mx-auto"
                  style={{ maxWidth: '50px', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          )}
        </div>

        {forecast.length > 0 && (
          <div className="mt-5">
            <h4 className="text-center">🌤️ Previsioni per i prossimi 5 giorni</h4>
            <div className="row justify-content-center mt-3">
              {forecast.map((item, idx) => (
                <div key={idx} className="col-12 col-md-2 mb-4">
                  <div
                    className="card p-3 text-center"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    <p><strong>{item.dt_txt.split(" ")[0]}</strong></p>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt="Icona meteo"
                      className="img-fluid mx-auto"
                      style={{ maxWidth: '50px', height: 'auto', display: 'block' }}
                    />
                    <p>{item.main.temp.toFixed(1)}°C</p>
                    <p>{item.weather[0].main}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-4 mb-5">
          <Link to="/" className="btn btn-dark custom-btn" style={{ backgroundColor: '#333', padding: '10px 20px' }}>
            Torna alla pagina di ricerca
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
