import { Express } from 'express';
import { createServer, Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      console.log("Contact form submission:", {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
      });

      res.json({ message: "Message sent successfully", success: true });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
        message: "Message sent successfully",
        success: true
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
