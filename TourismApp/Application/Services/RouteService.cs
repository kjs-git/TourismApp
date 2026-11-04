using Application.DTOs.Routes;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public interface IRouteService
    {
        Task<UserRoute> GetUserRouteAsync(Guid userId);
        Task AddItemToRouteAsync(Guid userId, AddToRouteRequest request);
        Task ClearRouteAsync(Guid userId);
    }

    public class RouteService : IRouteService
    {
        private readonly IRouteRepository _routeRepo;
        private readonly IActivityScheduleRepository _scheduleRepo;

        public RouteService(IRouteRepository routeRepo, IActivityScheduleRepository scheduleRepo)
        {
            _routeRepo = routeRepo;
            _scheduleRepo = scheduleRepo;
        }

        public async Task<UserRoute> GetUserRouteAsync(Guid userId)
        {
            return await _routeRepo.GetRouteAsync(userId) ?? new UserRoute { UserId = userId };
        }

        public async Task ClearRouteAsync(Guid userId)
        {
            await _routeRepo.DeleteRouteAsync(userId);
        }

        public async Task AddItemToRouteAsync(Guid userId, AddToRouteRequest request)
        {
            var schedule = await _scheduleRepo.GetByIdAsync(request.ScheduleId);
            if (schedule == null || schedule.Activity == null)
            {
                throw new Exception("Указанное расписание не найдено");
            }

            if (schedule.StartTime >= schedule.EndTime)
            {
                throw new Exception("Ошибка в данных: время окончания активности должно быть позже времени начала.");
            }

            var route = await GetUserRouteAsync(userId);

            var hasClash = route.Items.Any(item =>
                schedule.StartTime < item.EndTime &&
                schedule.EndTime > item.StartTime);

            if (hasClash)
            {
                throw new Exception("Выбранное время пересекается с уже добавленной активностью в вашем маршруте!");
            }

            if (schedule.AvailableSeats <= 0)
            {
                throw new Exception("К сожалению, на это время не осталось свободных мест");
            }

            route.Items.Add(new RouteItem
            {
                ActivityId = schedule.ActivityId,
                Title = schedule.Activity.Title,
                Price = schedule.Activity.BasePrice,
                ScheduleId = schedule.Id,
                StartTime = schedule.StartTime,
                EndTime = schedule.EndTime
            });

            route.LastUpdated = DateTime.UtcNow;

            await _routeRepo.UpdateRouteAsync(route);
        }
    }
}