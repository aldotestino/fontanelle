package validators

type SignupRequestBody struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Surname  string `json:"surname" binding:"required"`
}

func (b *SignupRequestBody) Validate() (bool, string) {
	if !validateEmail(b.Email) {
		return false, "Invalid email"
	}

	if len(b.Password) < 5 {
		return false, "Password too short"
	}

	if b.Name == "" {
		return false, "Name is empty"
	}

	if b.Surname == "" {
		return false, "Surname is empty"
	}

	return true, ""
}
