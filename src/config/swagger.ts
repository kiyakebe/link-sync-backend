import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
import { env } from "./env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkedIn Sync API",
      version: "1.0.0",
      description: `API for synchronizing LinkedIn analytics data and sending notifications to Slack.`,
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from /api/auth/login endpoint",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            stack: {
              type: "string",
              description: "Error stack trace (development only)",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "admin@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "yourpassword",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              description: "JWT token for authentication",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            expiresIn: {
              type: "string",
              description: "Token expiration time",
              example: "24h",
            },
          },
        },
        Organization: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "LinkedIn organization ID",
            },
            name: {
              type: "string",
              description: "Organization name",
            },
          },
        },
        OrganizationsResponse: {
          type: "object",
          properties: {
            count: {
              type: "number",
              description: "Number of organizations",
            },
            message: {
              type: "string",
              description:
                "Optional message (present when no data is available)",
            },
            organizations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Organization",
              },
            },
          },
        },
        SlackNotificationResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Slack notification sent",
            },
            count: {
              type: "number",
              description: "Number of organizations in the notification",
            },
          },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "ok",
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routers/*.ts"),
    path.join(__dirname, "../app.ts"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Swagger JSON endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "LinkedIn Sync API Documentation",
      swaggerOptions: {
        persistAuthorization: true, // Persist authorization across page reloads
        displayRequestDuration: true,
        filter: true, // Enable filter box
        tryItOutEnabled: true,
      },
    })
  );
};

export default swaggerSpec;
