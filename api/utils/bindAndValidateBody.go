package utils

import (
	"fontanelle-api/utils/validators"
	"net/http"

	"github.com/gin-gonic/gin"
)

func BindAndValidateBody(c *gin.Context, body validators.ApiRequestBody) bool {
	if c.Bind(body) != nil {
		ApiError(c, http.StatusBadRequest, "Invalid body")
		return false
	}

	if ok, message := body.Validate(); !ok {
		ApiError(c, http.StatusBadRequest, message)
		return false
	}

	return true
}
