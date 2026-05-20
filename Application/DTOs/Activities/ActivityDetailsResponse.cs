using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Activities
{
    public class ActivityDetailsResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxParticipants { get; set; }
        public string Description { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();
        public Dictionary<string, string> Attributes { get; set; } = new();
        public List<string> IncludedInPrice { get; set; } = new();
        public List<ScheduleResponse> Schedules { get; set; } = new();
    }

    public class ScheduleResponse
    {
        public Guid Id { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int AvailableSeats { get; set; }
    }
}
