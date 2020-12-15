package middlewares

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"

	"gitlab.com/brazncorp/web-ui/services/cache"
)

type Role int

const (
	Operation   Role = 0x1
	Admin       Role = 0x1 << 1
	SystemAdmin Role = 0x1 << 2
)

func (r Role) IsOperator() bool {
	return r&Operation != 0
}

func (r Role) IsAdmin() bool {
	return r&Admin != 0
}

func (r Role) IsSystemAdmin() bool {
	return r&SystemAdmin != 0
}

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUuid   string
	RefreshUuid  string
}

type Claims struct {
	Email string `json:"email"`
	UuId  string `json:"uuid"`
	jwt.StandardClaims
}

func GenerateToken(email string) (*TokenDetails, error) {
	td := &TokenDetails{}
	td.AccessUuid = uuid.New().String()
	td.RefreshUuid = uuid.New().String()

	var err error
	td.AccessToken, err = CreateToken(email, td.AccessUuid, 60*time.Hour)
	if err != nil {
		return nil, err
	}

	td.RefreshToken, err = CreateToken(email, td.RefreshUuid, 8760*time.Hour)
	if err != nil {
		return nil, err
	}

	return td, nil
}

func CreateToken(email, uuid string, duration time.Duration) (string, error) {
	nowTime := time.Now()
	expireTime := nowTime.Add(duration)
	claims := Claims{
		email,
		uuid,
		jwt.StandardClaims{
			ExpiresAt: expireTime.Unix(),
			Issuer:    "brazn.io",
		},
	}
	tokenClaims := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := tokenClaims.SignedString(jwtSecret)

	return token, err
}

func ParseToken(token string) (*Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*Claims); ok && tokenClaims.Valid {
			return claims, nil
		}
	}

	return nil, err
}

func ParseTokenExpire(token string) (*Claims, error) {
	tokenClaims, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if tokenClaims != nil {
		if claims, ok := tokenClaims.Claims.(*Claims); ok {
			return claims, nil
		}
	}

	return nil, err
}

func CreateAuth(email string, td *TokenDetails) {
	cache.CacheStore.Put(td.AccessUuid, email)
	cache.CacheStore.Put(td.RefreshUuid, email)
}

func DeleteAuth(givenUuid string) {
	cache.CacheStore.Delete(givenUuid)
}
