import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!import.meta.env.EMAIL_USER || !import.meta.env.EMAIL_PASS) {
      throw new Error(
        "Missing email configuration. Please check your .env file."
      );
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    // Verify SMTP connection configuration
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: import.meta.env.EMAIL_USER,
      to: import.meta.env.EMAIL_USER,
      subject: "New Subscriber",
      text: `New subscriber email: ${email}`,
      html: `<p>New subscriber email: <strong>${email}</strong></p>`,
    });

    return new Response(
      JSON.stringify({
        message: "Subscription successful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Subscription error details:", {
      message: error?.message || "Unknown error",
      stack: error?.stack,
      name: error?.name,
    });

    return new Response(
      JSON.stringify({
        message: "Subscription failed",
        error: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
