package validators

type VoteFountainRequestBody struct {
	Stars uint8 `json:"stars" binding:"required"`
}

func (b *VoteFountainRequestBody) Validate() (bool, string) {

	if !(1 <= b.Stars && b.Stars <= 5) {
		return false, "Invalid stars"
	}

	return true, ""
}
