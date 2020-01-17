using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;


namespace sage_hiring_api.Models
{

    public class Customer 
    {
        [Key]
        public int CustomerId { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;
        
        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; }

        public string Additional { get; set; }
    }
}