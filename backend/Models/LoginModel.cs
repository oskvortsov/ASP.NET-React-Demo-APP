using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class LoginModel
{
    [Key]
    [Required(ErrorMessage = "User Name is required")]
    public string? Username { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}