package utils

import (
	"fontanelle-api/utils/validators"
	"net/http"

	"github.com/gin-gonic/gin"
)

type BindAndValidateError struct {
	StatusCode int    `json:"status"`
	Message    string `json:"error"`
}

func BindAndValidateBody(c *gin.Context, body validators.ApiRequestBody) *BindAndValidateError {
	if c.Bind(body) != nil {
		return &BindAndValidateError{
			StatusCode: http.StatusBadRequest,
			Message:    "Invalid body",
		}
	}

	if ok, message := body.Validate(); !ok {
		return &BindAndValidateError{
			StatusCode: http.StatusBadRequest,
			Message:    message,
		}
	}

	return nil
}
