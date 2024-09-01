import { varchar, pgTable, serial, text } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('mockInterviews',{
    id:serial('id').primaryKey(),
    jsonMockResponse:text('jsonMockResponse').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDescription:varchar('jobDescription').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdOn:varchar('createdOn').notNull(),
    mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('userAnswers',{
    id:serial('id').primaryKey(),
    mockIdReference:varchar('mockIdReference').notNull(),
    question:varchar('question').notNull(),
    correctAnswer:text('correctAnswer'),
    userAnswer:text('userAnswer'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdOn:varchar('createdOn')
})

export const SubscriptionData=pgTable('subscriptions', {
    subscriptionId: serial('subscriptionId').primaryKey(),
    customerEmail: varchar('customerEmail').notNull(),
    startDate: varchar('startDate').notNull(),
    endDate:varchar('endDate').notNull(),
    subscriptionType: varchar('subscriptionType').notNull()
})