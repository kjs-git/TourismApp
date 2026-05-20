using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IOrderRepository
    {
        Task<Guid> CreateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetByClientIdAsync(Guid clientId);
        Task<IEnumerable<OrderItem>> GetOrdersByScheduleAsync(Guid scheduleId);
        Task<Order> GetByIdAsync(Guid id);
        Task UpdateAsync(Order order);
        Task<IEnumerable<Order>> GetAllAsync();
    }
}
