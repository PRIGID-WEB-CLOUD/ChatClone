import {
  users,
  courses,
  modules,
  lessons,
  enrollments,
  reviews,
  lessonProgress,
  groups,
  groupMembers,
  groupPosts,
  videos,
  videoComments,
  events,
  eventAttendees,
  products,
  productPurchases,
  notifications,
  userProfiles,
  userBadges,
  userFollows,
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
  type Group,
  type InsertGroup,
  type Video,
  type InsertVideo,
  type Event,
  type InsertEvent,
  type Product,
  type InsertProduct,
  type GroupPost,
  type InsertGroupPost,
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

  // Group operations
  getGroups(limit?: number, search?: string, userId?: string): Promise<Group[]>;
  getGroup(id: string): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  joinGroup(userId: string, groupId: string): Promise<any>;
  getUserGroups(userId: string): Promise<any[]>;
  createGroupPost(post: InsertGroupPost): Promise<GroupPost>;
  getGroupPosts(groupId: string): Promise<any[]>;

  // Video operations
  getVideos(limit?: number, search?: string, filter?: string): Promise<any[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  getUserVideos(userId: string): Promise<Video[]>;
  updateVideoViews(id: string): Promise<void>;

  // Event operations
  getEvents(search?: string, status?: string): Promise<any[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  registerForEvent(userId: string, eventId: string): Promise<any>;
  getUserEvents(userId: string): Promise<any[]>;

  // Product operations
  getProducts(search?: string, type?: string): Promise<any[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getUserProducts(userId: string): Promise<Product[]>;
  purchaseProduct(userId: string, productId: string, amount: number): Promise<any>;

  // Notification operations
  getUserNotifications(userId: string, type?: string): Promise<any[]>;
  createNotification(userId: string, type: string, title: string, message?: string, actionUrl?: string): Promise<any>;
  markNotificationAsRead(notificationId: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
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

  // Group operations
  async getGroups(limit = 20, search?: string, userId?: string): Promise<Group[]> {
    let query = db.select().from(groups);
    
    if (search) {
      query = query.where(ilike(groups.name, `%${search}%`));
    }
    
    return query.orderBy(desc(groups.createdAt)).limit(limit);
  }

  async getGroup(id: string): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(groupData: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(groupData).returning();
    return group;
  }

  async joinGroup(userId: string, groupId: string): Promise<any> {
    const [membership] = await db.insert(groupMembers).values({
      userId,
      groupId,
      role: 'member'
    }).returning();
    return membership;
  }

  async getUserGroups(userId: string): Promise<any[]> {
    return db
      .select({
        id: groups.id,
        name: groups.name,
        description: groups.description,
        imageUrl: groups.imageUrl,
        type: groups.type,
        price: groups.price,
        membersCount: groups.membersCount,
        isPrivate: groups.isPrivate,
        createdAt: groups.createdAt,
        role: groupMembers.role,
      })
      .from(groups)
      .innerJoin(groupMembers, eq(groups.id, groupMembers.groupId))
      .where(eq(groupMembers.userId, userId))
      .orderBy(desc(groupMembers.joinedAt));
  }

  async createGroupPost(postData: InsertGroupPost): Promise<GroupPost> {
    const [post] = await db.insert(groupPosts).values(postData).returning();
    return post;
  }

  async getGroupPosts(groupId: string): Promise<any[]> {
    return db
      .select({
        id: groupPosts.id,
        content: groupPosts.content,
        attachments: groupPosts.attachments,
        likesCount: groupPosts.likesCount,
        repliesCount: groupPosts.repliesCount,
        createdAt: groupPosts.createdAt,
        author: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(groupPosts)
      .innerJoin(users, eq(groupPosts.authorId, users.id))
      .where(eq(groupPosts.groupId, groupId))
      .orderBy(desc(groupPosts.createdAt));
  }

  // Video operations
  async getVideos(limit = 20, search?: string, filter?: string): Promise<any[]> {
    let query = db
      .select({
        id: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailUrl: videos.thumbnailUrl,
        videoUrl: videos.videoUrl,
        duration: videos.duration,
        visibility: videos.visibility,
        status: videos.status,
        viewsCount: videos.viewsCount,
        likesCount: videos.likesCount,
        commentsCount: videos.commentsCount,
        tags: videos.tags,
        createdAt: videos.createdAt,
        uploader: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(videos)
      .innerJoin(users, eq(videos.uploaderId, users.id));

    if (search) {
      query = query.where(ilike(videos.title, `%${search}%`));
    }

    return query.orderBy(desc(videos.createdAt)).limit(limit);
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async createVideo(videoData: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(videoData).returning();
    return video;
  }

  async getUserVideos(userId: string): Promise<Video[]> {
    return db.select().from(videos).where(eq(videos.uploaderId, userId));
  }

  async updateVideoViews(id: string): Promise<void> {
    await db.update(videos).set({
      viewsCount: sql`${videos.viewsCount} + 1`
    }).where(eq(videos.id, id));
  }

  // Event operations
  async getEvents(search?: string, status?: string): Promise<any[]> {
    let query = db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        imageUrl: events.imageUrl,
        type: events.type,
        status: events.status,
        startTime: events.startTime,
        endTime: events.endTime,
        timezone: events.timezone,
        maxAttendees: events.maxAttendees,
        price: events.price,
        attendeesCount: events.attendeesCount,
        createdAt: events.createdAt,
        organizer: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(events)
      .innerJoin(users, eq(events.organizerId, users.id));

    if (search) {
      query = query.where(ilike(events.title, `%${search}%`));
    }

    if (status) {
      query = query.where(eq(events.status, status));
    }

    return query.orderBy(desc(events.startTime));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(eventData: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(eventData).returning();
    return event;
  }

  async registerForEvent(userId: string, eventId: string): Promise<any> {
    const [registration] = await db.insert(eventAttendees).values({
      userId,
      eventId
    }).returning();
    return registration;
  }

  async getUserEvents(userId: string): Promise<any[]> {
    return db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        imageUrl: events.imageUrl,
        type: events.type,
        status: events.status,
        startTime: events.startTime,
        endTime: events.endTime,
        timezone: events.timezone,
        price: events.price,
        registeredAt: eventAttendees.registeredAt,
        attended: eventAttendees.attended,
      })
      .from(events)
      .innerJoin(eventAttendees, eq(events.id, eventAttendees.eventId))
      .where(eq(eventAttendees.userId, userId))
      .orderBy(desc(events.startTime));
  }

  // Product operations
  async getProducts(search?: string, type?: string): Promise<any[]> {
    let query = db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        imageUrl: products.imageUrl,
        type: products.type,
        status: products.status,
        price: products.price,
        downloadCount: products.downloadCount,
        rating: products.rating,
        reviewsCount: products.reviewsCount,
        tags: products.tags,
        createdAt: products.createdAt,
        seller: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(products)
      .innerJoin(users, eq(products.sellerId, users.id));

    if (search) {
      query = query.where(ilike(products.title, `%${search}%`));
    }

    if (type) {
      query = query.where(eq(products.type, type));
    }

    return query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async getUserProducts(userId: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.sellerId, userId));
  }

  async purchaseProduct(userId: string, productId: string, amount: number): Promise<any> {
    const [purchase] = await db.insert(productPurchases).values({
      buyerId: userId,
      productId,
      amount: amount.toString()
    }).returning();
    return purchase;
  }

  // Notification operations
  async getUserNotifications(userId: string, type?: string): Promise<any[]> {
    let query = db.select().from(notifications).where(eq(notifications.userId, userId));
    
    if (type) {
      query = query.where(eq(notifications.type, type));
    }

    return query.orderBy(desc(notifications.createdAt));
  }

  async createNotification(userId: string, type: string, title: string, message?: string, actionUrl?: string): Promise<any> {
    const [notification] = await db.insert(notifications).values({
      userId,
      type,
      title,
      message,
      actionUrl
    }).returning();
    return notification;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await db.update(notifications).set({
      isRead: true
    }).where(eq(notifications.id, notificationId));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({
      isRead: true
    }).where(eq(notifications.userId, userId));
  }
}

export const storage = new DatabaseStorage();
