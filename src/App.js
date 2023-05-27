import { useState, useEffect, useRef } from "react";
import FlashcardList from "./components/FlashcardList";
import Loading from "./components/Loading";
import axios from 'axios';
import { moonIcon, sunIcon } from "./components/Icons";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();
  const categories = useRef([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = [
        axios.get('https://opentdb.com/api.php?amount=10'),
        axios.get('https://opentdb.com/api_category.php')
      ];
      const responses = await Promise.all(promises);
      responses.forEach((response) => {
          if (response.data.trivia_categories !== undefined)
            categories.current = response.data.trivia_categories;
          else 
            setFlashcards(response.data.results);
          });
      setLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value
        }
      })
      .then((data) => {
        setFlashcards(data.data.results);
        setLoading(false);
      });
  }

  const toggleTheme = (e) => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') {
        // document.body.style.background = '#0f0d0e';
        return 'dark';
      }
      else {
        /* document.body.style.background = '#f9f4da' */
        return 'light';
      }
    });
  }

  return (
    <div className={theme}>
    { 
    (loading) ? <Loading /> :
      <div>
        <form className="header" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id='category' ref={categoryEl}>
              {categories.current !== undefined 
                && categories.current.map((option) => <option value={option.id} key={option.id}>{option.name}</option>)
              }
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="amount">Number Of Questions</label>
            <input type='number' id='amount' min='1' step='1' defaultValue='10' ref={amountEl}></input>
          </div>
          <div className="form-group row">
            <button type='button' className="btn secondary" onClick={(e) => toggleTheme(e)}>{theme === 'light' ? moonIcon : sunIcon}</button>
            <button className="btn primary" type="submit">Generate</button>
          </div>
        </form>
        <div className="App container">
          <FlashcardList flashcards={flashcards}/>
        </div>
      </div>
    }
    </div>
  );
}

export default App;
