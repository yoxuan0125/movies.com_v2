package router

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"movies.com/controller"
	"movies.com/middleware"
	//"go_project/service"
)

func Router() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.POST("/user/signup", controller.SignUpHandler)
	router.POST("/user/signin", controller.LogInHandler)
	router.POST("/watchList", middleware.JWTAuthMiddleware(), controller.AddToWatchListHandler)
	router.GET("/watchList", middleware.JWTAuthMiddleware(), controller.GetWatchListHandler)
	router.DELETE("/watchList", middleware.JWTAuthMiddleware(), controller.DeleteFromWatchListHandler)
	router.GET("/watchList/:userID/:movieID", middleware.JWTAuthMiddleware(), controller.CheckWatchListHandler)

	//router.POST("/user/createUser", service.CreateUser)
	return router
}
