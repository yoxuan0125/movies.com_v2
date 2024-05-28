import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../../firebase";

import { setwatchList } from "../../Redux/movies/movieSlice";

export function useGetWatchList(userInfo) {
	const dispatch = useDispatch();

	if (userInfo) {
		getDoc(doc(db, "watchlist", userInfo.uid)).then((docSnap) => {
			if (docSnap.exists()) {
				dispatch(
					setwatchList(
						Object.keys(docSnap.data()).length === 0 ? { data: [] } : docSnap.data()
					)
				);
			} else {
				dispatch(setwatchList({ data: [] }));
				setDoc(doc(db, "watchlist", userInfo.uid), {
					data: [],
				});
			}
		});
	}
	return;
}
