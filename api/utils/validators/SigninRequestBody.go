package validators

type SigninRequestBody struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (b *SigninRequestBody) Validate() (bool, string) {
	if !validateEmail(b.Email) {
		return false, "Invalid email"
	}

	if len(b.Password) < 5 {
		return false, "Password too short"
	}

	return true, ""
}
