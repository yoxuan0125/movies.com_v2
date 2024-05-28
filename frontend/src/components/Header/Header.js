import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userImg from "../images/user.png";
import { FaBars } from "react-icons/fa";
import { auth, SignIn, SignOut } from "../../firebase";
import { useGetWatchList } from "../../common/apis/getWatchList";

import "./Header.css";

const Header = () => {
	const [navOpen, setNavOpen] = useState(false);
	const [isUserSignedIn, setIsUserSignedIn] = useState(false);
	const userInfo = auth.currentUser;

	//Scroll to the top of the page after render
	useEffect(() => {
		window.scrollTo(0, 0);
		console.log(localStorage.getItem("loginResult"))
		if (localStorage.getItem("loginResult") != null){
			setIsUserSignedIn(()=>true);
		}

	}, []);

	//get watch list
	useGetWatchList(userInfo);

	// auth.onAuthStateChanged((user) => {
	// 	if (user) {
	// 		return setIsUserSignedIn(true);
	// 	}
	// 	setIsUserSignedIn(false);
	// });

	const navHandler = (e) => {
		e.preventDefault();
		setNavOpen(!navOpen);
	};

	return (
		<div className="header">
			<div className="nav-wrapper">
				<div className="nav">
					<Link to="/" className="logo">
						<h1>MOVIES</h1>
						<p>.com</p>
					</Link>
					<div className={navOpen ? `linksOpen` : `links`}>
						<ul className="category">
							<Link
								to="movie"
								onClick={() => {
									setNavOpen(!navOpen);
								}}
							>
								<li>熱門電影</li>
							</Link>
							<Link
								to="tv"
								onClick={() => {
									setNavOpen(!navOpen);
								}}
							>
								<li>電視節目</li>
							</Link>
							{isUserSignedIn ? (
								<Link
									to={`watchlist`}
									onClick={() => {
										setNavOpen(!navOpen);
									}}
								>
									<li>我的片單</li>
								</Link>
							) : null}
						</ul>
					</div>

					{isUserSignedIn ? (
						<div className="userInfo">
							<div className="user-img">
								<Link to="user">
									<img
										src={userImg}
										alt="user"
									/>
								</Link>
							</div>
							<button onClick={SignOut} className="signedIn-btn">
								Sign Out
							</button>
						</div>
					) : (
						<button className="signedIn-btn">
							<Link
								to={`signin`}
							>
								Sign In
							</Link>
						</button>
					)}
					<button className="nav-btn" onClick={navHandler}>
						<FaBars />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
