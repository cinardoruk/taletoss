// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Entities;
namespace backend.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<TaleDie> TaleDice { get; set; }
    
}
