using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Mongo;
using MongoDB.Driver;


namespace Infrastructure.Repositories
{
    public class ActivityDetailsRepository : IActivityDetailsRepository
    {
        private readonly MongoDbContext _context;
        public ActivityDetailsRepository(MongoDbContext context) => _context = context;

        public async Task AddAsync(ActivityDetailsDocument document) =>
            await _context.ActivityDetails.InsertOneAsync(document);

        public async Task<ActivityDetailsDocument?> GetByActivityIdAsync(Guid activityId) =>
            await _context.ActivityDetails.Find(d => d.ActivityId == activityId).FirstOrDefaultAsync();
        public async Task UpdateAsync(ActivityDetailsDocument document)
        {
            await _context.ActivityDetails.ReplaceOneAsync(
                d => d.ActivityId == document.ActivityId,
                document
            );
        }
    }
}