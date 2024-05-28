package setting

import (
	"fmt"

	"github.com/fsnotify/fsnotify"

	"github.com/spf13/viper"
)

func InitConfig() (err error) {

	//viper.AddConfigPath(viperConfig.ConfigAddPath)
	viper.AddConfigPath(".")
	viper.SetConfigFile("config.yml")
	err = viper.ReadInConfig()
	if err != nil {
		fmt.Printf("Viper.ReadInConfig failed:%v\n", err)
		return
	}
	viper.WatchConfig()
	viper.OnConfigChange(func(in fsnotify.Event) {
		fmt.Println("Config file changer")
	})
	return
}
