using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class SellerDashboardResponse
    {
        public Guid ScheduleId { get; set; }
        public string ActivityTitle { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public int TotalBooked { get; set; }
        public List<ParticipantDto> Participants { get; set; } = new();
    }

    public class ParticipantDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }
}
