using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Application.Services 
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepo;
        private readonly IUserRepository _userRepo;

        public ReviewService(IReviewRepository reviewRepo, IUserRepository userRepo)
        {
            _reviewRepo = reviewRepo;
            _userRepo = userRepo;
        }

        public async Task LeaveReviewAsync(Guid userId, CreateReviewRequest request)
        {
            if (request.Rating < 1 || request.Rating > 5)
                throw new Exception("Рейтинг должен быть от 1 до 5 звезд.");

            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("Пользователь не найден.");

            var review = new Review
            {
                ActivityId = request.ActivityId,
                UserId = userId,
                UserFullName = user.FullName,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
                ImageUrls = new List<string>()
            };

            if (request.Images != null && request.Images.Count > 0)
            {
                var reviewsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "reviews");

                if (!Directory.Exists(reviewsFolderPath))
                {
                    Directory.CreateDirectory(reviewsFolderPath);
                }

                foreach (var file in request.Images)
                {
                    if (file.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(reviewsFolderPath, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        review.ImageUrls.Add($"/uploads/reviews/{fileName}");
                    }
                }
            }

            await _reviewRepo.AddAsync(review);
        }

        public async Task<IEnumerable<Review>> GetReviewsByActivityAsync(Guid activityId)
        {
            return await _reviewRepo.GetByActivityIdAsync(activityId);
        }
        public async Task<IEnumerable<Review>> GetAllReviewsAsync()
        {
            return await _reviewRepo.GetAllAsync();
        }

        public async Task DeleteReviewAsync(string id)
        {
            await _reviewRepo.DeleteAsync(id);
        }
    }
}