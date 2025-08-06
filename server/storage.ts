import {
  users,
  courses,
  modules,
  lessons,
  enrollments,
  reviews,
  lessonProgress,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Module,
  type InsertModule,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type Review,
  type InsertReview,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, ilike, avg, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;

  // Course operations
  getCourses(limit?: number, category?: string, search?: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getCourseWithInstructor(id: string): Promise<any>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: string): Promise<void>;
  getCoursesByInstructor(instructorId: string): Promise<Course[]>;

  // Module operations
  getModulesByCourse(courseId: string): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, module: Partial<InsertModule>): Promise<Module>;
  deleteModule(id: string): Promise<void>;

  // Lesson operations
  getLessonsByModule(moduleId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(id: string): Promise<void>;

  // Enrollment operations
  enrollUser(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<any[]>;
  getCourseEnrollments(courseId: string): Promise<Enrollment[]>;
  updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void>;

  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getCourseReviews(courseId: string): Promise<any[]>;

  // Progress tracking
  updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime?: number): Promise<void>;
  getUserLessonProgress(userId: string, lessonId: string): Promise<any>;

  // Analytics
  getUserStats(userId: string): Promise<any>;
  getCourseStats(courseId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Course operations
  async getCourses(limit = 20, category?: string, search?: string): Promise<Course[]> {
    let query = db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        shortDescription: courses.shortDescription,
        instructorId: courses.instructorId,
        category: courses.category,
        price: courses.price,
        thumbnailUrl: courses.thumbnailUrl,
        status: courses.status,
        duration: courses.duration,
        level: courses.level,
        rating: courses.rating,
        studentsCount: courses.studentsCount,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructorName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(courses)
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.status, "published"))
      .orderBy(desc(courses.createdAt))
      .limit(limit);

    if (category) {
      query = query.where(and(eq(courses.status, "published"), eq(courses.category, category)));
    }

    if (search) {
      query = query.where(
        and(
          eq(courses.status, "published"),
          ilike(courses.title, `%${search}%`)
        )
      );
    }

    return await query;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseWithInstructor(id: string): Promise<any> {
    const [course] = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        shortDescription: courses.shortDescription,
        instructorId: courses.instructorId,
        category: courses.category,
        price: courses.price,
        thumbnailUrl: courses.thumbnailUrl,
        status: courses.status,
        duration: courses.duration,
        level: courses.level,
        rating: courses.rating,
        studentsCount: courses.studentsCount,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        instructorName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
        instructorProfileImage: users.profileImageUrl,
      })
      .from(courses)
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.id, id));

    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.instructorId, instructorId))
      .orderBy(desc(courses.createdAt));
  }

  // Module operations
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(modules.order);
  }

  async createModule(module: InsertModule): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async updateModule(id: string, module: Partial<InsertModule>): Promise<Module> {
    const [updatedModule] = await db
      .update(modules)
      .set(module)
      .where(eq(modules.id, id))
      .returning();
    return updatedModule;
  }

  async deleteModule(id: string): Promise<void> {
    await db.delete(modules).where(eq(modules.id, id));
  }

  // Lesson operations
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson> {
    const [updatedLesson] = await db
      .update(lessons)
      .set(lesson)
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Enrollment operations
  async enrollUser(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    
    // Update course student count
    await db
      .update(courses)
      .set({
        studentsCount: sql`${courses.studentsCount} + 1`,
      })
      .where(eq(courses.id, enrollment.courseId));

    return newEnrollment;
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    return await db
      .select({
        id: enrollments.id,
        status: enrollments.status,
        progress: enrollments.progress,
        enrolledAt: enrollments.enrolledAt,
        completedAt: enrollments.completedAt,
        courseId: courses.id,
        courseTitle: courses.title,
        courseDescription: courses.shortDescription,
        courseThumbnail: courses.thumbnailUrl,
        courseInstructor: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }

  async updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<void> {
    await db
      .update(enrollments)
      .set({
        progress,
        completedAt: progress >= 100 ? new Date() : null,
        status: progress >= 100 ? "completed" : "active",
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update course rating
    const [avgRating] = await db
      .select({ avgRating: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.courseId, review.courseId));

    if (avgRating.avgRating) {
      await db
        .update(courses)
        .set({ rating: avgRating.avgRating.toString() })
        .where(eq(courses.id, review.courseId));
    }

    return newReview;
  }

  async getCourseReviews(courseId: string): Promise<any[]> {
    return await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: sql<string>`concat(${users.firstName}, ' ', ${users.lastName})`,
        userProfileImage: users.profileImageUrl,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.courseId, courseId))
      .orderBy(desc(reviews.createdAt));
  }

  // Progress tracking
  async updateLessonProgress(userId: string, lessonId: string, completed: boolean, watchTime = 0): Promise<void> {
    await db
      .insert(lessonProgress)
      .values({
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
        watchTime,
      })
      .onConflictDoUpdate({
        target: [lessonProgress.userId, lessonProgress.lessonId],
        set: {
          completed,
          completedAt: completed ? new Date() : null,
          watchTime,
        },
      });
  }

  async getUserLessonProgress(userId: string, lessonId: string): Promise<any> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    return progress;
  }

  // Analytics
  async getUserStats(userId: string): Promise<any> {
    const [stats] = await db
      .select({
        totalEnrollments: count(enrollments.id),
        completedCourses: count(sql`case when ${enrollments.status} = 'completed' then 1 end`),
        totalHoursLearned: sql<number>`coalesce(sum(case when ${enrollments.status} = 'completed' then ${courses.duration} else 0 end), 0)`,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId));

    return stats;
  }

  async getCourseStats(courseId: string): Promise<any> {
    const [stats] = await db
      .select({
        totalStudents: count(enrollments.id),
        completedStudents: count(sql`case when ${enrollments.status} = 'completed' then 1 end`),
        avgProgress: avg(enrollments.progress),
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    return stats;
  }
}

export const storage = new DatabaseStorage();
