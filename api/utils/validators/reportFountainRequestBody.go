package validators

type ReportFountainRequestBody struct {
	Reason uint8 `json:"reason" binding:"required"`
}

func (b *ReportFountainRequestBody) Validate() (bool, string) {

	if !(1 <= b.Reason && b.Reason <= 5) {
		return false, "Invalid reason"
	}

	return true, ""
}
