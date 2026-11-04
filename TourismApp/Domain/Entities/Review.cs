using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public Guid ActivityId { get; set; }

        public Guid UserId { get; set; }
        public string UserFullName { get; set; } = string.Empty;

        public int Rating { get; set; } 
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<string> ImageUrls { get; set; } = new List<string>();
    }
}
