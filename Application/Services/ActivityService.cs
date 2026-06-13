using Application.DTOs.Activities;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public interface IActivityService
    {
        Task<Guid> CreateActivityAsync(CreateActivityRequest request, Guid sellerId);
        Task<Guid> AddScheduleAsync(Guid activityId, AddScheduleRequest request, Guid sellerId);
        Task<IEnumerable<ActivityResponse>> GetAllActivitiesAsync();
        Task<IEnumerable<ActivityResponse>> GetActivitiesBySellerIdAsync(Guid sellerId);
        Task<ActivityDetailsResponse> GetActivityDetailsAsync(Guid id);
        Task UpdateActivityAsync(Guid id, CreateActivityRequest request, Guid sellerId);
        Task DeleteActivityAsync(Guid id);
    }

    public class ActivityService : IActivityService
    {
        private readonly IActivityRepository _activityRepo;
        private readonly IActivityDetailsRepository _detailsRepo;
        private readonly IActivityScheduleRepository _scheduleRepo;

        public ActivityService(
            IActivityRepository activityRepo,
            IActivityDetailsRepository detailsRepo,
            IActivityScheduleRepository scheduleRepo)
        {
            _activityRepo = activityRepo;
            _detailsRepo = detailsRepo;
            _scheduleRepo = scheduleRepo;
        }

        public async Task<Guid> CreateActivityAsync(CreateActivityRequest request, Guid sellerId)
        {
            var activity = new Activity
            {
                Title = request.Title,
                BasePrice = request.BasePrice,
                MaxParticipants = request.MaxParticipants,
                SellerId = sellerId
            };
            await _activityRepo.AddAsync(activity);

            var details = new ActivityDetailsDocument
            {
                ActivityId = activity.Id,
                Description = request.Description,
                ImageUrls = request.ImageUrls,
                Attributes = request.Attributes,
                IncludedInPrice = request.IncludedInPrice
            };
            await _detailsRepo.AddAsync(details);

            return activity.Id;
        }

        public async Task<Guid> AddScheduleAsync(Guid activityId, AddScheduleRequest request, Guid sellerId)
        {
            var activity = await _activityRepo.GetByIdAsync(activityId);
            if (activity == null)
            {
                throw new Exception("Активность не найдена");
            }

            if (activity.SellerId != sellerId)
            {
                throw new UnauthorizedAccessException("Вы не являетесь владельцем этой активности");
            }

            var schedule = new ActivitySchedule
            {
                ActivityId = activityId,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                TotalSeats = request.TotalSeats,
                BookedSeats = 0
            };

            await _scheduleRepo.AddAsync(schedule);

            return schedule.Id;
        }

        public async Task<IEnumerable<ActivityResponse>> GetAllActivitiesAsync()
        {
            var activities = await _activityRepo.GetAllActiveAsync();
            var responseList = new List<ActivityResponse>();

            foreach (var a in activities)
            {
                var details = await _detailsRepo.GetByActivityIdAsync(a.Id);

                responseList.Add(new ActivityResponse
                {
                    Id = a.Id,
                    Title = a.Title,
                    BasePrice = a.BasePrice,
                    ImageUrls = details?.ImageUrls ?? new List<string>()
                });
            }

            return responseList;
        }

        public async Task<IEnumerable<ActivityResponse>> GetActivitiesBySellerIdAsync(Guid sellerId)
        {
            var activities = await _activityRepo.GetBySellerIdAsync(sellerId);
            var responseList = new List<ActivityResponse>();

            foreach (var a in activities)
            {
                var details = await _detailsRepo.GetByActivityIdAsync(a.Id);

                responseList.Add(new ActivityResponse
                {
                    Id = a.Id,
                    Title = a.Title,
                    BasePrice = a.BasePrice,
                    ImageUrls = details?.ImageUrls ?? new List<string>()
                });
            }

            return responseList;
        }

        public async Task<ActivityDetailsResponse> GetActivityDetailsAsync(Guid id)
        {
            var activity = await _activityRepo.GetByIdWithSchedulesAsync(id);
            if (activity == null) throw new Exception("Активность не найдена");

            var details = await _detailsRepo.GetByActivityIdAsync(id);

            return new ActivityDetailsResponse
            {
                Id = activity.Id,
                Title = activity.Title,
                BasePrice = activity.BasePrice,
                MaxParticipants = activity.MaxParticipants,

                Description = details?.Description ?? "",
                ImageUrls = details?.ImageUrls ?? new List<string>(),
                Attributes = details?.Attributes ?? new Dictionary<string, string>(),
                IncludedInPrice = details?.IncludedInPrice ?? new List<string>(),

                Schedules = activity.Schedules.Select(s => new ScheduleResponse
                {
                    Id = s.Id,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    AvailableSeats = s.AvailableSeats
                }).ToList()
            };
        }
        public async Task UpdateActivityAsync(Guid id, CreateActivityRequest request, Guid sellerId)
        {
            var activity = await _activityRepo.GetByIdAsync(id);
            if (activity == null) throw new Exception("Активность не найдена");     
            if (activity.SellerId != sellerId) throw new UnauthorizedAccessException("Нет прав на редактирование");

            activity.Title = request.Title;
            activity.BasePrice = request.BasePrice;
            activity.MaxParticipants = request.MaxParticipants;

            await _activityRepo.UpdateAsync(activity);

            var details = await _detailsRepo.GetByActivityIdAsync(id);
            if (details != null)
            {
                details.Description = request.Description;
                details.ImageUrls = request.ImageUrls;
                details.Attributes = request.Attributes;
                details.IncludedInPrice = request.IncludedInPrice;

                await _detailsRepo.UpdateAsync(details);
            }
        }
        public async Task DeleteActivityAsync(Guid id)
        {
            var activity = await _activityRepo.GetByIdAsync(id);
            if (activity != null)
            {
                activity.IsDeleted = true;
                await _activityRepo.UpdateAsync(activity);
            }
        }
        
    }
}