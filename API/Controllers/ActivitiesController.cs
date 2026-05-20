using Application.DTOs.Activities;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Seller,Admin")]
    public class ActivitiesController : ControllerBase
    {
        private readonly IActivityService _activityService;

        public ActivitiesController(IActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateActivityRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                var sellerId = Guid.Parse(userIdClaim.Value);

                var activityId = await _activityService.CreateActivityAsync(request, sellerId);

                return Ok(new { id = activityId, message = "Активность успешно создана" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{activityId}/schedules")]
        public async Task<IActionResult> AddSchedule(Guid activityId, [FromBody] AddScheduleRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();
                var sellerId = Guid.Parse(userIdClaim.Value);

                var scheduleId = await _activityService.AddScheduleAsync(activityId, request, sellerId);

                return Ok(new { id = scheduleId, message = "Расписание успешно добавлено" });
            }
            catch (UnauthorizedAccessException ex) 
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-activities")]
        public async Task<IActionResult> GetMyActivities()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                var sellerId = Guid.Parse(userIdClaim.Value);

                var result = await _activityService.GetActivitiesBySellerIdAsync(sellerId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet]
        [AllowAnonymous] 
        public async Task<IActionResult> GetAll()
        {
            var result = await _activityService.GetAllActivitiesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _activityService.GetActivityDetailsAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest(new { message = "Файл не выбран" });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            var imageUrl = $"/uploads/{uniqueFileName}";
            return Ok(new { url = imageUrl });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, [FromBody] CreateActivityRequest request)
        {
            try
            {
                var sellerId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _activityService.UpdateActivityAsync(id, request, sellerId);
                return Ok(new { message = "Активность успешно обновлена" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            try
            {
                await _activityService.DeleteActivityAsync(id);
                return Ok(new { message = "Тур успешно удален" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
    }
}
