export const accountRequestSent = (studentName: string) => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f7f7;
            padding: 30px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .header {
            font-size: 20px;
            color: #4caf50;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
          }
          .footer {
            font-size: 14px;
            color: #888888;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">🎉 Account Request Submitted</div>
          <div class="content">
            Hello <strong>${studentName}</strong>,<br /><br />
    
            Your account request has been successfully submitted and is pending for approval by the administrator.<br /><br />
    
            Once approved, you’ll receive access to your student dashboard using your ID password.<br /><br />
    
            Thank you for your patience!
          </div>
          <div class="footer">
            &copy; ${year} HostelSphere. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `;
};

export const accountRequestApproved = (studentName: string, email:string ) => {
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        border-left: 5px solid #4caf50;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
      .header {
        font-size: 22px;
        color: #4caf50;
        margin-bottom: 15px;
      }
      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        font-size: 13px;
        color: #777777;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">✅ Request Approved</div>
      <div class="content">
        Hello <strong>${studentName}</strong>,<br /><br />

        Great news! Your account request has been approved by the administrator.<br /><br />

        You can now log in and access your student dashboard using your ID password.<br /><br />

        Welcome to HostelSphere! 🎓
      </div>
      <div class="footer">
        &copy; ${year} Hostel Sphere
      </div>
    </div>
  </body>
</html>
`;
};

export const accountRequestReject = (studentName: string, email: string) => {

  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 10px;
        border-left: 5px solid #f44336;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
      }
      .header {
        font-size: 22px;
        color: #f44336;
        margin-bottom: 15px;
      }
      .content {
        font-size: 16px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        font-size: 13px;
        color: #777777;
        margin-top: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">❌ Request Rejected</div>
      <div class="content">
        Hello <strong>${studentName}</strong>,<br /><br />

        We regret to inform you that your account request with that ${email} has been rejected by the administrator.<br /><br />

        This could be due to incorrect or incomplete information. Please contact your college admin for further clarification or to try again.<br /><br />

        Thank you for your understanding.
      </div>
      <div class="footer">
        <p>Best regards,<br />Hostel Management System</p>
      </div>
    </div>
  </body>
</html>
`;
};
