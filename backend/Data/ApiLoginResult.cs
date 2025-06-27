// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

namespace backend.Data;

public class ApiLoginResult
{
    ///<summary>
    /// TRUE if the login attempt is successful, FALSE otherwise.
    /// </summary>
    public bool Success { get; set; }

    ///<summary>
    /// login attempt result message.
    /// </summary>
    public required string Message { get; set; }

    ///<summary>
    /// The JWT token if the login attempt is successful, or NULL if not
    /// </summary>
    public string? Token { get; set; }

}