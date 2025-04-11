export default function accountDeletedTemplate(name: string, role: string) {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>We would like to inform you that your ${role} account has been <strong>deleted</strong> from our system.</p>
        <p>This action was taken by the administration. If you believe this was a mistake or want to appeal, please reach out to support or contact the college authorities directly.</p>
        <p>We appreciate your time on our platform.</p>
        <br />
        <p>Best regards,<br />Hostel Management System</p>
      </div>
    `;
  }
  