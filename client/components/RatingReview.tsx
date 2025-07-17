import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Award,
  Clock,
  User,
  CheckCircle,
} from "lucide-react";

interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: "customer" | "tasker";
  revieweeId: string;
  revieweeName: string;
  rating: number;
  comment: string;
  categories: {
    communication: number;
    quality: number;
    punctuality: number;
    professionalism: number;
  };
  isVerifiedTransaction: boolean;
  createdAt: string;
  transactionId: string;
}

interface RatingReviewProps {
  taskId: string;
  transactionId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole: "customer" | "tasker";
  canReview: boolean;
  hasReviewed?: boolean;
  existingReview?: Review;
}

export default function RatingReview({
  taskId,
  transactionId,
  otherUserId,
  otherUserName,
  otherUserRole,
  canReview,
  hasReviewed = false,
  existingReview,
}: RatingReviewProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState({
    communication: 5,
    quality: 5,
    punctuality: 5,
    professionalism: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleCategoryRating = (
    category: keyof typeof categories,
    value: number,
  ) => {
    setCategories({ ...categories, [category]: value });
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      addNotification({
        type: "error",
        title: "Review Required",
        message: "Please provide a comment for your review.",
        priority: "medium",
        fromUser: "TaskIt System",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to submit review
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: Review = {
        id: Date.now().toString(),
        taskId,
        reviewerId: user.id,
        reviewerName: user.name,
        reviewerRole: user.role as "customer" | "tasker",
        revieweeId: otherUserId,
        revieweeName: otherUserName,
        rating,
        comment: comment.trim(),
        categories,
        isVerifiedTransaction: true,
        createdAt: new Date().toISOString(),
        transactionId,
      };

      addNotification({
        type: "task_update",
        title: "Review Submitted",
        message: `Your review for ${otherUserName} has been submitted successfully.`,
        priority: "medium",
        fromUser: "TaskIt System",
        taskId,
      });

      // Reset form
      setRating(5);
      setComment("");
      setCategories({
        communication: 5,
        quality: 5,
        punctuality: 5,
        professionalism: 5,
      });
      setShowReviewDialog(false);
    } catch (error) {
      addNotification({
        type: "error",
        title: "Review Failed",
        message: "Failed to submit review. Please try again.",
        priority: "medium",
        fromUser: "TaskIt System",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, onChange?: (value: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!onChange}
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getCategoryLabel = (category: keyof typeof categories) => {
    switch (category) {
      case "communication":
        return "Communication";
      case "quality":
        return otherUserRole === "tasker"
          ? "Work Quality"
          : "Clear Instructions";
      case "punctuality":
        return "Punctuality";
      case "professionalism":
        return "Professionalism";
      default:
        return category;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Rating & Review</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasReviewed && existingReview ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Review Submitted
                </Badge>
                <Badge variant="outline">
                  <Award className="w-3 h-3 mr-1" />
                  Verified Transaction
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(existingReview.rating)}
                <span className="text-sm text-muted-foreground">
                  {existingReview.rating}/5
                </span>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">{existingReview.comment}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(existingReview.categories).map(
                ([category, value]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {getCategoryLabel(category as keyof typeof categories)}
                    </span>
                    <div className="flex items-center space-x-2">
                      {renderStars(value)}
                      <span className="text-xs text-muted-foreground">
                        {value}/5
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Reviewed on{" "}
              {new Date(existingReview.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : canReview ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">
                Review your experience with {otherUserName}
              </span>
            </div>

            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Review {otherUserName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Overall Rating */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Overall Rating
                    </Label>
                    <div className="flex items-center space-x-3">
                      {renderStars(rating, handleStarClick)}
                      <span className="text-sm text-muted-foreground">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Category Ratings */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Detailed Ratings
                    </Label>
                    <div className="space-y-3">
                      {Object.entries(categories).map(([category, value]) => (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm">
                            {getCategoryLabel(
                              category as keyof typeof categories,
                            )}
                          </span>
                          <div className="flex items-center space-x-2">
                            {renderStars(value, (newValue) =>
                              handleCategoryRating(
                                category as keyof typeof categories,
                                newValue,
                              ),
                            )}
                            <span className="text-xs text-muted-foreground w-8">
                              {value}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <Label
                      htmlFor="review-comment"
                      className="text-sm font-medium"
                    >
                      Comment
                    </Label>
                    <Textarea
                      id="review-comment"
                      placeholder={`Share your experience working with ${otherUserName}...`}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowReviewDialog(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || !comment.trim()}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Award className="w-3 h-3" />
              <span>This review will be verified with your transaction</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Reviews available after task completion and payment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
