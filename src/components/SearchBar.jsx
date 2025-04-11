import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup, Dropdown } from "react-bootstrap";

function SearchBar() {
  const [city, setCity] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (city.trim() !== "") {
      
      const updatedHistory = [...searchHistory];
      if (!updatedHistory.includes(city)) {
        updatedHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
        setSearchHistory(updatedHistory); 
      }

      navigate(`/details/${city}`);
      setCity(""); 
    }
  };

  const handleSelectHistory = (selectedCity) => {

    navigate(`/details/${selectedCity}`);
    setCity(""); 
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <Form onSubmit={handleSubmit} className="my-4">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Inserisci una città..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Cerca
              </Button>
            </InputGroup>
          </Form>

          {searchHistory.length > 0 && (
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-history">
                Ricerche Recenti
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {searchHistory.map((item, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleSelectHistory(item)}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

