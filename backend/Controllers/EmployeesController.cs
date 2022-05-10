using backend.Contexts;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("employee")]
public class EmployeesController: ControllerBase
{
    private readonly MsSqlContext _dbContext;

    public EmployeesController(MsSqlContext db)
    {
        _dbContext = db;
    }

    [HttpGet]
    public List<Employee> List()
    {
        var persons = _dbContext.Employees.ToList();
        return persons;
    }

    [HttpGet("{id:int}")]
    public IActionResult Get(int id)
    {
        var person = _dbContext.Employees.Find(id);

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
        _dbContext.Add(employee);
        _dbContext.SaveChanges();

        return Ok(employee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Employee employee)
    {
        employee.Id = id;
        employee.LastModifiedDate = DateTime.UtcNow;
        
        _dbContext.Entry(employee).State = EntityState.Modified;
        _dbContext.SaveChanges();

        return Ok(employee);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var employee = _dbContext.Employees.Find(id);

        if (employee == null)
        {
            return NotFoundMessageById(id);
        }

        _dbContext.Employees.Remove(employee);
        _dbContext.SaveChanges();
        return Ok("Employee have been removed");
    }

    private IActionResult NotFoundMessageById(int id)
    {
        return NotFound($"Employee with ID({id}) not found");
    }
}