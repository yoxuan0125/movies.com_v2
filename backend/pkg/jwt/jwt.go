package jwt

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

type User struct {
	Username             string `json:"username"`
	jwt.RegisteredClaims        // v5版本新加的方法
}

var key = []byte("yochen practice project")
var TokenExpiredDuration = time.Hour * 2

func GetToken(username string) (string, error) {
	claims := User{
		username,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(TokenExpiredDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(key)
}

func ParseJwt(tokenstring string) (*User, error) {
	t, err := jwt.ParseWithClaims(tokenstring, &User{}, func(token *jwt.Token) (interface{}, error) {
		return key, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := t.Claims.(*User); ok && t.Valid {
		return claims, nil
	} else {
		return nil, errors.New("invalid token")
	}
}
