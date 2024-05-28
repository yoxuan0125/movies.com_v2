import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getAllMovies,
	getAllTVShows,
	changePage,
	setMovieDetails,
	setmovieActors,
	setmovieTrailer,
} from "../../Redux/movies/movieSlice";
import { useCallback, useRef, useEffect } from "react";
import useMovieSearch from "../../common/apis/movieApi";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

const MovieList = (props) => {
	const movies = useSelector(getAllMovies);
	const TVShows = useSelector(getAllTVShows);
	const dispatch = useDispatch();

	const { hasMore, loading } = useMovieSearch(props.category);

	const observer = useRef();
	const lastMoviesElementRef = useCallback((node) => {
		if (loading) return;
		if (observer.current) observer.current.disconnect();
		observer.current = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && hasMore) {
				dispatch(changePage());
			}
		});
		if (node) observer.current.observe(node);
	});

	useEffect(() => {
		dispatch(setMovieDetails([]));
		dispatch(setmovieActors([]));
		dispatch(setmovieTrailer([]));
	});

	if (movies) {
		return (
			<div className="list-container">
				<div>{loading && "Loading..."}</div>
				<div className="title">
					<h1>
						{!loading && (props.category === "movie" ? "熱門電影" : "熱門影集")}
					</h1>
				</div>
				<div className="content-container">
					{props.category === "movie"
						? movies.map((item, index) => {
								if (movies.length === index + 1) {
									return (
										<MovieCard
											key={item.id}
											item={item}
											index={index}
											category={"movie"}
											ref={lastMoviesElementRef}
										/>
									);
								} else {
									return <MovieCard key={item.id} item={item} index={index} />;
								}
						  })
						: TVShows.map((item, index) => {
								if (TVShows.length === index + 1) {
									return (
										<MovieCard
											key={item.id}
											item={item}
											index={index}
											category={"tv"}
											ref={lastMoviesElementRef}
										/>
									);
								} else {
									return <MovieCard key={item.id} item={item} index={index} />;
								}
						  })}
				</div>
			</div>
		);
	}
};

export default MovieList;
