using backend.Contexts;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("employee")]
public class EmployeesController: ControllerBase
{
    private readonly MsSqlContext dbContext;

    public EmployeesController(MsSqlContext db)
    {
        dbContext = db;
    }

    [HttpGet]
    public List<Employee> List()
    {
        var persons = dbContext.Employees.ToList();
        return persons;
    }

    [HttpGet("{id:int}")]
    public IActionResult Get(int id)
    {
        var person = dbContext.Employees.Find(id);

        if (person == null)
        {
            return NotFoundMessageById(id);
        }

        return Ok(person);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Employee employee)
    {
        employee.LastModifiedDate = DateTime.Now;
        dbContext.Add(employee);
        dbContext.SaveChanges();

        return Ok(employee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Employee employee)
    {
        employee.Id = id;
        employee.LastModifiedDate = DateTime.UtcNow;
        
        dbContext.Entry(employee).State = EntityState.Modified;
        dbContext.SaveChanges();

        return Ok(employee);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var employee = dbContext.Employees.Find(id);

        if (employee == null)
        {
            return NotFoundMessageById(id);
        }

        dbContext.Employees.Remove(employee);
        dbContext.SaveChanges();
        return Ok("Employee have been removed");
    }

    private IActionResult NotFoundMessageById(int id)
    {
        return NotFound($"Employee with ID({id}) not found");
    }
}