type Rating = {
  id: number;
  rating: number;
  ticket_id: number;
  rating_category_id: number;
  reviewer_id: number;
  reviewee_id: number;
  created_at: string;
};

type RatingCategory = {
  id: number;
  name: string;
  weight: number;
};
