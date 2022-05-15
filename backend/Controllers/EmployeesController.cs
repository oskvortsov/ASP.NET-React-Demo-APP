using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("employee")]
public class EmployeesController: ControllerBase
{
    private readonly EmployeeRepository _employeeRepository;

    public EmployeesController(EmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    [HttpGet]
    public  async Task<List<Employee>> List()
    {
        return await _employeeRepository.FinAll();
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var person = await _employeeRepository.GetById(id);

        if (person == null)
        {
            return NotFoundMessageById(id);
        }

        return Ok(person);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Employee employee)
    {
        var newEmployee = _employeeRepository.Create(employee);
        return Ok(newEmployee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Employee employee)
    {
        var updatedEmployee = _employeeRepository.Update(id, employee);
        return Ok(updatedEmployee);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _employeeRepository.Delete(id);

        if (result)
        {
            return Ok("Employee have been removed");
        }
        
        return NotFoundMessageById(id);
    }

    private IActionResult NotFoundMessageById(int id)
    {
        return NotFound($"Employee with ID({id}) not found");
    }
}