package logic

import (
	"movies.com/dao/mysql"
	"movies.com/models"
	"movies.com/pkg/jwt"
	"movies.com/pkg/snowflake"
)

func SignUp(userInfo *models.UserBasic) (err error) {
	if err := mysql.QueryUser(userInfo.Username); err != nil {
		// query Db error
		return err
	}

	// generate UID
	userID := snowflake.GenID()
	userInfo.UserId = userID

	//insert into db
	return mysql.InsertUser(userInfo)
}

func Login(loginInfo *models.LoginInfo) (token string, err error) {
	if err = mysql.Login(loginInfo); err != nil {
		return "", err
	}
	if token, err = jwt.GetToken(loginInfo.Username); err != nil {
		return "", err
	}
	return token, nil
}
