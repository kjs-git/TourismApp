using Application.DTOs;
using Application.DTOs.Activities;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface IOrderService
    {
        Task<List<Guid>> CheckoutAsync(Guid userId);
        Task<IEnumerable<UserOrderResponse>> GetUserOrdersAsync(Guid userId);
        Task<SellerDashboardResponse> GetScheduleParticipantsAsync(Guid scheduleId, Guid sellerId);
        Task<IEnumerable<UserOrderResponse>> GetOrdersForSellerAsync(Guid sellerId);
        Task UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus, Guid sellerId);
    }

    public class OrderService : IOrderService
    {
        private readonly IRouteService _routeService;
        private readonly IOrderRepository _orderRepo;
        private readonly IActivityScheduleRepository _scheduleRepo;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        public OrderService(
            IRouteService routeService,
            IOrderRepository orderRepo,
            IActivityScheduleRepository scheduleRepo,
            IUserRepository userRepository,
            IEmailService emailService)
        {
            _routeService = routeService;
            _orderRepo = orderRepo;
            _scheduleRepo = scheduleRepo;
            _userRepository = userRepository;
            _emailService = emailService;
        }

        public async Task<List<Guid>> CheckoutAsync(Guid userId)
        {
            var route = await _routeService.GetUserRouteAsync(userId);
            if (!route.Items.Any())
            {
                throw new Exception("Ваш маршрут пуст. Добавьте активности перед оформлением заказа.");
            }

            var userEntity = await _userRepository.GetByIdAsync(userId);

            var schedulesInfo = new List<(ActivitySchedule Schedule, decimal Price)>();
            foreach (var item in route.Items)
            {
                var schedule = await _scheduleRepo.GetByIdAsync(item.ScheduleId);
                if (schedule == null || schedule.Activity == null)
                    throw new Exception($"Данные для '{item.Title}' не найдены");

                if (schedule.AvailableSeats <= 0)
                    throw new Exception($"К сожалению, на '{item.Title}' закончились места.");

                schedulesInfo.Add((schedule, item.Price));
            }

            var groupedSchedules = schedulesInfo.GroupBy(s => s.Schedule.Activity.SellerId);
            var createdOrderIds = new List<Guid>();

            foreach (var group in groupedSchedules)
            {
                var order = new Order
                {
                    ClientId = userId,
                    Status = Domain.Enums.OrderStatus.Pending,
                    TotalAmount = group.Sum(g => g.Price),
                    Items = new List<OrderItem>()
                };

                foreach (var data in group)
                {
                    data.Schedule.BookedSeats += 1;
                    await _scheduleRepo.UpdateAsync(data.Schedule);

                    order.Items.Add(new OrderItem
                    {
                        ScheduleId = data.Schedule.Id,
                        PriceAtTimeOfBooking = data.Price
                    });
                }

                var orderId = await _orderRepo.CreateOrderAsync(order);
                createdOrderIds.Add(orderId);
                if (userEntity != null && !string.IsNullOrEmpty(userEntity.Email))
                {
                    string subject = $"Новое бронирование #{orderId.ToString().Substring(0, 8).ToUpper()} оформлено!";
                    string body = $@"
                        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;'>
                            <h2 style='color: #faad14;'>Ваш заказ ожидает подтверждения</h2>
                            <p>Здравствуйте!</p>
                            <p>Вы успешно забронировали места на маршрут. Заказ передан гиду на проверку.</p>
                            <p><b>Сумма к оплате:</b> {order.TotalAmount} ₽</p>
                            <p>После того как гид подтвердит бронирование, вам придет уведомление со ссылкой на оплату.</p>
                            <hr style='border: none; border-top: 1px solid #eee;' />
                            <small style='color: #888;'>Это автоматическое уведомление, отвечать на него не нужно.</small>
                        </div>";

                    _ = _emailService.SendEmailAsync(userEntity.Email, subject, body);
                }
            }

            await _routeService.ClearRouteAsync(userId);
            return createdOrderIds;
        }
        public async Task<IEnumerable<UserOrderResponse>> GetUserOrdersAsync(Guid userId)
        {
            var orders = await _orderRepo.GetByClientIdAsync(userId);

            return orders.Select(o => new UserOrderResponse
            {
                OrderId = o.Id,
                CreatedAt = o.CreatedAt,
                Status = o.Status.ToString(),
                TotalAmount = o.TotalAmount,
                Items = o.Items.Select(i => new OrderItemDto
                {
                    ActivityId = i.Schedule?.ActivityId ?? Guid.Empty,
                    ScheduleId = i.ScheduleId,

                    ActivityTitle = i.Schedule?.Activity?.Title ?? "Удаленная активность",
                    StartTime = i.Schedule?.StartTime ?? DateTime.MinValue,
                    Price = i.PriceAtTimeOfBooking
                }).ToList()
            });
        }
        public async Task<SellerDashboardResponse> GetScheduleParticipantsAsync(Guid scheduleId, Guid sellerId)
        {
            var items = await _orderRepo.GetOrdersByScheduleAsync(scheduleId);

            var firstItem = items.FirstOrDefault();
            if (firstItem != null && firstItem.Schedule.Activity.SellerId != sellerId)
            {
                throw new Exception("У вас нет прав на просмотр этого списка участников.");
            }

            if (firstItem == null)
            {
                var schedule = await _scheduleRepo.GetByIdAsync(scheduleId);
                return new SellerDashboardResponse
                {
                    ActivityTitle = schedule?.Activity?.Title ?? "Неизвестно",
                    StartTime = schedule?.StartTime ?? DateTime.MinValue
                };
            }

            return new SellerDashboardResponse
            {
                ScheduleId = scheduleId,
                ActivityTitle = firstItem.Schedule.Activity.Title,
                StartTime = firstItem.Schedule.StartTime,
                TotalBooked = items.Count(),
                Participants = items.Select(i => new ParticipantDto
                {
                    FullName = i.Order.Client.FullName,
                    Email = i.Order.Client.Email,
                    OrderDate = i.Order.CreatedAt
                }).ToList()
            };
        }

        public async Task<IEnumerable<UserOrderResponse>> GetOrdersForSellerAsync(Guid sellerId)
        {
            var allOrders = await _orderRepo.GetAllAsync();

            var sellerOrders = allOrders
                .Where(o => o.Items != null && o.Items.Any(i => i.Schedule?.Activity?.SellerId == sellerId))
                .OrderByDescending(o => o.CreatedAt);

            return sellerOrders.Select(o => new UserOrderResponse
            {
                OrderId = o.Id,
                CreatedAt = o.CreatedAt,
                Status = ((int)o.Status).ToString(),
                TotalAmount = o.TotalAmount,
                Items = o.Items
                    .Where(i => i.Schedule?.Activity?.SellerId == sellerId)
                    .Select(i => new OrderItemDto
                    {
                        ScheduleId = i.ScheduleId,
                        ActivityTitle = i.Schedule?.Activity?.Title ?? "Неизвестный тур",
                        StartTime = i.Schedule?.StartTime ?? DateTime.MinValue,
                        Price = i.PriceAtTimeOfBooking
                    }).ToList()
            });
        }

        public async Task UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus, Guid sellerId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId);
            if (order == null) throw new Exception("Заказ не найден");

            var isOwner = order.Items.Any(i => i.Schedule.Activity.SellerId == sellerId);
            if (!isOwner) throw new UnauthorizedAccessException("Нет прав доступа к этому заказу");

            if (newStatus == OrderStatus.Cancelled && order.Status != OrderStatus.Cancelled)
            {
                foreach (var item in order.Items)
                {
                    var schedule = await _scheduleRepo.GetByIdAsync(item.ScheduleId);
                    if (schedule != null)
                    {
                        schedule.BookedSeats = Math.Max(0, schedule.BookedSeats - 1);
                        await _scheduleRepo.UpdateAsync(schedule);
                    }
                }
            }

            order.Status = newStatus;
            await _orderRepo.UpdateAsync(order);
            if (order.Client != null && !string.IsNullOrEmpty(order.Client.Email))
            {
                string statusText = newStatus switch
                {
                    OrderStatus.Pending => "Ожидает подтверждения продавцом",
                    OrderStatus.Confirmed => "Подтвержден гидом (Ожидает вашей оплаты)",
                    OrderStatus.Paid => "Успешно оплачен",
                    OrderStatus.Cancelled => "Отменен",
                    _ => newStatus.ToString()
                };

                string color = newStatus == OrderStatus.Confirmed ? "#1890ff" : newStatus == OrderStatus.Paid ? "#52c41a" : "#ff4d4f";

                string subject = $"Статус заказа #{orderId.ToString().Substring(0, 8).ToUpper()} обновлен";
                string body = $@"
                    <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;'>
                        <h2>Обновление статуса вашей поездки</h2>
                        <p>Здравствуйте!</p>
                        <p>Гид изменил статус вашего заказа <b>#{orderId.ToString().Substring(0, 8).ToUpper()}</b>.</p>
                        <div style='background: #fafafa; padding: 15px; border-left: 4px solid {color}; margin: 15px 0;'>
                            <p style='margin: 0; font-size: 16px;'>Новый статус: <strong style='color: {color};'>{statusText.ToUpper()}</strong></p>
                        </div>
                        <p>Сумма заказа: <b>{order.TotalAmount} ₽</b></p>
                        <p>Вы можете проверить детализацию маршрута в личном кабинете TourismApp во вкладке «Мои заказы».</p>
                    </div>";

                _ = _emailService.SendEmailAsync(order.Client.Email, subject, body);
            }
        }
    }
}
