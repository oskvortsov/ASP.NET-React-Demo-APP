using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class User
{
    [Key]
    [Required]
    public string Username { get; set; }
    
    [Required]
    [PasswordPropertyText]
    public string Password { get; set; }
}