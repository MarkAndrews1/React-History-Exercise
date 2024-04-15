import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */



function JokeList({numJokesToGet = 5}) {
  const [ jokes, setJokes ] = useState([])
  const [loading, setLoading] = useState(true)

  /* retrieve jokes from API */

  useEffect(function(){
    async function getJokes(){
      let seenJokes = new Set();
      let j = [...jokes]
      try{
        while (j.length < numJokesToGet){
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });

          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            j.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }

        setJokes(j)
        setLoading(false)
      } catch(err){
        console.error('Error fetching joke:', err)
      }
    }

    if(jokes.length === 0) getJokes()
  }, [jokes, numJokesToGet])



  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    setLoading(true);
    setJokes([])
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    setJokes(jokes => jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    )};

  if(loading){
    return(
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    )
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    
  return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(({id, joke, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
}

export default JokeList;
