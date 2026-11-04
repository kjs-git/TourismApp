using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IReviewRepository _reviewRepo;

        public AdminController(IUserRepository userRepo, IReviewRepository reviewRepo)
        {
            _userRepo = userRepo;
            _reviewRepo = reviewRepo;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userRepo.GetAllAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            try
            {
                await _userRepo.DeleteAsync(id);
                return Ok(new { message = "Пользователь успешно удален из системы" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewRepo.GetAllAsync();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("reviews/{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            try
            {
                await _reviewRepo.DeleteAsync(id);
                return Ok(new { message = "Отзыв успешно удален" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
