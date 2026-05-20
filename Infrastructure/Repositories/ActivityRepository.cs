using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class ActivityRepository : IActivityRepository
    {
        private readonly TourismDbContext _context;
        public ActivityRepository(TourismDbContext context) => _context = context;

        public async Task AddAsync(Activity activity)
        {
            await _context.Activities.AddAsync(activity);
            await _context.SaveChangesAsync();
        }

        public async Task<Activity?> GetByIdAsync(Guid id) =>
            await _context.Activities.FindAsync(id);
        public async Task UpdateAsync(Activity activity)
        {
            _context.Activities.Update(activity);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Activity>> GetAllActiveAsync()
        {
            return await _context.Activities
                .Where(a => a.IsActive)
                .ToListAsync();
        }

        public async Task<Activity?> GetByIdWithSchedulesAsync(Guid id)
        {
            return await _context.Activities
                .Include(a => a.Schedules) 
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Activity>> GetBySellerIdAsync(Guid sellerId)
        {
            return await _context.Activities
                .Where(a => a.SellerId == sellerId) 
                .ToListAsync();
        }
        public async Task DeleteAsync(Activity activity)
        {
            _context.Activities.Remove(activity);
            await _context.SaveChangesAsync();
        }
    }
}
