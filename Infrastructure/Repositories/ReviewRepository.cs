using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Mongo;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly MongoDbContext _context;

        public ReviewRepository(MongoDbContext context) => _context = context;

        public async Task AddAsync(Review review) =>
            await _context.Reviews.InsertOneAsync(review);

        public async Task<IEnumerable<Review>> GetByActivityIdAsync(Guid activityId) =>
            await _context.Reviews
                .Find(r => r.ActivityId == activityId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();
        public async Task<IEnumerable<Review>> GetAllAsync() =>
        await _context.Reviews
            .Find(_ => true)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();

        public async Task DeleteAsync(string id) =>
            await _context.Reviews.DeleteOneAsync(r => r.Id == id);
    }
}
