using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// what's happening here syntactically?
builder.Services.AddDbContext<DataContext>(opt =>
    {
        opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
    policy => policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
                    .AllowAnyMethod()
                    .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{

}

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

app.Run();
