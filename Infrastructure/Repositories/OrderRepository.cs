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
    public class OrderRepository : IOrderRepository
    {
        private readonly TourismDbContext _context;

        public OrderRepository(TourismDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
            return order.Id;
        }

        public async Task<IEnumerable<Order>> GetByClientIdAsync(Guid clientId)
        {
            return await _context.Orders
                .IgnoreQueryFilters() // <--- Игнорируем фильтр удаленных туров
                .Include(o => o.Items)
                    .ThenInclude(i => i.Schedule)
                        .ThenInclude(s => s.Activity)
                .Where(o => o.ClientId == clientId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<OrderItem>> GetOrdersByScheduleAsync(Guid scheduleId)
        {
            return await _context.OrderItems
                .IgnoreQueryFilters() // <--- Игнорируем фильтр удаленных туров
                .Include(oi => oi.Order)
                    .ThenInclude(o => o.Client)
                .Include(oi => oi.Schedule)
                    .ThenInclude(s => s.Activity)
                .Where(oi => oi.ScheduleId == scheduleId)
                .ToListAsync();
        }

        public async Task<Order> GetByIdAsync(Guid id)
        {
            return await _context.Orders
                .IgnoreQueryFilters() // <--- Игнорируем фильтр удаленных туров
                .Include(o => o.Items)
                    .ThenInclude(i => i.Schedule)
                        .ThenInclude(s => s.Activity)
                .Include(o => o.Client)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .IgnoreQueryFilters() // <--- Игнорируем фильтр удаленных туров
                .Include(o => o.Items)
                    .ThenInclude(i => i.Schedule)
                        .ThenInclude(s => s.Activity)
                .Include(o => o.Client)
                .ToListAsync();
        }
    }
}
