using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IReviewRepository
    {
        Task AddAsync(Review review);
        Task<IEnumerable<Review>> GetByActivityIdAsync(Guid activityId);
        Task<IEnumerable<Review>> GetAllAsync();
        Task DeleteAsync(string id);
    }
}
