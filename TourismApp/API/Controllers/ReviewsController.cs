using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> PostReview([FromForm] CreateReviewRequest request)
        {
            try
            {
                var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                await _reviewService.LeaveReviewAsync(userId, request);

                return Ok(new { message = "Отзыв успешно добавлен!" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{activityId}")]
        public async Task<IActionResult> GetReviews(Guid activityId)
        {
            var reviews = await _reviewService.GetReviewsByActivityAsync(activityId);
            return Ok(reviews);
        }
    }
}