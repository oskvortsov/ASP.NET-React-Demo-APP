using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    [Key]
    public string username { get; set; }
    
    [Required]
    public string password { get; set; }
}