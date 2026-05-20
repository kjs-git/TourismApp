using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Activities
{
    public class CreateComboActivityRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public List<Guid> ChildActivityIds { get; set; } = new();
    }

    public class AddComboScheduleRequest
    {
        public List<Guid> ChildScheduleIds { get; set; } = new();
    }
}
