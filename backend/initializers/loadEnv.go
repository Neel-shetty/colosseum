package initializers

import (
	"fmt"
	"os"

	"github.com/spf13/viper"
)

type Config struct {
	DBHost         string `mapstructure:"POSTGRES_HOST"`
	DBUserName     string `mapstructure:"POSTGRES_USER"`
	DBUserPassword string `mapstructure:"POSTGRES_PASSWORD"`
	DBName         string `mapstructure:"POSTGRES_DB"`
	DBPort         string `mapstructure:"POSTGRES_PORT"`
	ClientOrigin   string `mapstructure:"CLIENT_ORIGIN"`
	JwtSecret      string `mapstructure:"JWT_SECRET"`
	CookieSecret   string `mapstructure:"COOKIE_ENCRYPT_SECRET"`
}

// func LoadConfig(path string) (config Config, err error) {
// 	viper.AddConfigPath(path)
// 	viper.SetConfigType("env")
// 	viper.SetConfigName("app")

// 	viper.AutomaticEnv()

// 	err = viper.ReadInConfig()
// 	if err != nil {
// 		return
// 	}

// 	err = viper.Unmarshal(&config)
// 	return
// }

func LoadConfig(path string) (config Config, err error) {
	// viper.AddConfigPath(path)
	// viper.SetConfigType("env")
	// viper.SetConfigName("app")

	// Automatically read environment variables
	// viper.AutomaticEnv()

	// Optionally, set a prefix for environment variables
	// viper.SetEnvPrefix("MYAPP")

	// Read the config file
	// if err := viper.ReadInConfig(); err != nil {
	// 	fmt.Printf("Error reading config file: %s\n", err)
	// }

	if os.Getenv("POSTGRES_HOST") != "" {
		config = Config{
			DBHost:         os.Getenv("POSTGRES_HOST"),
			DBUserName:     os.Getenv("POSTGRES_USER"),
			DBUserPassword: os.Getenv("POSTGRES_PASSWORD"),
			DBName:         os.Getenv("POSTGRES_DB"),
			DBPort:         os.Getenv("POSTGRES_PORT"),
			ClientOrigin:   os.Getenv("CLIENT_ORIGIN"),
			JwtSecret:      os.Getenv("JWT_SECRET"),
			CookieSecret:   os.Getenv("COOKIE_ENCRYPT_SECRET"),
		}

		// Unmarshal the config into the Config struct
		if err := viper.Unmarshal(&config); err != nil {
			return config, fmt.Errorf("unable to decode into struct, %v", err)
		}

		return config, nil
	} else {
		viper.AddConfigPath(path)
		viper.SetConfigType("env")
		viper.SetConfigName("app")

		viper.AutomaticEnv()

		err = viper.ReadInConfig()
		if err != nil {
			return
		}
		err = viper.Unmarshal(&config)
		return
	}
}
