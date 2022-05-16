namespace backend.Models;

public class EmployeeDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime BirthDateTime { get; set; }
    public int Salary { get; set; }
}