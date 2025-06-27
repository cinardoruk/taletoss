// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

using System.ComponentModel.DataAnnotations;

namespace backend.Data;

public class ApiLoginRequest
{
    [Required(ErrorMessage = "Email is required.")]
    public required string Email { get; set; } 
    [Required(ErrorMessage = "Password is required.")]
    public required string Password { get; set; }
}