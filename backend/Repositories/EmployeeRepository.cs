using backend.Contexts;
using backend.Controllers;
using backend.Extensions;
using backend.Helper.Pagintaion;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class EmployeeRepository
{
    private readonly MsSqlContext _dbContext;

    public EmployeeRepository(MsSqlContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Employee Create(Employee employee)
    {
        employee.LastModifiedDate = DateTime.Now;
        _dbContext.Employees.Add(employee);
        _dbContext.SaveChanges();

        return employee;
    }

    public IQueryable<Employee> FindAll()
    {
        return _dbContext.Employees.AsNoTracking();
    }

    public async Task<PageList<Employee>> GetEmployees(EmployeeParams employeeParams)
    {
        var employees = FindAll();
        employees = employees.ApplySort(employeeParams.OrderBy);

        return await PageList<Employee>.ToPageList(employees, employeeParams.PageNumber, employeeParams.PageSize);
    }

    public Employee Update(int id, Employee employee)
    {
        employee.Id = id;
        employee.LastModifiedDate = DateTime.UtcNow;
        
        _dbContext.Entry(employee).State = EntityState.Modified;;
        _dbContext.Employees.Update(employee);
        _dbContext.SaveChanges();

        return employee;
    }

    public async Task<bool> Delete(int id)
    {
        var employee = await GetById(id);

        if (employee == null)
        {
            return false;
        }

        _dbContext.Employees.Remove(employee);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<Employee?> GetById(int id)
    {
        var employee = await _dbContext.Employees.FindAsync(id);
        return employee;
    }
}