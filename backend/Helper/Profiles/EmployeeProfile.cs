using AutoMapper;
using backend.Helper.Pagintaion;
using backend.Models;

namespace backend.Helper.Profiles;

public class EmployeeProfile: Profile
{
    public EmployeeProfile()
    {
        CreateMap<Employee, EmployeeDTO>();
        CreateMap(typeof(PageList<Employee>), typeof(PageList<EmployeeDTO>))
            .ConvertUsing(typeof(PageListConverter<Employee, EmployeeDTO>));
    }
}