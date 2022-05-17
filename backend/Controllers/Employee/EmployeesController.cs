using AutoMapper;
using backend.Helper.Pagintaion;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// [Authorize]
[ApiController]
[Route("employee")]
public class EmployeesController: ControllerBase
{
    private readonly EmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public EmployeesController(EmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public  async Task<PageList<EmployeeDTO>> List([FromQuery] EmployeeParams employeeParams)
    {
        var employees = await _employeeRepository.GetEmployees(employeeParams);
        Response.Headers.Add("X-Pagination", employees.GetMetadata());

        return _mapper.Map<PageList<EmployeeDTO>>(employees);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var person = await _employeeRepository.GetById(id);

        if (person == null)
        {
            return NotFoundMessageById(id);
        }

        var mappedPerson = _mapper.Map<EmployeeDTO>(person);

        return Ok(mappedPerson);
    }

    [HttpPost]
    public IActionResult Create(Employee employee)
    {
        var newEmployee = _mapper.Map<EmployeeDTO>(_employeeRepository.Create(employee));
        return Ok(newEmployee);
    }

    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] Employee employee)
    {
        var updatedEmployee = _mapper.Map<EmployeeDTO>(_employeeRepository.Update(id, employee));
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