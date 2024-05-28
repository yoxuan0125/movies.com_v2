import React, {useEffect, useState} from "react";
import MovieCard from "../MovieCard/MovieCard";
import { FaTrash } from "react-icons/fa";
import {clickHandler, loadWatchList} from "../../utils";

import "./watchlist.css";

const WatchList = () => {

	const [movieWatchList, setMovieWatchList] = useState([])
	const [isUserSignedIn, setIsUserSignedIn] = useState(false);
	const [token, setToken] = useState("")
	const [userID, setUserID] = useState("")

	//check if login
	useEffect(() => {
		if (localStorage.getItem("loginResult") != null){
			setIsUserSignedIn(()=>true);
		}
		const loginResult = JSON.parse(localStorage.getItem("loginResult"))
		setToken(()=>loginResult.token)
		setUserID(()=>loginResult.userID)

	}, [])

	useEffect(()=>{
		//get watch list
		if(userID && token)
		loadWatchList(userID, token, setMovieWatchList)
	},[userID, token])

	const removeFromWatchList = async (item) =>{
		await clickHandler(item)
		await loadWatchList(userID, token, setMovieWatchList)
	}

	if(localStorage.getItem("loginResult")){
			return (
				<div className="watchlist-container">
					<h1>我的片單</h1>
					{!movieWatchList ? <h2>尚未有待看清單</h2> : null}
					{movieWatchList ? <div className="watchlist-wrapper">
						{movieWatchList.map((item, index) => {
							return (
								<div key={item.id} id={item.id}>
									<MovieCard item={item} index={index} className="MovieCard-container"/>
									<button onClick={() => removeFromWatchList(item)} className="del-btn">
										<FaTrash/>
									</button>
								</div>
							);
						})}
					</div>:null}

				</div>
			);
	} else {
		window.alert("Please log in");
		window.location.href = "/";
		return null;
	}
};

export default WatchList;
