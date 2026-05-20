using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IActivityDetailsRepository
    {
        Task AddAsync(ActivityDetailsDocument document);
        Task<ActivityDetailsDocument?> GetByActivityIdAsync(Guid activityId);
        Task UpdateAsync(ActivityDetailsDocument document);
    }
}
