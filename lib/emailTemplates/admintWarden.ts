export const adminAccountCreated = (name: string, email: string, password: string, role: string) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Welcome ${name},</h2>
    <p>🎉 Congratulations! Your <strong>${role}</strong> account has been successfully created in our system.</p>
    <p>Here are your login credentials:</p>

    <ul>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Password:</strong> ${password}</li>
    </ul>

    <p>🔐 Please make sure to change your password after your first login for security purposes.</p>

    <p>If you have any questions or need assistance, feel free to reach out to the support team.</p>

    <br />
    <p>Regards,</p>
    <p><strong>System Admin</strong></p>
  </div>
`;
