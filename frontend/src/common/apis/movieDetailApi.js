import { useEffect, useState } from "react";
import axios from "axios";
import {
	setMovieDetails,
	setmovieActors,
	setmovieTrailer,
} from "../../Redux/movies/movieSlice";

export default function useMovieDetailsSearch(dispatch, movie_id, category) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const APIKey = "55d94f60e799bfe097c0411107134875";

	useEffect(() => {
		const fetchApi = async () => {
			setLoading(true);
			setError(false);
			const url1 = `https://api.themoviedb.org/3/${category}/${movie_id}?api_key=${APIKey}&language=zh-TW`;
			const url2 = `https://api.themoviedb.org/3/${category}/${movie_id}/credits?api_key=${APIKey}&language=zh-TW`;
			const url3 = `https://api.themoviedb.org/3/${category}/${movie_id}/videos?api_key=${APIKey}&language=en-US`;

			let endpoints = [url1, url2, url3];

			await axios
				.all(endpoints.map((endpoint) => axios.get(endpoint)))
				.then((data) => {
					dispatch(setMovieDetails(data[0].data));
					dispatch(setmovieActors(data[1].data.cast));
					dispatch(setmovieTrailer(data[2].data.results));
					setLoading(false);
				})
				.catch((e) => {
					console.log(e);
				});
		};
		fetchApi();
	}, [movie_id, category, dispatch]);

	return { loading, error };
}
