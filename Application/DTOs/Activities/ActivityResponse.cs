using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Activities
{
    public class ActivityResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
    }
}
