using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Activity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid SellerId { get; set; }

        public string Title { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }

        public int MaxParticipants { get; set; }

        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public ICollection<ActivitySchedule> Schedules { get; set; } = new List<ActivitySchedule>();

    }
}
