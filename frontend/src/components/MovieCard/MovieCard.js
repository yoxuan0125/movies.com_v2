import React from "react";
import "./MovieCard.css";
import { Link, useLocation } from "react-router-dom";

const MovieCard = React.forwardRef((props, ref) => {
	const location = useLocation();

	return (
		<div className="MovieCard-container">
			<Link
				to={
					props.item.path
						? props.item.path
						: `${props.category === undefined ? location.pathname : props.category}/${
								props.item.id
						  }`
				}
				className="moviecard"
				key={props.index}
			>
				<img
					src={`https://image.tmdb.org/t/p/original${
						props.item.poster_path || props.item.profile_path
					}`}
					alt="error"
					className="movieimg"
				/>
				<div className="moviecontent">
					<h4>{props.item.title || props.item.name}</h4>
					<h6>{props.item.original_title || props.item.original_name}</h6>
					<p ref={ref}>{props.item.release_date}</p>
				</div>
			</Link>
		</div>
	);
});

export default MovieCard;
