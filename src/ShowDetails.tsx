import React, { useState } from 'react';
import { NavLink, } from "react-router-dom";
import ReactPlayer from 'react-player';
import goBack from './Icons/left-arrow.png'

interface LocationT {
    location: {
        pathname: string,
        state: {
            id: number,
            name: string,
            poster_path: string,
            title: string,
            overview: string,
            sendFrom: string
        }
    }
}

interface VideosT {
    key: string
}


function ShowDetails(props: LocationT) {
    const [keyVideo, setKey] = useState("");
    const { poster_path, title, overview, id, sendFrom } = props.location.state;
    let reusltsV: VideosT[] = []; let playerIMG; let urlFirstPart = ""; let urlsecondPart = ""; let backPath = "";

    if (sendFrom === "movies") {
        urlFirstPart = "https://api.themoviedb.org/3/movie/";
        urlsecondPart = "/videos?api_key=27480a69331fd8bcf8a619feabaa1001&language=en-US";
        backPath = "/movies";
    } else {
        urlFirstPart = "https://api.themoviedb.org/3/tv/";
        urlsecondPart = "/videos?api_key=27480a69331fd8bcf8a619feabaa1001&language=en-US";
        backPath = "/tvshows";
    }

    const fetchVideo = () => {
        let url = urlFirstPart + id + urlsecondPart;

        fetch(url)
            .then(response => response.json())
            .then(data => {

                reusltsV = data.results;
                if (reusltsV.length !== 0) {
                    setKey(reusltsV[0].key);
                }


            });
    }
    fetchVideo();

    if (keyVideo !== "") {
        let urlVideo = "https://www.youtube.com/watch?v=" + keyVideo;
        playerIMG = <div className="ImgDivD">
            <ReactPlayer url={urlVideo} className="ImageD" width="100%" height="100%" controls={true} />
        </div>
    } else {
        playerIMG = <div className="ImgDivD">
            <img className="ImageD"
                src={"http://image.tmdb.org/t/p/w500/" + poster_path} alt="" />
        </div>
    }

    return (
        <div className="ShowDetails">
            <NavLink to={backPath}>
                <div className="GoBack">
                    <img className="GoBackIMG" src={goBack} alt="" />
                </div></NavLink>
            {playerIMG}
            <div>
                <div className="ItemTitleD">
                    <h3>{title}</h3>
                </div>
                <div className="Overview">
                    <h3>Overview</h3>
                    <p>{overview}</p>
                </div>
            </div>
        </div>

    );
}

export { ShowDetails };