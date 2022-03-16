import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import uuid from 'react-uuid';

const Home = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seachValue, setSeachValue] = useState('');
  const [seachData, setSeachData] = useState();

  useEffect(() => {
    var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(localStorage.getItem(keys[i]));
    }

    let parsedData = values.map((data) => JSON.parse(data));
    setData(parsedData);
  }, []);

  useEffect(() => {
    setShow(false);
    data.map((d) => {
      d.title.includes(seachValue) &&
        setSeachData({ title: d.title, description: d.description });
    });
  }, [seachValue]);

  useEffect(() => {
    setTimeout(() => {
      setSeachData(null);
    }, 10000);
  }, [seachData]);

  function handleSubmit(e) {
    e.preventDefault();
    let id = uuid();
    localStorage.setItem(
      id,
      JSON.stringify({ id: id, title: title, description: description })
    );
    setData((prev) => [...prev, { id, title, description }]);
    setTitle('');
    setDescription('');
  }

  function handleChange(e) {
    if (e.target.name === 'title') {
      setTitle(e.target.value);
    } else if (e.target.name === 'description') {
      setDescription(e.target.value);
    }
  }

  function deleted(id) {
    localStorage.removeItem(id);
    let newData = data.filter((d) => {
      return d.id !== id;
    });
    setData(newData);
  }
  const handleEnter = (event) => {
    if (event.key.toLowerCase() === 'enter') {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>NOTES KEEPER</div>
        <input
          className={styles.searchBar}
          placeholder="search"
          onChange={(e) => setSeachValue(e.target.value)}
          type="text"
        />

        <img
          onClick={() => (show ? setShow(false) : setShow(true))}
          className={show ? styles.rotate : styles.addBtn}
          src="addBtn.png"
          alt=""
        />
      </nav>

      <div className={show ? styles.inputContainer : styles.hide}>
        <div className={styles.inputSection}>
          <form onSubmit={handleSubmit} className={styles.inputForm}>
            <input
              className={styles.inputTitle}
              placeholder="TITLE"
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <textarea
              rows={4}
              className={styles.inputDescription}
              placeholder="DESCRIPTION"
              type="text"
              name="description"
              value={description}
              onChange={handleChange}
            />
            <button className={styles.inputButton} type="submit">
              SAVE
            </button>
          </form>
        </div>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.cardsSection}>
          {seachValue.length > 0 && seachData && (
            <div className={styles.card}>
              <div className={styles.cardTitle}>{seachData.title}</div>
              <div className={styles.cardDescription}>
                {seachData.description}
              </div>
              <button
                // onClick={() => deleted(d.id)}
                className={styles.cardButton}
              >
                DELETE
              </button>
            </div>
          )}
          {seachValue.length === 0 &&
            data.map((d) => {
              return (
                <div key={d.id} className={styles.card}>
                  <div className={styles.cardTitle}>{d.title}</div>
                  <div className={styles.cardDescription}>{d.description}</div>
                  <button
                    onClick={() => deleted(d.id)}
                    className={styles.cardButton}
                  >
                    DELETE
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Home;
