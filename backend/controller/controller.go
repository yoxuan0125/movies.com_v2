package controller

import (
	"fmt"
	"movies.com/dao/mysql"
	"movies.com/logic"
	"movies.com/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func SignUpHandler(c *gin.Context) {
	user := &models.UserBasic{}
	if err := c.ShouldBindJSON(&user); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Invalid sign up information.",
		})
		return
	}
	if err := logic.SignUp(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{
			"msg": "Sign up Successfully.",
		})
		return
	}

}

func LogInHandler(c *gin.Context) {
	loginInfo := &models.LoginInfo{}
	if err := c.ShouldBindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Invalid log in information.",
		})
		return
	}
	if token, err := logic.Login(loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"msg": "Sign in Successfully.",
			"data": gin.H{
				"token":    token,
				"userID":   loginInfo.UserId,
				"userName": loginInfo.Username,
			},
		})
	}
}

func AddToWatchListHandler(c *gin.Context) {
	WatchListParam := &mysql.WatchListParam{}
	if err := c.ShouldBindJSON(WatchListParam); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Invalid user information.",
		})
		return
	}
	userName, _ := c.Get("username")
	userID, err := mysql.FindUserByUsername(userName.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	}
	if userID != WatchListParam.UserID {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "User Not Found.",
		})
		return
	}
	err = mysql.InsertWatchList(WatchListParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "Movie has been added Successfully.",
	})

}

func GetWatchListHandler(c *gin.Context) {
	var watchList []mysql.FrontendWatchListParam
	var err error
	userID, existed := c.GetQuery("userid")
	if !existed {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Invalid user information.",
		})
		return
	}
	intUserID, _ := strconv.Atoi(userID)
	watchList, err = mysql.GetWatchList(int64(intUserID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": watchList,
		"msg":  "Get watchlist Successfully.",
	})
}

func DeleteFromWatchListHandler(c *gin.Context) {
	userName, _ := c.Get("username")
	userID, err := mysql.FindUserByUsername(userName.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	}
	fmt.Println(c.Request)
	movieID, ok := c.GetQuery("movieID")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": "Invalid movie ID.",
		})
		return
	}
	intMovieID, _ := strconv.Atoi(movieID)
	err = mysql.DeleteFromWatchList(userID, int64(intMovieID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"msg": "Movie has been deleted Successfully.",
	})
	return
}

func CheckWatchListHandler(c *gin.Context) {
	userID := c.Param("userID")
	movieID := c.Param("movieID")
	fmt.Println(userID, movieID)
	intUserID, _ := strconv.Atoi(userID)
	intMovieID, _ := strconv.Atoi(movieID)
	exists, err := mysql.CheckWatchList(int64(intUserID), int64(intMovieID))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"msg": err.Error(),
		})
	}
	c.JSON(http.StatusOK, gin.H{"exists": exists})
}
