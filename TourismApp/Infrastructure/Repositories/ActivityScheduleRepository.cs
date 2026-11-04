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
    public class ActivityScheduleRepository : IActivityScheduleRepository
    {
        private readonly TourismDbContext _context;

        public ActivityScheduleRepository(TourismDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ActivitySchedule schedule)
        {
            await _context.ActivitySchedules.AddAsync(schedule);
            await _context.SaveChangesAsync();
        }
        public async Task<ActivitySchedule?> GetByIdAsync(Guid id)
        {
            return await _context.ActivitySchedules
                .Include(s => s.Activity)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
        public async Task UpdateAsync(ActivitySchedule schedule)
        {
            _context.ActivitySchedules.Update(schedule);
            await _context.SaveChangesAsync();
        }
    }
}
