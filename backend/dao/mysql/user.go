package mysql

import (
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"errors"
	"fmt"
	"movies.com/models"

	"github.com/jmoiron/sqlx"

	_ "github.com/go-sql-driver/mysql"
	"github.com/spf13/viper"
)

var db *sqlx.DB

const secret = "yochen"

func Init() (err error) {
	conn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s",
		viper.GetString("mysql.user"),
		viper.GetString("mysql.password"),
		viper.GetString("mysql.host"),
		viper.GetInt("mysql.port"),
		viper.GetString("mysql.dbname"),
	)
	fmt.Println("mysql conn:", conn)
	db, err = sqlx.Connect("mysql", conn)
	if err != nil {
		fmt.Printf("connect DB failed, err:%v\n", err)
		return
	}
	if err = db.Ping(); err != nil {
		fmt.Println("Ping error")
	} else {
		fmt.Println("Ping successfully")
	}
	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)
	return

}

func Close() {
	_ = db.Close()
}

func QueryUser(userName string) (err error) {
	sqlStr := `select count(user_id) from user where username = ?`
	var count int64
	if err = db.Get(&count, sqlStr, userName); err != nil {
		return err
	}
	if count > 0 {
		return errors.New("user existed")
	}
	return
}

func InsertUser(userInfo *models.UserBasic) (err error) {
	sqlStr := `insert into user (user_id, username, password, email, gender) values (?,?,?,?,?)`
	encryptedPassword := encryptPassword(userInfo.Password)
	_, err = db.Exec(sqlStr, userInfo.UserId, userInfo.Username, encryptedPassword, userInfo.Email, userInfo.Gender)
	return
}

func encryptPassword(oPassword string) string {
	h := md5.New()
	h.Write([]byte(secret))
	return hex.EncodeToString(h.Sum([]byte(oPassword)))
}

func Login(loginInfo *models.LoginInfo) (err error) {
	oPassword := loginInfo.Password
	sqlStr := `select user_id, username, password from user where username = ?`
	err = db.Get(loginInfo, sqlStr, loginInfo.Username)
	if errors.Is(err, sql.ErrNoRows) {
		return errors.New("user not found")
	}
	if err != nil {
		return err
	}
	password := encryptPassword(oPassword)
	if password != loginInfo.Password {
		return errors.New("incorrect password")
	}
	return
}

func FindUserByUsername(userName string) (userId int64, err error) {
	sqlStr := `select user_id from user where username = ?`
	if err = db.Get(&userId, sqlStr, userName); err != nil {
		return 0, err
	}
	return
}
