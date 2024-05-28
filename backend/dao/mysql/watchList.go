package mysql

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"
)

type WatchListParam struct {
	UserID        int64  `json:"userId"`
	MovieID       int64  `json:"movieId"`
	Path          string `json:"path"`
	PosterPath    string `json:"posterPath"`
	Title         string `json:"title"`
	OriginalTitle string `json:"originalTitle"`
	AddedDate     string `json:"addedDate"`
}

type FrontendWatchListParam struct {
	UserID        int64  `json:"userId"`
	MovieID       int64  `json:"movieId"`
	Path          string `json:"path"`
	PosterPath    string `json:"poster_path"`
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	AddedDate     string `json:"addedDate"`
}

func InsertWatchList(param *WatchListParam) (err error) {
	sqlStr := `insert into favorite (user_id, movie_id, path, title, original_title, poster_path, added_date) values (?,?,?,?,?,?,?)`
	_, err = db.Exec(sqlStr, param.UserID, param.MovieID, param.Path, param.Title, param.OriginalTitle, param.PosterPath, time.Now())
	if err != nil {
		return err
	}
	return
}

func GetWatchList(userId int64) ([]FrontendWatchListParam, error) {
	sqlStr := `SELECT f.movie_id, f.path, f.title, f.original_title, f.poster_path, f.added_date
				FROM favorite f
				JOIN user u ON f.user_id = u.user_id
				WHERE u.user_id = ?;`
	rows, err := db.Query(sqlStr, userId)
	if err != nil {
		log.Fatal(err)
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			return
		}
	}(rows)
	var watchlist []FrontendWatchListParam
	for rows.Next() {
		var item FrontendWatchListParam
		err := rows.Scan(&item.MovieID, &item.Path, &item.Title, &item.OriginalTitle, &item.PosterPath, &item.AddedDate)
		if err != nil {
			log.Fatal(err)
		}
		watchlist = append(watchlist, item)
	}
	if err = rows.Err(); err != nil {
		log.Fatal(err)
		return nil, err
	}
	return watchlist, nil
}

func DeleteFromWatchList(userID int64, movieID int64) error {
	sqlStr := `
		DELETE FROM favorite 
		WHERE user_id = ? AND movie_id = ?
		`

	result, err := db.Exec(sqlStr, userID, movieID)
	if err != nil {
		log.Fatal(err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %d movie item(s) for user_id %d and movie_id %d\n", rowsAffected, userID, movieID)
	return nil
}

func CheckWatchList(userID int64, movieID int64) (exists bool, err error) {
	sqlStr := `
		SELECT EXISTS(SELECT 1 FROM favorite WHERE user_id = ? AND movie_id = ?)
		`
	err = db.QueryRow(sqlStr, userID, movieID).Scan(&exists)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return
	}
	return
}
