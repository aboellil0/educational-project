import { Request, Response } from 'express';
import Lesson, { ILesson } from '../models/lesson.model';
import Homework, { IHomework } from '../models/homework.model';
import User, { IUser } from '../models/user.model';

export const getPublicLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find({ type: "public" });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public lessons', error });
  }
}

export const getPrivateLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find({ type: "private" });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching private lessons', error });
  }
}

