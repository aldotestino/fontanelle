package utils

import "github.com/gin-gonic/gin"

func ApiError(c *gin.Context, code int, errorMessage string) {
	c.JSON(code, gin.H{
		"error": errorMessage,
	})
}
