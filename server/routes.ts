import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCourseSchema, insertModuleSchema, insertLessonSchema, insertReviewSchema } from "@shared/schema";
import Paystack from "paystack";
import multer from "multer";
import path from "path";
import crypto from "crypto";

if (!process.env.PAYSTACK_SECRET_KEY) {
  throw new Error('Missing required Paystack secret: PAYSTACK_SECRET_KEY');
}
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const { limit, category, search } = req.query;
      const courses = await storage.getCourses(
        limit ? parseInt(limit as string) : 20,
        category as string,
        search as string
      );
      res.json(courses);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourseWithInstructor(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, upload.single('thumbnail'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseData = insertCourseSchema.parse({
        ...req.body,
        instructorId: userId,
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });

      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error: any) {
      console.error("Error creating course:", error);
      res.status(400).json({ message: "Failed to create course", error: error.message });
    }
  });

  app.put('/api/courses/:id', isAuthenticated, upload.single('thumbnail'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const course = await storage.getCourse(req.params.id);
      
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this course" });
      }

      const updateData = {
        ...req.body,
        ...(req.file && { thumbnailUrl: `/uploads/${req.file.filename}` }),
      };

      const updatedCourse = await storage.updateCourse(req.params.id, updateData);
      res.json(updatedCourse);
    } catch (error: any) {
      console.error("Error updating course:", error);
      res.status(400).json({ message: "Failed to update course", error: error.message });
    }
  });

  app.get('/api/my-courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courses = await storage.getCoursesByInstructor(userId);
      res.json(courses);
    } catch (error: any) {
      console.error("Error fetching instructor courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Module routes
  app.get('/api/courses/:courseId/modules', async (req, res) => {
    try {
      const modules = await storage.getModulesByCourse(req.params.courseId);
      res.json(modules);
    } catch (error: any) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.post('/api/courses/:courseId/modules', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const course = await storage.getCourse(req.params.courseId);
      
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Not authorized to add modules to this course" });
      }

      const moduleData = insertModuleSchema.parse({
        ...req.body,
        courseId: req.params.courseId,
      });

      const module = await storage.createModule(moduleData);
      res.status(201).json(module);
    } catch (error: any) {
      console.error("Error creating module:", error);
      res.status(400).json({ message: "Failed to create module", error: error.message });
    }
  });

  // Lesson routes
  app.get('/api/modules/:moduleId/lessons', async (req, res) => {
    try {
      const lessons = await storage.getLessonsByModule(req.params.moduleId);
      res.json(lessons);
    } catch (error: any) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.post('/api/modules/:moduleId/lessons', isAuthenticated, upload.single('video'), async (req: any, res) => {
    try {
      const lessonData = insertLessonSchema.parse({
        ...req.body,
        moduleId: req.params.moduleId,
        videoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });

      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error: any) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ message: "Failed to create lesson", error: error.message });
    }
  });

  // Enrollment routes
  app.post('/api/courses/:courseId/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.courseId;

      const enrollment = await storage.enrollUser({ userId, courseId });
      res.status(201).json(enrollment);
    } catch (error: any) {
      console.error("Error enrolling user:", error);
      res.status(400).json({ message: "Failed to enroll in course", error: error.message });
    }
  });

  app.get('/api/my-enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error: any) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.put('/api/enrollments/:courseId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress } = req.body;

      await storage.updateEnrollmentProgress(userId, req.params.courseId, progress);
      res.json({ message: "Progress updated successfully" });
    } catch (error: any) {
      console.error("Error updating progress:", error);
      res.status(400).json({ message: "Failed to update progress", error: error.message });
    }
  });

  // Review routes
  app.post('/api/courses/:courseId/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId,
        courseId: req.params.courseId,
      });

      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Failed to create review", error: error.message });
    }
  });

  app.get('/api/courses/:courseId/reviews', async (req, res) => {
    try {
      const reviews = await storage.getCourseReviews(req.params.courseId);
      res.json(reviews);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Progress tracking
  app.put('/api/lessons/:lessonId/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { completed, watchTime } = req.body;

      await storage.updateLessonProgress(userId, req.params.lessonId, completed, watchTime);
      res.json({ message: "Lesson progress updated" });
    } catch (error: any) {
      console.error("Error updating lesson progress:", error);
      res.status(400).json({ message: "Failed to update lesson progress", error: error.message });
    }
  });

  // Analytics
  app.get('/api/analytics/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get('/api/analytics/course/:courseId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const course = await storage.getCourse(req.params.courseId);
      
      if (!course || course.instructorId !== userId) {
        return res.status(403).json({ message: "Not authorized to view course analytics" });
      }

      const stats = await storage.getCourseStats(req.params.courseId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching course stats:", error);
      res.status(500).json({ message: "Failed to fetch course stats" });
    }
  });

  // Paystack payment routes
  app.post("/api/initialize-payment", isAuthenticated, async (req: any, res) => {
    try {
      const { amount, courseId } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user?.email) {
        return res.status(400).json({ message: "User email is required for payment" });
      }

      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const response = await paystack.transaction.initialize({
        email: user.email,
        amount: Math.round(amount * 100), // Convert to kobo (smallest currency unit)
        currency: "USD",
        reference: `course_${courseId}_${userId}_${Date.now()}`,
        metadata: {
          courseId,
          userId,
          courseName: course.title,
        },
        callback_url: `${req.protocol}://${req.hostname}/course/${courseId}?payment=success`,
      });

      res.json({
        authorizationUrl: response.data.authorization_url,
        accessCode: response.data.access_code,
        reference: response.data.reference,
      });
    } catch (error: any) {
      console.error("Paystack error:", error);
      res
        .status(500)
        .json({ message: "Error initializing payment: " + error.message });
    }
  });

  // Paystack webhook for payment verification
  app.post("/api/paystack/webhook", async (req, res) => {
    try {
      const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const { event, data } = req.body;

      if (event === 'charge.success') {
        const { reference, metadata, amount } = data;
        const { courseId, userId } = metadata;

        // Enroll user in course after successful payment
        await storage.enrollUser({ userId, courseId });
        
        console.log(`Payment successful: User ${userId} enrolled in course ${courseId}`);
      }

      res.status(200).json({ message: "Webhook processed" });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Verify payment endpoint
  app.post("/api/verify-payment", isAuthenticated, async (req: any, res) => {
    try {
      const { reference } = req.body;
      const userId = req.user.claims.sub;

      const verification = await paystack.transaction.verify(reference);
      
      if (verification.data.status === 'success') {
        const { metadata } = verification.data;
        const { courseId } = metadata;

        // Ensure the payment is for this user
        if (metadata.userId === userId) {
          // Enroll user in course
          await storage.enrollUser({ userId, courseId });
          res.json({ success: true, message: "Payment verified and user enrolled" });
        } else {
          res.status(403).json({ message: "Payment verification failed - user mismatch" });
        }
      } else {
        res.status(400).json({ message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(500).json({ message: "Error verifying payment: " + error.message });
    }
  });

  // File serving
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
