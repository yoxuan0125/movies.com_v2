export const clickHandler = async(item) =>{
    console.log(item)
    const loginResult = JSON.parse(localStorage.getItem("loginResult"))
    const token = loginResult.token
    const userID = loginResult.userID
    await fetch(`http://localhost:8080/watchList?movieID=${item.movieId||item.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }).then((response)=>response.json())

}

export const loadWatchList = (userID, token, setMovieWatchList) =>{
    fetch(`http://localhost:8080/watchList?userid=${userID}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // 根据你的API需要设置适当的Content-Type
        }
    }).then((response)=>response.json())
        .then((data)=>setMovieWatchList(data.data))
}