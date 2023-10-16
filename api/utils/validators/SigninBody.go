package validators

type SigninBody struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (b *SigninBody) Validate() (bool, string) {
	if !validateEmail(b.Email) {
		return false, "Invalid email"
	}

	if len(b.Password) < 5 {
		return false, "Password too short"
	}

	return true, ""
}
