import React, { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"

interface ResultsT {
    poster_path: string
    title: string
    id: number
    overview: string
    popularity: number
}

function ShowMovies(props: { searchInput: string }) {
    const [searchResults, setSearchResults] = useState<ResultsT[]>([])

    const fetchAndSetResults = (searchInput: string) => {
        if (searchInput.length < 3) {
            let url =
                "https://api.themoviedb.org/3/movie/top_rated?api_key=27480a69331fd8bcf8a619feabaa1001&language=en-US&page=1"
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setSearchResults(data.results.slice(0, 10))
                })
        } else {
            let results: ResultsT[] = [],
                total_pages = 1
            const fetchFun = (page: number) => {
                let url =
                    "https://api.themoviedb.org/3/search/movie?api_key=27480a69331fd8bcf8a619feabaa1001&language=en-US&query=" +
                    searchInput +
                    "&page=" +
                    page +
                    "&include_adult=false"
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        results = results.concat(data.results)
                        total_pages = data.total_pages
                        if (page <= total_pages && page <= 3) {
                            page++
                            fetchFun(page)
                        } else {
                            results = results.filter((item) => item.poster_path !== null)
                            setSearchResults(results)
                        }
                    })
            }
            fetchFun(1)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAndSetResults(props.searchInput)
        }, 1000)
        return () => clearTimeout(timer)
    })

    return (
        <div className="wrapper">
            {searchResults.map((item) => (
                <div className="card">
                    <NavLink
                        to={{
                            pathname: "/details",
                            state: {
                                id: item.id,
                                poster_path: item.poster_path,
                                title: item.title,
                                overview: item.overview,
                                popularity: item.popularity,
                                sendFrom: "movies",
                            },
                        }}
                    >
                        <img
                            className="img"
                            src={"http://image.tmdb.org/t/p/w500/" + item.poster_path}
                            alt=""
                        />
                        <div className="descriptions">
                            <h1>{item.title}</h1>
                            <p>
                                <h4>Overview</h4>
                                {item.overview}
                            </p>
                        </div>
                    </NavLink>
                </div>
            ))}
        </div>
    )
}

export { ShowMovies }
