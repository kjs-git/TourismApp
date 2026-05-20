using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.DTOs
{
    public class CreateReviewRequest
    {
        public Guid ActivityId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
