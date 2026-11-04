using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IActivityRepository
    {
        Task AddAsync(Activity activity);
        Task<Activity?> GetByIdAsync(Guid id);
        Task<IEnumerable<Activity>> GetAllActiveAsync();
        Task<Activity?> GetByIdWithSchedulesAsync(Guid id);
        Task<IEnumerable<Activity>> GetBySellerIdAsync(Guid sellerId);
        Task UpdateAsync(Activity activity);
        Task DeleteAsync(Activity activity);
    }
}
