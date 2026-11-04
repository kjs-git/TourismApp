using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class UserRoute
    {
        public Guid UserId { get; set; }

        public List<RouteItem> Items { get; set; } = new();

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }

    public class RouteItem
    {
        public Guid ActivityId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public Guid ScheduleId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
