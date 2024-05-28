package models

import (
	"time"
)

type UserBasic struct {
	Id         int       `db:"column:id primaryKey autoIncrement:true" `
	UserId     int64     `db:"column:user_id"`
	Username   string    `db:"column:username" binding:"required"`
	Password   string    `db:"column:password" binding:"required"`
	RePassword string    `json:"repassword" db:"column:re_password" binding:"required,eqfield=Password"`
	Email      string    `db:"column:email" binding:"required"`
	Gender     int8      `db:"column:gender"`
	CreateTime time.Time `json:"create_time" db:"column:create_time"`
	UpdateTime time.Time `json:"update_time" db:"column:update_time"`
}

type LoginInfo struct {
	UserId   string `db:"user_id"`
	Username string `db:"username" json:"username" binding:"required"`
	Password string `db:"password" json:"password" binding:"required"`
}
