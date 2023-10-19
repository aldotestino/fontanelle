package validators

type AddFountainRequestBody struct {
	Name   string  `json:"name" binding:"required"`
	IsFree uint8   `json:"isFree"`
	Lat    float64 `json:"lat" binding:"required"`
	Lng    float64 `json:"lng" binding:"required"`
	Street string  `json:"street" binding:"required"`
}

func (b *AddFountainRequestBody) Validate() (bool, string) {
	if b.Name == "" {
		return false, "Name is empty"
	}

	if !(b.IsFree == 0 || b.IsFree == 1) {
		return false, "Invalid isFree"
	}

	if !(-90 <= b.Lat && b.Lat <= 90) {
		return false, "Invalid latitude"
	}

	if !(-180 <= b.Lng && b.Lng <= 180) {
		return false, "Invalid longitude"
	}

	if b.Street == "" {
		return false, "Street is empty"
	}

	return true, ""
}
