using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Activities
{
    public class CreateActivityRequest
    {
        public string Title { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public int MaxParticipants { get; set; }

        public string Description { get; set; } = string.Empty;
        public List<string> ImageUrls { get; set; } = new();
        public Dictionary<string, string> Attributes { get; set; } = new();
        public List<string> IncludedInPrice { get; set; } = new();
    }
}
