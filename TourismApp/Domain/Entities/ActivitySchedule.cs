using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ActivitySchedule
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ActivityId { get; set; }
        public Activity? Activity { get; set; } 

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int TotalSeats { get; set; }
        public int BookedSeats { get; set; } = 0;

        public int AvailableSeats => TotalSeats - BookedSeats;
    }
}
