package validators

import (
	"regexp"
)

// Body interface
type ApiRequestBody interface {
	Validate() (bool, string)
}

// ValidateEmail checks if an email is valid
func validateEmail(email string) bool {
	// This is a simple regex to check if the email is valid.
	// It's not perfect, but it's good enough for most cases.
	regex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return regex.MatchString(email)
}
