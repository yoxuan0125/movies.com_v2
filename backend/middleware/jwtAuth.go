package middleware

import (
	"github.com/gin-gonic/gin"
	"movies.com/pkg/jwt"
	"net/http"
	"strings"
)

func JWTAuthMiddleware() func(c *gin.Context) {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "invalid authorization header",
			})
			c.Abort()
			return
		}
		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "invalid authorization header",
			})
		}
		mc, err := jwt.ParseJwt(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"msg": "invalid authorization header",
			})
			c.Abort()
			return
		}
		c.Set("username", mc.Username)
		c.Next()
	}
}
