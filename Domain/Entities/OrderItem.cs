using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid OrderId { get; set; }
        public Order? Order { get; set; }

        public Guid ScheduleId { get; set; }
        public ActivitySchedule? Schedule { get; set; }
        public decimal PriceAtTimeOfBooking { get; set; }
    }
}
