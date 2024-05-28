import React, { useEffect, useState } from "react";
import useMovieDetailsSearch from "../../common/apis/movieDetailApi";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
	getMovieDetails,
	getMovieActors,
	getMovieTrailer,
	getwatchList,
} from "../../Redux/movies/movieSlice";
import "./MovieDetails.css";

import MovieCard from "../MovieCard/MovieCard";
import {clickHandler, loadWatchList} from "../../utils";

const MovieDetails = () => {
	const params = useParams();
	const dispatch = useDispatch();
	const movieDetails = useSelector(getMovieDetails);
	const movieActors = useSelector(getMovieActors);
	const movieTrailer = useSelector(getMovieTrailer);
	const userInfo = localStorage.getItem("loginResult");
	const [isFound, setIsFound] = useState(false);
	const [isUserSignedIn, setIsUserSignedIn] = useState(false);
	const movieWatchList = useSelector(getwatchList);
	const path = window.location.pathname
	const [token, setToken] = useState("")
	const [userID, setUserID] = useState("")
	const [isInWatchList, setIsInWatchList] = useState(false);


	const checkWatchList = async (movieID) =>{
		await fetch(`http://localhost:8080/watchList/${userID}/${movieID}`,{
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
		}).then((res)=>res.json())
			.then((data)=>setIsInWatchList((val)=>data.exists))
	}

	//check if login
	useEffect(() => {
		if (localStorage.getItem("loginResult") != null){
			setIsUserSignedIn(()=>true);
		}
		const loginResult = JSON.parse(localStorage.getItem("loginResult"))
		setToken(()=>loginResult.token)
		setUserID(()=>loginResult.userID)

	}, []);

	useEffect(async ()=>{
		if(userID){
			await checkWatchList(params.id)
		}
	},[userID, token])

	//get movie details
	useMovieDetailsSearch(dispatch, params.id, params.category);

	//add to watchList/remove from watch list function
	const addToWatchList = async () => {
		if (isUserSignedIn) {
			// const loginResult = JSON.parse(localStorage.getItem("loginResult"))
			// const token = loginResult.token

			const addParams = {
				userId:parseInt(userID),
				movieId: parseInt(params.id),
					path: path,
					title: movieDetails.title || movieDetails.name,
					originalTitle: movieDetails.original_title || movieDetails.original_name,
				posterPath: `${movieDetails.poster_path}`,
				}
			await fetch('http://localhost:8080/watchList' ,{
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(addParams),
			}).then((response) => {
				if (!response.ok){
					window.alert("添加失敗")
				}
				else{
					window.alert("添加成功")
				}
			})
			// setDoc(doc(db, "watchlist", userInfo.uid), {
			// 	data: [...newWatchList],
			// });
			// dispatch(setwatchList({ data: [...newWatchList] }));
			setIsFound(true);
			await checkWatchList(params.id)
		} else {
			alert("Please log in");
		}
	};

	const removeFromWatchList = async(item) =>{
		await clickHandler(item)
		checkWatchList(params.id)
	}

	//check if the movie is in the watchlist
	useEffect(() => {
		if (movieWatchList.length !== 0) {
			movieWatchList.data?.some((element) => {
				if (element.id === params.id) {
					setIsFound(true);
				}
			});
		}
	}, [movieWatchList, params.id]);

	if (Object.keys(movieDetails).length === 0) {
		return "Loading...";
	}
	if (Object.keys(movieDetails).length !== 0) {
		return (
			<>
				<div
					className="movieDetailsContainer"
					style={{
						backgroundImage: `url("https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${movieDetails.backdrop_path}")`,
					}}
				>
					<div className="movieDetailsContainer-filter">
						<div className="movieDetails">
							<div className="poster_wrapper">
								{movieDetails.poster_path !== null ? (
									<img
										src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${movieDetails.poster_path}`}
										alt="MoviePoster"
										className="poster"
									/>
								) : (
									""
								)}
							</div>
							<div className="information">
								<h1>{movieDetails.title || movieDetails.name}</h1>
								<h3>{movieDetails.original_title || movieDetails.original_name}</h3>
								{params.category === "movie" ? (
									<>
										<p>上映日期 : {movieDetails.release_date}</p>
										<p>
											片長 : {Math.round(movieDetails.runtime / 60)}小時
											{movieDetails.runtime % 60}分鐘
										</p>
									</>
								) : (
									""
								)}
								<p>劇情介紹 : </p>
								<p>{movieDetails.overview ? movieDetails.overview : "No Data"}</p>
								<p>演員 : </p>
								<div className="actorsList">
									{movieActors
										? movieActors.slice(0, 9).map((actor, index) => {
												return (
													<div key={index} className="actor">
														{actor.original_name}
													</div>
												);
										  })
										: "No Data"}
								</div>
								{isInWatchList && isUserSignedIn ? (
									<button className="adding-btn" onClick={()=>removeFromWatchList(movieDetails)}>
										移出片單
									</button>
								) : (
									<button className="adding-btn" onClick={addToWatchList}>
										加入片單
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="detailbox">
					<div className="detailbox-container">
						<div className="info">
							<div className="title">
								<span>主要演員</span>
							</div>
							<div className="actorBox">
								{movieActors[0]
									? movieActors.slice(0, 9).map((item, index) => {
											return (
												<MovieCard
													data-index={index}
													key={item.id}
													item={item}
													index={index}
												/>
											);
									  })
									: "No Data"}
							</div>
						</div>
						<div className="info">
							<div className="title">
								<span>相關影片</span>
							</div>
							<div className="trailerBox">
								{movieTrailer[0]
									? movieTrailer.slice(0, 3).map((item, index) => {
											return (
												<div key={index}>
													<a
														href={`https://www.youtube.com/watch?v=${item.key}`}
														className="trailer"
														style={{
															backgroundImage: `url("https://i.ytimg.com/vi/${item.key}/hqdefault.jpg")`,
														}}
													></a>
												</div>
											);
									  })
									: "No Data"}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
};

export default MovieDetails;
