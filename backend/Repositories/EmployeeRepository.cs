using backend.Contexts;
using backend.Helper.Sorting;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class EmployeeRepository
{
    private readonly ISorting<Employee> _employeeSorting;
    private readonly MsSqlContext _dbContext;

    public EmployeeRepository(MsSqlContext dbContext, ISorting<Employee> employeeSorting)
    {
        _dbContext = dbContext;
        _employeeSorting = employeeSorting;
    }

    public Employee Create(Employee employee)
    {
        employee.LastModifiedDate = DateTime.Now;
        _dbContext.Employees.Add(employee);
        _dbContext.SaveChanges();

        return employee;
    }

    public async Task<List<Employee>> FinAll()
    {
        return await _dbContext.Employees.AsNoTracking().ToListAsync();
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