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
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                var userId = Guid.Parse(userIdClaim.Value);

                var orderIds = await _orderService.CheckoutAsync(userId);

                return Ok(new
                {
                    orderIds, 
                    message = "Заказы успешно разделены и оформлены! Корзина очищена."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("my")]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null)
                    return Unauthorized(new { message = "Пользователь не авторизован" });

                var userId = Guid.Parse(userIdClaim.Value);

                var orders = await _orderService.GetUserOrdersAsync(userId);

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [HttpGet("schedule/{scheduleId}/participants")]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetParticipants(Guid scheduleId)
        {
            try
            {
                var sellerId = Guid.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
                var result = await _orderService.GetScheduleParticipantsAsync(scheduleId, sellerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return Forbid();
            }
        }
        [HttpGet("seller-orders")]
        [Authorize]
        public async Task<IActionResult> GetSellerOrders()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null) return Unauthorized();

                var sellerId = Guid.Parse(userIdClaim.Value);
                var orders = await _orderService.GetOrdersForSellerAsync(sellerId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{orderId}/status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatus(Guid orderId, [FromBody] int newStatus)
        {
            try
            {
                var sellerId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                await _orderService.UpdateOrderStatusAsync(orderId, (Domain.Enums.OrderStatus)newStatus, sellerId);
                return Ok(new { message = "Статус успешно обновлен" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}

