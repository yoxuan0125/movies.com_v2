package main

import (
	"fmt"
	"movies.com/dao/mysql"
	"movies.com/pkg/snowflake"
	"movies.com/router"
	"movies.com/setting"

	"github.com/spf13/viper"
)

func main() {
	err := setting.InitConfig()
	err = mysql.Init()
	if err != nil {
		return
	} else {
		fmt.Println("DB connected")
	}
	defer mysql.Close()

	if err := snowflake.Init(viper.GetString("start_time"), viper.GetInt64("machine_id")); err != nil {
		fmt.Printf("init snowflake failed, err:%v\n", err)
		return
	}
	r := router.Router()
	err = r.Run()
	if err != nil {
		return
	}
}
