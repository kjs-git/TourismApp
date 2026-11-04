using Application.DTOs.Routes;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RoutesController : ControllerBase
    {
        private readonly IRouteService _routeService;

        public RoutesController(IRouteService routeService)
        {
            _routeService = routeService;
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) throw new UnauthorizedAccessException();
            return Guid.Parse(userIdClaim.Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyRoute()
        {
            try
            {
                var route = await _routeService.GetUserRouteAsync(GetUserId());
                return Ok(route);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItemToRoute([FromBody] AddToRouteRequest request)
        {
            try
            {
                await _routeService.AddItemToRouteAsync(GetUserId(), request);
                return Ok(new { message = "Активность успешно добавлена в маршрут" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> ClearRoute()
        {
            try
            {
                await _routeService.ClearRouteAsync(GetUserId());
                return Ok(new { message = "Маршрут очищен" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
